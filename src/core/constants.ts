/**
 * MsgMorph React Native SDK - Constants
 */

/** API endpoint paths */
export const ApiEndpoints = {
    BASE_PATH: '/api/v1',

    // Widget endpoints - all use widgetId (publicId) as identifier
    widgetConfig: (widgetId: string) => `/api/v1/widget/${widgetId}/config`,
    submitFeedback: (widgetId: string) => `/api/v1/widget/${widgetId}/feedback`,

    // Chat endpoints - now under widget namespace
    checkAvailability: (widgetId: string) => `/api/v1/widget/${widgetId}/chat/availability`,
    activeSession: (widgetId: string) => `/api/v1/widget/${widgetId}/chat/sessions/active`,
    startChat: (widgetId: string) => `/api/v1/widget/${widgetId}/chat/sessions`,
    sessionMessages: (widgetId: string, sessionId: string) => `/api/v1/widget/${widgetId}/chat/sessions/${sessionId}/messages`,
    rateSession: (widgetId: string, sessionId: string) => `/api/v1/widget/${widgetId}/chat/sessions/${sessionId}/rate`,
    requestHandoff: (widgetId: string, sessionId: string) => `/api/v1/widget/${widgetId}/chat/sessions/${sessionId}/handoff`,
} as const;

/** Socket.io event names */
export const SocketEvents = {
    // Client -> Server
    JOIN_SESSION: 'session:join',
    LEAVE_SESSION: 'session:leave',
    VISITOR_TYPING: 'visitor:typing',
    VISITOR_STOP_TYPING: 'visitor:stop-typing',

    // Server -> Client
    NEW_MESSAGE: 'message:new',
    SESSION_UPDATED: 'session:updated',
    SESSION_CLOSED: 'session:closed',
    AGENT_TYPING: 'agent:typing',
    AGENT_JOINED: 'agent:joined',
} as const;

/** Local storage keys */
export const StorageKeys = {
    VISITOR_ID: 'msgmorph_visitor_id',
    ACTIVE_SESSION_ID: 'msgmorph_active_session',
} as const;

/** Feedback types */
export const FeedbackTypes = {
    ISSUE: 'ISSUE',
    FEATURE_REQUEST: 'FEATURE_REQUEST',
    FEEDBACK: 'FEEDBACK',
    OTHER: 'OTHER',
} as const;

export type FeedbackType = keyof typeof FeedbackTypes;

/** Feedback type metadata */
export const FeedbackTypeMeta: Record<FeedbackType, { emoji: string; label: string; placeholder: string }> = {
    ISSUE: { emoji: '🐛', label: 'Bug Report', placeholder: 'I found a bug when...' },
    FEATURE_REQUEST: { emoji: '💡', label: 'Idea', placeholder: 'It would be great if...' },
    FEEDBACK: { emoji: '💬', label: 'Feedback', placeholder: 'I think...' },
    OTHER: { emoji: '✨', label: 'Other', placeholder: 'I wanted to say...' },
};

/** Chat session status */
export const ChatSessionStatus = {
    PENDING: 'PENDING',
    ACTIVE: 'ACTIVE',
    TRANSFERRING: 'TRANSFERRING',
    CLOSED: 'CLOSED',
    EXPIRED: 'EXPIRED',
} as const;

export type ChatSessionStatusType = keyof typeof ChatSessionStatus;

/** Message sender type */
export const MessageSenderType = {
    VISITOR: 'VISITOR',
    AGENT: 'AGENT',
    SYSTEM: 'SYSTEM',
} as const;

export type MessageSenderTypeValue = keyof typeof MessageSenderType;

/** Collection requirement */
export const CollectionRequirement = {
    REQUIRED: 'required',
    OPTIONAL: 'optional',
    NONE: 'none',
} as const;

export type CollectionRequirementType = 'required' | 'optional' | 'none';
