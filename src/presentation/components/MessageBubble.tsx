/**
 * MsgMorph React Native SDK - Message Bubble
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ChatMessage } from '../../core/types';
import type { MsgMorphTheme } from '../theme';

interface MessageBubbleProps {
    message: ChatMessage;
    theme: MsgMorphTheme;
    isGreeting?: boolean;
}

export function MessageBubble({ message, theme, isGreeting }: MessageBubbleProps) {
    const isVisitor = message.senderType === 'VISITOR';
    const isSystem = message.senderType === 'SYSTEM';

    // System message (non-greeting)
    if (isSystem && !isGreeting) {
        return (
            <View style={localStyles.systemContainer}>
                <View style={[localStyles.systemBubble, { backgroundColor: theme.surfaceColor }]}>
                    <Text style={[localStyles.systemText, { color: theme.secondaryTextColor }]}>
                        {message.content}
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View
            style={[
                localStyles.container,
                isVisitor ? localStyles.visitorContainer : localStyles.agentContainer,
            ]}
        >
            {/* Avatar for agent/greeting */}
            {!isVisitor && (
                <View style={[localStyles.avatar, { backgroundColor: theme.primaryColor }]}>
                    <Text style={{ fontSize: 12, color: '#FFF' }}>
                        {isGreeting ? '💬' : '🎧'}
                    </Text>
                </View>
            )}

            {/* Bubble */}
            <View
                style={[
                    localStyles.bubble,
                    isVisitor
                        ? [localStyles.visitorBubble, { backgroundColor: theme.primaryColor }]
                        : [localStyles.agentBubble, { backgroundColor: theme.surfaceColor }],
                ]}
            >
                <Text
                    style={[
                        localStyles.messageText,
                        { color: isVisitor ? '#FFF' : theme.textColor },
                    ]}
                >
                    {message.content}
                </Text>
            </View>
        </View>
    );
}

const localStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginVertical: 4,
    },
    visitorContainer: {
        justifyContent: 'flex-end',
    },
    agentContainer: {
        justifyContent: 'flex-start',
    },
    systemContainer: {
        alignItems: 'center',
        marginVertical: 8,
    },
    systemBubble: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    systemText: {
        fontSize: 12,
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    bubble: {
        maxWidth: '75%',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 16,
    },
    visitorBubble: {
        borderBottomRightRadius: 4,
    },
    agentBubble: {
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 21,
    },
});
