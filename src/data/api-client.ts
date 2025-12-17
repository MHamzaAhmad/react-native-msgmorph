/**
 * MsgMorph React Native SDK - API Client
 */

import { ApiEndpoints } from '../core/constants';
import type {
    WidgetConfig,
    FeedbackRequest,
    FeedbackResponse,
    ChatSession,
    ChatMessage,
    StartChatResult,
} from '../core/types';

export class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private getHeaders(visitorId?: string, visitorName?: string): Record<string, string> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (visitorId) headers['X-Visitor-Id'] = visitorId;
        if (visitorName) headers['X-Visitor-Name'] = visitorName;
        return headers;
    }

    private async request<T>(
        path: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${path}`;

        const response = await fetch(url, {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...(options.headers || {}),
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `Request failed: ${response.status}`);
        }

        if (response.status === 204) {
            return {} as T;
        }

        return response.json();
    }

    // ==================== Widget API ====================

    async getWidgetConfig(widgetId: string): Promise<WidgetConfig> {
        return this.request<WidgetConfig>(ApiEndpoints.widgetConfig(widgetId));
    }

    async submitFeedback(widgetId: string, data: FeedbackRequest): Promise<FeedbackResponse> {
        // Clean up data: remove empty strings for email/name to avoid validation errors
        // Convert type to lowercase to match API schema
        const cleanedData = {
            ...data,
            type: data.type.toLowerCase(),
            email: data.email?.trim() || undefined,
            name: data.name?.trim() || undefined,
        };

        return this.request<FeedbackResponse>(ApiEndpoints.submitFeedback(widgetId), {
            method: 'POST',
            body: JSON.stringify(cleanedData),
        });
    }


    // ==================== Chat API ====================

    async startChat(params: {
        widgetId: string;
        visitorId: string;
        visitorName?: string;
        visitorEmail?: string;
        initialMessage?: string;
        subject?: string;
        metadata?: Record<string, unknown>;
    }): Promise<StartChatResult> {
        const { widgetId, ...body } = params;
        return this.request<StartChatResult>(ApiEndpoints.startChat(widgetId), {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async recoverSession(widgetId: string, visitorId: string): Promise<StartChatResult | null> {
        try {
            const params = new URLSearchParams({ visitorId });
            const result = await this.request<StartChatResult>(
                `${ApiEndpoints.activeSession(widgetId)}?${params}`
            );
            return result.session ? result : null;
        } catch {
            return null;
        }
    }

    async getMessages(widgetId: string, sessionId: string): Promise<ChatMessage[]> {
        const result = await this.request<{ messages: ChatMessage[] }>(
            ApiEndpoints.sessionMessages(widgetId, sessionId)
        );
        return result.messages || [];
    }

    async sendMessage(
        widgetId: string,
        sessionId: string,
        content: string,
        visitorId: string,
        visitorName?: string
    ): Promise<ChatMessage> {
        return this.request<ChatMessage>(ApiEndpoints.sessionMessages(widgetId, sessionId), {
            method: 'POST',
            headers: this.getHeaders(visitorId, visitorName),
            body: JSON.stringify({ content }),
        });
    }

    async rateChat(widgetId: string, sessionId: string, rating: number, feedback?: string): Promise<void> {
        await this.request<void>(ApiEndpoints.rateSession(widgetId, sessionId), {
            method: 'POST',
            body: JSON.stringify({ rating, feedback }),
        });
    }

    async requestHandoff(widgetId: string, sessionId: string, visitorId: string): Promise<void> {
        await this.request<void>(ApiEndpoints.requestHandoff(widgetId, sessionId), {
            method: 'POST',
            headers: this.getHeaders(visitorId),
        });
    }

    async checkAvailability(widgetId: string): Promise<boolean> {
        try {
            const result = await this.request<{ isAvailable: boolean }>(
                ApiEndpoints.checkAvailability(widgetId)
            );
            return result.isAvailable ?? false;
        } catch {
            return false;
        }
    }
}

