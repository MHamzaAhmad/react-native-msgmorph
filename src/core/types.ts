/**
 * MsgMorph React Native SDK - Types
 */

import type { CollectionRequirementType, ChatSessionStatusType, MessageSenderTypeValue } from './constants';

/** Widget branding configuration */
export interface WidgetBranding {
    primaryColor?: string;
    position?: 'bottom-right' | 'bottom-left';
    title?: string;
    subtitle?: string;
    logoUrl?: string;
    thankYouMessage?: string;
}

/** Widget menu item */
export interface WidgetItem {
    id: string;
    type: 'ISSUE' | 'FEATURE_REQUEST' | 'FEEDBACK' | 'OTHER' | 'LIVE_CHAT' | 'LINK';
    label: string;
    isEnabled: boolean;
    icon?: string;
    meta?: unknown;
}

/** Custom field configuration */
export interface CustomField {
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'checkbox';
    required: boolean;
    options?: string[];
}

/** Pre-chat form field */
export interface PreChatFormField {
    id: string;
    label: string;
    type: 'text' | 'email' | 'select';
    required: boolean;
    options?: string[];
}

/** Pre-chat form configuration */
export interface PreChatForm {
    enabled: boolean;
    fields: PreChatFormField[];
}

/** Widget configuration */
export interface WidgetConfig {
    id?: string;
    projectId: string;
    publicId: string;
    isEnabled?: boolean;
    branding: WidgetBranding;
    items: WidgetItem[];
    collectEmail: CollectionRequirementType;
    collectName: CollectionRequirementType;
    customFields?: CustomField[];
    liveChatGreeting?: string;
    offlineMessage?: string;
    showWaitTime?: boolean;
    preChatForm?: PreChatForm;
}

/** Chat session */
export interface ChatSession {
    id: string;
    projectId: string;
    visitorId: string;
    roomId: string;
    status: ChatSessionStatusType;
    organizationId?: string;
    visitorName?: string;
    visitorEmail?: string;
    assignedAgentId?: string;
    assignedAgentName?: string;
    subject?: string;
    tags?: string[];
    messageCount?: number;
    lastMessageAt?: string;
    createdAt?: string;
}

/** Message attachment */
export interface MessageAttachment {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
}

/** Chat message */
export interface ChatMessage {
    id: string;
    sessionId: string;
    senderType: MessageSenderTypeValue;
    senderId: string;
    senderName?: string;
    content: string;
    type?: string;
    attachments?: MessageAttachment[];
    isRead?: boolean;
    createdAt: string;
}

/** Device context for feedback */
export interface DeviceContext {
    screenWidth?: number;
    screenHeight?: number;
    platform?: string;
    language?: string;
    timezone?: string;
    appVersion?: string;
}

/** Feedback submission request */
export interface FeedbackRequest {
    type: string;
    content: string;
    email?: string;
    name?: string;
    customFields?: Record<string, unknown>;
    deviceContext?: DeviceContext;
}

/** Feedback response */
export interface FeedbackResponse {
    success: boolean;
    messageId: string;
}

/** Start chat result */
export interface StartChatResult {
    session: ChatSession;
    roomId: string;
}

/** MsgMorph initialization config */
export interface MsgMorphConfig {
    widgetId: string;
    apiBaseUrl?: string;
}

/** Widget screen states */
export type WidgetScreen = 'home' | 'compose' | 'success' | 'liveChat' | 'preChatForm' | 'chatRating';

/** Feedback type alias */
export type FeedbackType = 'ISSUE' | 'FEATURE_REQUEST' | 'FEEDBACK' | 'OTHER';
