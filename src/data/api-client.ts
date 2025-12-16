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

    async getWidgetConfig(publicId: string): Promise<WidgetConfig> {
        return this.request<WidgetConfig>(ApiEndpoints.widgetConfig(publicId));
    }

    async submitFeedback(publicId: string, data: FeedbackRequest): Promise<FeedbackResponse> {
        // Clean up data: remove empty strings for email/name to avoid validation errors
        const cleanedData = {
            ...data,
            email: data.email?.trim() || undefined,
            name: data.name?.trim() || undefined,
        };

        return this.request<FeedbackResponse>(ApiEndpoints.submitFeedback(publicId), {
            method: 'POST',
            body: JSON.stringify(cleanedData),
        });
    }


    // ==================== Chat API ====================

    async startChat(params: {
        projectId: string;
        visitorId: string;
        visitorName?: string;
        visitorEmail?: string;
        initialMessage?: string;
        subject?: string;
        metadata?: Record<string, unknown>;
    }): Promise<StartChatResult> {
        return this.request<StartChatResult>(ApiEndpoints.startChat, {
            method: 'POST',
            body: JSON.stringify(params),
        });
    }

    async recoverSession(visitorId: string, projectId: string): Promise<StartChatResult | null> {
        try {
            const params = new URLSearchParams({ visitorId, projectId });
            const result = await this.request<StartChatResult>(
                `${ApiEndpoints.activeSession}?${params}`
            );
            return result.session ? result : null;
        } catch {
            return null;
        }
    }

    async getMessages(sessionId: string): Promise<ChatMessage[]> {
        const result = await this.request<{ messages: ChatMessage[] }>(
            ApiEndpoints.sessionMessages(sessionId)
        );
        return result.messages || [];
    }

    async sendMessage(
        sessionId: string,
        content: string,
        visitorId: string,
        visitorName?: string
    ): Promise<ChatMessage> {
        return this.request<ChatMessage>(ApiEndpoints.sendVisitorMessage(sessionId), {
            method: 'POST',
            headers: this.getHeaders(visitorId, visitorName),
            body: JSON.stringify({ content }),
        });
    }

    async rateChat(sessionId: string, rating: number, feedback?: string): Promise<void> {
        await this.request<void>(ApiEndpoints.rateSession(sessionId), {
            method: 'POST',
            body: JSON.stringify({ rating, feedback }),
        });
    }

    async checkAvailability(projectId: string): Promise<boolean> {
        try {
            const params = new URLSearchParams({ projectId });
            const result = await this.request<{ isAvailable: boolean }>(
                `${ApiEndpoints.checkAvailability}?${params}`
            );
            return result.isAvailable ?? false;
        } catch {
            return false;
        }
    }
}
