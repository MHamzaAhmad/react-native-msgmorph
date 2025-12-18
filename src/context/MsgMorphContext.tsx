/**
 * MsgMorph React Native SDK - Context
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { ApiClient } from '../data/api-client';
import { storageService } from '../data/storage-service';
import { ChatClient } from '../core/ChatClient';
import type {
    WidgetConfig,
    FeedbackType,
    WidgetScreen,
    DeviceContext,
    ChatSession,
    ChatMessage,
    StartChatResult,
} from '../core/types';
import { MsgMorphModal } from '../presentation/MsgMorphModal';

/** Start chat parameters */
export interface StartChatParams {
    initialMessage?: string;
    visitorName?: string;
    visitorEmail?: string;
    subject?: string;
    metadata?: Record<string, unknown>;
    deviceContext?: DeviceContext;
}

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

    // UI Actions
    show: () => void;
    showFeedback: (type?: FeedbackType) => void;
    showLiveChat: () => void;
    hide: () => void;
    loadConfig: () => Promise<WidgetConfig | null>;

    // Feedback API
    submitFeedback: (params: {
        type: FeedbackType;
        content: string;
        email?: string;
        name?: string;
        deviceContext?: DeviceContext;
    }) => Promise<boolean>;

    // Chat API (Headless)
    checkAvailability: () => Promise<boolean>;
    getActiveSession: () => Promise<ChatSession | null>;
    startChat: (params?: StartChatParams) => Promise<StartChatResult>;
    getMessages: (sessionId: string) => Promise<ChatMessage[]>;
    sendMessage: (sessionId: string, content: string, visitorName?: string) => Promise<ChatMessage>;
    rateChat: (sessionId: string, rating: number, feedback?: string) => Promise<void>;
    requestHandoff: (sessionId: string) => Promise<void>;
    createChatClient: (sessionId: string) => ChatClient;
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

    // ==================== UI Actions ====================

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

    // ==================== Feedback API ====================

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

    // ==================== Chat API (Headless) ====================

    const checkAvailability = useCallback(async (): Promise<boolean> => {
        if (!apiClient.current) return false;
        return apiClient.current.checkAvailability(widgetId);
    }, [widgetId]);

    const getActiveSession = useCallback(async (): Promise<ChatSession | null> => {
        if (!apiClient.current || !visitorId) return null;
        const result = await apiClient.current.recoverSession(widgetId, visitorId);
        return result?.session ?? null;
    }, [widgetId, visitorId]);

    const startChat = useCallback(async (params?: StartChatParams): Promise<StartChatResult> => {
        if (!apiClient.current) {
            throw new Error('MsgMorph not initialized');
        }

        const vid = visitorId || await storageService.getOrCreateVisitorId();

        return apiClient.current.startChat({
            widgetId,
            visitorId: vid,
            visitorName: params?.visitorName,
            visitorEmail: params?.visitorEmail,
            initialMessage: params?.initialMessage,
            subject: params?.subject,
            metadata: params?.metadata,
        });
    }, [widgetId, visitorId]);

    const getMessages = useCallback(async (sessionId: string): Promise<ChatMessage[]> => {
        if (!apiClient.current) return [];
        return apiClient.current.getMessages(widgetId, sessionId);
    }, [widgetId]);

    const sendMessage = useCallback(async (
        sessionId: string,
        content: string,
        visitorName?: string
    ): Promise<ChatMessage> => {
        if (!apiClient.current) {
            throw new Error('MsgMorph not initialized');
        }

        const vid = visitorId || await storageService.getOrCreateVisitorId();

        return apiClient.current.sendMessage(widgetId, sessionId, content, vid, visitorName);
    }, [widgetId, visitorId]);

    const rateChat = useCallback(async (
        sessionId: string,
        rating: number,
        feedback?: string
    ): Promise<void> => {
        if (!apiClient.current) return;
        await apiClient.current.rateChat(widgetId, sessionId, rating, feedback);
    }, [widgetId]);

    const requestHandoff = useCallback(async (sessionId: string): Promise<void> => {
        if (!apiClient.current) return;
        const vid = visitorId || await storageService.getOrCreateVisitorId();
        await apiClient.current.requestHandoff(widgetId, sessionId, vid);
    }, [widgetId, visitorId]);

    const createChatClient = useCallback((sessionId: string): ChatClient => {
        const vid = visitorId || 'anonymous';
        return new ChatClient(apiBaseUrl, sessionId, vid);
    }, [apiBaseUrl, visitorId]);

    // ==================== Context Value ====================

    const value: MsgMorphContextValue = {
        isInitialized,
        config,
        isLoading,
        error,
        apiClient: apiClient.current,
        widgetId,
        visitorId,
        // UI Actions
        show,
        showFeedback,
        showLiveChat,
        hide,
        loadConfig,
        // Feedback API
        submitFeedback,
        // Chat API
        checkAvailability,
        getActiveSession,
        startChat,
        getMessages,
        sendMessage,
        rateChat,
        requestHandoff,
        createChatClient,
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
