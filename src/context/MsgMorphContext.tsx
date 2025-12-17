/**
 * MsgMorph React Native SDK - Context
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { ApiClient } from '../data/api-client';
import { storageService } from '../data/storage-service';
import type { WidgetConfig, MsgMorphConfig, FeedbackType, WidgetScreen, DeviceContext } from '../core/types';
import { MsgMorphModal } from '../presentation/MsgMorphModal';

interface MsgMorphContextValue {
    // State
    isInitialized: boolean;
    config: WidgetConfig | null;
    isLoading: boolean;
    error: string | null;

    // Services
    apiClient: ApiClient | null;
    widgetId: string;
    visitorId: string | null;

    // Actions
    show: () => void;
    showFeedback: (type?: FeedbackType) => void;
    showLiveChat: () => void;
    hide: () => void;
    loadConfig: () => Promise<WidgetConfig | null>;
    submitFeedback: (params: {
        type: FeedbackType;
        content: string;
        email?: string;
        name?: string;
        deviceContext?: DeviceContext;
    }) => Promise<boolean>;
}

const MsgMorphContext = createContext<MsgMorphContextValue | null>(null);

export interface MsgMorphProviderProps {
    children: ReactNode;
    widgetId: string;
    apiBaseUrl?: string;
}

export function MsgMorphProvider({
    children,
    widgetId,
    apiBaseUrl = 'https://api.msgmorph.com'
}: MsgMorphProviderProps) {
    const [isInitialized, setIsInitialized] = useState(false);
    const [config, setConfig] = useState<WidgetConfig | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [visitorId, setVisitorId] = useState<string | null>(null);

    // Modal state
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [initialScreen, setInitialScreen] = useState<WidgetScreen>('home');
    const [initialFeedbackType, setInitialFeedbackType] = useState<FeedbackType | undefined>();

    const apiClient = useRef<ApiClient | null>(null);

    // Initialize on mount
    useEffect(() => {
        const init = async () => {
            apiClient.current = new ApiClient(apiBaseUrl);

            // Get or create visitor ID
            const vid = await storageService.getOrCreateVisitorId();
            setVisitorId(vid);

            // Load config
            try {
                setIsLoading(true);
                const widgetConfig = await apiClient.current.getWidgetConfig(widgetId);
                setConfig(widgetConfig);
                setIsInitialized(true);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Failed to load widget config');
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, [widgetId, apiBaseUrl]);

    const loadConfig = useCallback(async () => {
        if (!apiClient.current) return null;

        setIsLoading(true);
        setError(null);

        try {
            const widgetConfig = await apiClient.current.getWidgetConfig(widgetId);
            setConfig(widgetConfig);
            return widgetConfig;
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Failed to load config';
            setError(message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [widgetId]);

    const show = useCallback(() => {
        setInitialScreen('home');
        setInitialFeedbackType(undefined);
        setIsModalVisible(true);
    }, []);

    const showFeedback = useCallback((type?: FeedbackType) => {
        setInitialScreen('compose');
        setInitialFeedbackType(type);
        setIsModalVisible(true);
    }, []);

    const showLiveChat = useCallback(() => {
        if (config?.preChatForm?.enabled) {
            setInitialScreen('preChatForm');
        } else {
            setInitialScreen('liveChat');
        }
        setInitialFeedbackType(undefined);
        setIsModalVisible(true);
    }, [config?.preChatForm?.enabled]);

    const hide = useCallback(() => {
        setIsModalVisible(false);
    }, []);

    const submitFeedback = useCallback(async (params: {
        type: FeedbackType;
        content: string;
        email?: string;
        name?: string;
        deviceContext?: DeviceContext;
    }) => {
        if (!apiClient.current) return false;

        try {
            await apiClient.current.submitFeedback(widgetId, {
                type: params.type,
                content: params.content,
                email: params.email,
                name: params.name,
                deviceContext: params.deviceContext,
            });
            return true;
        } catch {
            return false;
        }
    }, [widgetId]);

    const value: MsgMorphContextValue = {
        isInitialized,
        config,
        isLoading,
        error,
        apiClient: apiClient.current,
        widgetId,
        visitorId,
        show,
        showFeedback,
        showLiveChat,
        hide,
        loadConfig,
        submitFeedback,
    };

    return (
        <MsgMorphContext.Provider value={value}>
            {children}
            {config && (
                <MsgMorphModal
                    visible={isModalVisible}
                    onClose={hide}
                    config={config}
                    initialScreen={initialScreen}
                    initialFeedbackType={initialFeedbackType}
                />
            )}
        </MsgMorphContext.Provider>
    );
}

export function useMsgMorph(): MsgMorphContextValue {
    const context = useContext(MsgMorphContext);
    if (!context) {
        throw new Error('useMsgMorph must be used within a MsgMorphProvider');
    }
    return context;
}
