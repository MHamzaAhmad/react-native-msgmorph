/**
 * MsgMorph React Native SDK - Chat Client
 *
 * Real-time chat client for live updates.
 * Provides a clean API for receiving messages and events.
 */

import { SocketService, type SocketEventCallback } from '../data/socket-service';
import type { ChatMessage, ChatSession } from './types';

/**
 * Real-time chat client for live updates
 *
 * Provides methods for receiving real-time messages and events,
 * as well as emitting typing status.
 *
 * @example
 * ```typescript
 * const chatClient = createChatClient(serverUrl, sessionId, visitorId);
 * await chatClient.connect();
 *
 * chatClient.onMessage((message) => {
 *   console.log('New message:', message.content);
 * });
 *
 * chatClient.onAgentTyping((isTyping) => {
 *   console.log('Agent typing:', isTyping);
 * });
 *
 * // Send typing indicator
 * chatClient.sendTypingStart();
 *
 * // Cleanup when done
 * chatClient.disconnect();
 * ```
 */
export class ChatClient {
    private socket: SocketService;

    constructor(serverUrl: string, sessionId: string, visitorId: string) {
        this.socket = new SocketService(serverUrl, visitorId, sessionId);
    }

    /** Whether the client is connected */
    get isConnected(): boolean {
        return this.socket.connected;
    }

    /** Whether the client is connecting */
    get isConnecting(): boolean {
        return this.socket.connecting;
    }

    /** Connect to the chat server */
    connect(): Promise<void> {
        return this.socket.connect();
    }

    /** Disconnect from the chat server */
    disconnect(): void {
        this.socket.disconnect();
    }

    // ==================== Event Listeners ====================

    /**
     * Listen for new messages
     * @returns Unsubscribe function
     */
    onMessage(callback: SocketEventCallback<ChatMessage>): () => void {
        return this.socket.onMessage(callback);
    }

    /**
     * Listen for session updates
     * @returns Unsubscribe function
     */
    onSessionUpdate(callback: SocketEventCallback<Partial<ChatSession>>): () => void {
        return this.socket.onSessionUpdate(callback);
    }

    /**
     * Listen for session closed events
     * @returns Unsubscribe function
     */
    onSessionClosed(callback: SocketEventCallback<string>): () => void {
        return this.socket.onSessionClosed(callback);
    }

    /**
     * Listen for agent typing status
     * @returns Unsubscribe function
     */
    onAgentTyping(callback: SocketEventCallback<boolean>): () => void {
        return this.socket.onAgentTyping(callback);
    }

    /**
     * Listen for connection status changes
     * @returns Unsubscribe function
     */
    onConnectionChange(callback: SocketEventCallback<boolean>): () => void {
        return this.socket.onConnectionChange(callback);
    }

    /**
     * Listen for errors
     * @returns Unsubscribe function
     */
    onError(callback: SocketEventCallback<string>): () => void {
        return this.socket.onError(callback);
    }

    // ==================== Actions ====================

    /** Emit typing started event */
    sendTypingStart(): void {
        this.socket.emitTyping();
    }

    /** Emit typing stopped event */
    sendTypingStop(): void {
        this.socket.emitStopTyping();
    }

    /** Dispose resources */
    dispose(): void {
        this.socket.dispose();
    }
}
