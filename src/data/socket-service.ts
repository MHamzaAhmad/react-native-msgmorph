/**
 * MsgMorph React Native SDK - Socket Service
 */

import { io, Socket } from 'socket.io-client';
import { SocketEvents } from '../core/constants';
import type { ChatMessage, ChatSession } from '../core/types';

export type SocketEventCallback<T> = (data: T) => void;

export class SocketService {
    private socket: Socket | null = null;
    private serverUrl: string;
    private visitorId: string;
    private sessionId: string;
    private isConnected = false;
    private isConnecting = false;

    // Callbacks
    private onMessageCallbacks: SocketEventCallback<ChatMessage>[] = [];
    private onSessionUpdateCallbacks: SocketEventCallback<Partial<ChatSession>>[] = [];
    private onSessionClosedCallbacks: SocketEventCallback<string>[] = [];
    private onAgentTypingCallbacks: SocketEventCallback<boolean>[] = [];
    private onConnectionChangeCallbacks: SocketEventCallback<boolean>[] = [];
    private onErrorCallbacks: SocketEventCallback<string>[] = [];

    constructor(serverUrl: string, visitorId: string, sessionId: string) {
        this.serverUrl = serverUrl;
        this.visitorId = visitorId;
        this.sessionId = sessionId;
    }

    get connected(): boolean {
        return this.isConnected;
    }

    get connecting(): boolean {
        return this.isConnecting;
    }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.isConnected || this.isConnecting) {
                resolve();
                return;
            }

            this.isConnecting = true;
            this.notifyConnectionChange(false);

            try {
                // Construct the chat namespace URL
                const chatUrl = this.serverUrl.endsWith('/')
                    ? `${this.serverUrl}chat`
                    : `${this.serverUrl}/chat`;

                this.socket = io(chatUrl, {
                    transports: ['websocket'],
                    query: {
                        userType: 'visitor',
                        visitorId: this.visitorId,
                        sessionId: this.sessionId,
                    },
                    reconnection: true,
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000,
                });

                this.setupListeners(resolve, reject);
            } catch (error) {
                this.isConnecting = false;
                reject(error);
            }
        });
    }

    private setupListeners(resolve: () => void, reject: (error: Error) => void): void {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            this.isConnected = true;
            this.isConnecting = false;
            this.notifyConnectionChange(true);

            // Join the session room
            this.socket?.emit(SocketEvents.JOIN_SESSION, { sessionId: this.sessionId });
            resolve();
        });

        this.socket.on('disconnect', () => {
            this.isConnected = false;
            this.notifyConnectionChange(false);
        });

        this.socket.on('connect_error', (error) => {
            this.isConnecting = false;
            this.notifyError(`Connection error: ${error.message}`);
            reject(error);
        });

        this.socket.on('error', (error) => {
            this.notifyError(`Socket error: ${error}`);
        });

        // Listen for new messages
        this.socket.on(SocketEvents.NEW_MESSAGE, (data: ChatMessage) => {
            this.onMessageCallbacks.forEach(cb => cb(data));
        });

        // Listen for session updates
        this.socket.on(SocketEvents.SESSION_UPDATED, (data: Partial<ChatSession>) => {
            if (data.id === this.sessionId || !data.id) {
                this.onSessionUpdateCallbacks.forEach(cb => cb(data));
            }
        });

        // Listen for session closed
        this.socket.on(SocketEvents.SESSION_CLOSED, (data: { sessionId: string; reason?: string }) => {
            if (data.sessionId === this.sessionId) {
                this.onSessionClosedCallbacks.forEach(cb => cb(data.reason || 'Chat session ended'));
            }
        });

        // Listen for agent typing
        this.socket.on(SocketEvents.AGENT_TYPING, (data: { sessionId: string }) => {
            if (data.sessionId === this.sessionId) {
                this.onAgentTypingCallbacks.forEach(cb => cb(true));

                // Auto-clear after 5 seconds
                setTimeout(() => {
                    this.onAgentTypingCallbacks.forEach(cb => cb(false));
                }, 5000);
            }
        });
    }

    private notifyConnectionChange(connected: boolean): void {
        this.onConnectionChangeCallbacks.forEach(cb => cb(connected));
    }

    private notifyError(error: string): void {
        this.onErrorCallbacks.forEach(cb => cb(error));
    }

    // Event listeners
    onMessage(callback: SocketEventCallback<ChatMessage>): () => void {
        this.onMessageCallbacks.push(callback);
        return () => {
            this.onMessageCallbacks = this.onMessageCallbacks.filter(cb => cb !== callback);
        };
    }

    onSessionUpdate(callback: SocketEventCallback<Partial<ChatSession>>): () => void {
        this.onSessionUpdateCallbacks.push(callback);
        return () => {
            this.onSessionUpdateCallbacks = this.onSessionUpdateCallbacks.filter(cb => cb !== callback);
        };
    }

    onSessionClosed(callback: SocketEventCallback<string>): () => void {
        this.onSessionClosedCallbacks.push(callback);
        return () => {
            this.onSessionClosedCallbacks = this.onSessionClosedCallbacks.filter(cb => cb !== callback);
        };
    }

    onAgentTyping(callback: SocketEventCallback<boolean>): () => void {
        this.onAgentTypingCallbacks.push(callback);
        return () => {
            this.onAgentTypingCallbacks = this.onAgentTypingCallbacks.filter(cb => cb !== callback);
        };
    }

    onConnectionChange(callback: SocketEventCallback<boolean>): () => void {
        this.onConnectionChangeCallbacks.push(callback);
        return () => {
            this.onConnectionChangeCallbacks = this.onConnectionChangeCallbacks.filter(cb => cb !== callback);
        };
    }

    onError(callback: SocketEventCallback<string>): () => void {
        this.onErrorCallbacks.push(callback);
        return () => {
            this.onErrorCallbacks = this.onErrorCallbacks.filter(cb => cb !== callback);
        };
    }

    // Emit events
    emitTyping(): void {
        this.socket?.emit(SocketEvents.VISITOR_TYPING, { sessionId: this.sessionId });
    }

    emitStopTyping(): void {
        this.socket?.emit(SocketEvents.VISITOR_STOP_TYPING, { sessionId: this.sessionId });
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.emit(SocketEvents.LEAVE_SESSION, { sessionId: this.sessionId });
            this.socket.disconnect();
            this.socket = null;
        }
        this.isConnected = false;
        this.isConnecting = false;
    }

    dispose(): void {
        this.disconnect();
        this.onMessageCallbacks = [];
        this.onSessionUpdateCallbacks = [];
        this.onSessionClosedCallbacks = [];
        this.onAgentTypingCallbacks = [];
        this.onConnectionChangeCallbacks = [];
        this.onErrorCallbacks = [];
    }
}
