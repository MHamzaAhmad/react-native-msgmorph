/**
 * MsgMorph React Native SDK - Chat Context
 */

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useRef,
    type ReactNode,
} from 'react';
import { ApiClient } from '../data/api-client';
import { SocketService } from '../data/socket-service';
import { storageService } from '../data/storage-service';
import type { ChatSession, ChatMessage } from '../core/types';
import { ChatSessionStatus } from '../core/constants';

interface ChatContextValue {
    // State
    session: ChatSession | null;
    messages: ChatMessage[];
    isConnecting: boolean;
    isConnected: boolean;
    isSending: boolean;
    isAgentTyping: boolean;
    error: string | null;

    // Derived
    isSessionActive: boolean;
    isSessionClosed: boolean;
    hasSession: boolean;

    // Actions
    startChat: (params?: { visitorName?: string; visitorEmail?: string; initialMessage?: string }) => Promise<boolean>;
    sendMessage: (content: string) => Promise<boolean>;
    rateChat: (rating: number, feedback?: string) => Promise<boolean>;
    onTyping: () => void;
    endSession: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export interface ChatProviderProps {
    children: ReactNode;
    projectId: string;
    apiBaseUrl: string;
}

export function ChatProvider({ children, projectId, apiBaseUrl }: ChatProviderProps) {
    const [session, setSession] = useState<ChatSession | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isAgentTyping, setIsAgentTyping] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const apiClient = useRef(new ApiClient(apiBaseUrl));
    const socketService = useRef<SocketService | null>(null);
    const visitorIdRef = useRef<string | null>(null);
    const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            socketService.current?.dispose();
            if (typingTimeout.current) {
                clearTimeout(typingTimeout.current);
            }
        };
    }, []);

    const isSessionActive = session?.status === ChatSessionStatus.ACTIVE || session?.status === ChatSessionStatus.PENDING;
    const isSessionClosed = session?.status === ChatSessionStatus.CLOSED || session?.status === ChatSessionStatus.EXPIRED;
    const hasSession = session !== null;

    const setupSocketListeners = useCallback(() => {
        if (!socketService.current) return;

        socketService.current.onMessage((message) => {
            // Avoid duplicates
            setMessages((prev) => {
                if (prev.some((m) => m.id === message.id)) return prev;
                return [...prev, message];
            });
        });

        socketService.current.onSessionUpdate((update) => {
            setSession((prev) => (prev ? { ...prev, ...update } : null));
        });

        socketService.current.onSessionClosed(() => {
            setSession((prev) => (prev ? { ...prev, status: ChatSessionStatus.CLOSED } : null));
        });

        socketService.current.onAgentTyping((typing) => {
            setIsAgentTyping(typing);
        });

        socketService.current.onConnectionChange((connected) => {
            setIsConnected(connected);
        });

        socketService.current.onError((err) => {
            setError(err);
        });
    }, []);

    const startChat = useCallback(async (params?: {
        visitorName?: string;
        visitorEmail?: string;
        initialMessage?: string;
    }) => {
        setIsConnecting(true);
        setError(null);

        try {
            // Get visitor ID
            const visitorId = await storageService.getOrCreateVisitorId();
            visitorIdRef.current = visitorId;

            // Try to recover existing session
            let result = await apiClient.current.recoverSession(visitorId, projectId);

            // Start new session if no active one
            if (!result) {
                result = await apiClient.current.startChat({
                    projectId,
                    visitorId,
                    visitorName: params?.visitorName,
                    visitorEmail: params?.visitorEmail,
                    initialMessage: params?.initialMessage,
                });
            }

            if (!result?.session) {
                throw new Error('Failed to start chat session');
            }

            setSession(result.session);
            await storageService.setActiveSessionId(result.session.id);

            // Load existing messages
            const existingMessages = await apiClient.current.getMessages(result.session.id);
            setMessages(existingMessages);

            // Connect to socket
            socketService.current = new SocketService(
                apiBaseUrl,
                visitorId,
                result.session.id
            );
            setupSocketListeners();
            await socketService.current.connect();

            setIsConnecting(false);
            return true;
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to start chat');
            setIsConnecting(false);
            return false;
        }
    }, [projectId, apiBaseUrl, setupSocketListeners]);

    const sendMessage = useCallback(async (content: string) => {
        if (!session || !visitorIdRef.current) return false;

        setIsSending(true);
        setError(null);

        // Optimistic update
        const tempId = `temp_${Date.now()}`;
        const optimisticMessage: ChatMessage = {
            id: tempId,
            sessionId: session.id,
            senderType: 'VISITOR',
            senderId: visitorIdRef.current,
            content,
            createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, optimisticMessage]);

        try {
            const sentMessage = await apiClient.current.sendMessage(
                session.id,
                content,
                visitorIdRef.current,
                session.visitorName
            );

            // Replace optimistic message with real one
            setMessages((prev) =>
                prev.map((m) => (m.id === tempId ? sentMessage : m))
            );

            socketService.current?.emitStopTyping();
            setIsSending(false);
            return true;
        } catch (e) {
            // Remove optimistic message on failure
            setMessages((prev) => prev.filter((m) => m.id !== tempId));
            setError(e instanceof Error ? e.message : 'Failed to send message');
            setIsSending(false);
            return false;
        }
    }, [session]);

    const rateChat = useCallback(async (rating: number, feedback?: string) => {
        if (!session) return false;

        try {
            await apiClient.current.rateChat(session.id, rating, feedback);
            return true;
        } catch {
            return false;
        }
    }, [session]);

    const onTyping = useCallback(() => {
        socketService.current?.emitTyping();

        // Clear previous timeout
        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }

        // Stop typing indicator after 3 seconds of inactivity
        typingTimeout.current = setTimeout(() => {
            socketService.current?.emitStopTyping();
        }, 3000);
    }, []);

    const endSession = useCallback(() => {
        socketService.current?.dispose();
        socketService.current = null;
        setSession(null);
        setMessages([]);
        setIsConnected(false);
        storageService.setActiveSessionId(null);
    }, []);

    const value: ChatContextValue = {
        session,
        messages,
        isConnecting,
        isConnected,
        isSending,
        isAgentTyping,
        error,
        isSessionActive,
        isSessionClosed,
        hasSession,
        startChat,
        sendMessage,
        rateChat,
        onTyping,
        endSession,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatContextValue {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}
