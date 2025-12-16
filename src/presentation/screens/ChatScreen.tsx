/**
 * MsgMorph React Native SDK - Chat Screen
 */

import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import type { WidgetConfig, ChatMessage } from '../../core/types';
import type { MsgMorphTheme, MsgMorphStyles } from '../theme';
import { ChatProvider, useChat } from '../../context/ChatContext';
import { useMsgMorph } from '../../context/MsgMorphContext';
import { MessageBubble } from '../components/MessageBubble';
import { TypingIndicator } from '../components/TypingIndicator';

interface ChatScreenProps {
    config: WidgetConfig;
    theme: MsgMorphTheme;
    styles: MsgMorphStyles;
    preChatData?: { name?: string; email?: string };
    onClose: () => void;
    onBack: () => void;
    onEnd: () => void;
}

function ChatScreenContent({
    config,
    theme,
    styles,
    preChatData,
    onClose,
    onBack,
    onEnd,
}: ChatScreenProps) {
    const {
        session,
        messages,
        isConnecting,
        isConnected,
        isSending,
        isAgentTyping,
        error,
        isSessionActive,
        isSessionClosed,
        startChat,
        sendMessage,
        onTyping,
        endSession,
    } = useChat();

    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    // Start chat on mount
    useEffect(() => {
        startChat({
            visitorName: preChatData?.name,
            visitorEmail: preChatData?.email,
        });
    }, [startChat, preChatData]);

    // Scroll to bottom on new messages
    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages.length]);

    const handleSend = async () => {
        if (!inputText.trim()) return;
        const text = inputText.trim();
        setInputText('');
        await sendMessage(text);
    };

    const handleClose = () => {
        if (isSessionActive) {
            onEnd();
        } else {
            onClose();
        }
    };

    const handleNewChat = () => {
        endSession();
        startChat({
            visitorName: preChatData?.name,
            visitorEmail: preChatData?.email,
        });
    };

    // Loading state
    if (isConnecting && !session) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={theme.primaryColor} />
                <Text style={[styles.subheading, { marginTop: 16 }]}>Connecting...</Text>
            </View>
        );
    }

    // Error state
    if (error && !session) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={{ fontSize: 48, marginBottom: 16 }}>⚠️</Text>
                <Text style={[styles.heading, { fontSize: 18 }]}>Connection failed</Text>
                <Text style={styles.subheading}>Please try again</Text>
                <TouchableOpacity
                    style={[styles.secondaryButton, { marginTop: 24 }]}
                    onPress={onBack}
                >
                    <Text style={styles.secondaryButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const agentName = session?.assignedAgentName || 'Live Chat';

    // Prepare data for FlatList
    const listData: (ChatMessage | { type: 'greeting' } | { type: 'typing' })[] = [];

    // Add greeting if no messages
    if (messages.length === 0 && config.liveChatGreeting) {
        listData.push({ type: 'greeting' as const });
    }

    // Add messages
    listData.push(...messages);

    // Add typing indicator
    if (isAgentTyping) {
        listData.push({ type: 'typing' as const });
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.headerButton}>
                    <Text style={{ fontSize: 24, color: theme.secondaryTextColor }}>‹</Text>
                </TouchableOpacity>

                {/* Agent Avatar */}
                <View style={[localStyles.agentAvatar, { backgroundColor: theme.primaryColor }]}>
                    <Text style={{ fontSize: 14, color: '#FFF' }}>🎧</Text>
                </View>

                {/* Agent Info */}
                <View style={localStyles.agentInfo}>
                    <Text style={[localStyles.agentName, { color: theme.textColor }]}>
                        {agentName}
                    </Text>
                    <View style={styles.row}>
                        <View
                            style={[
                                localStyles.statusDot,
                                { backgroundColor: isConnected ? '#34C759' : '#8E8E93' },
                            ]}
                        />
                        <Text style={{ fontSize: 12, color: theme.secondaryTextColor }}>
                            {isSessionClosed ? 'Ended' : isConnected ? 'Online' : 'Reconnecting...'}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity onPress={handleClose} style={styles.headerButton}>
                    <Text style={{ fontSize: 24, color: theme.secondaryTextColor }}>×</Text>
                </TouchableOpacity>
            </View>

            {/* Messages */}
            <FlatList
                ref={flatListRef}
                data={listData}
                keyExtractor={(item, index) => {
                    if ('type' in item) return `${item.type}_${index}`;
                    return item.id;
                }}
                renderItem={({ item }) => {
                    if ('type' in item) {
                        if (item.type === 'greeting') {
                            return (
                                <MessageBubble
                                    message={{
                                        id: 'greeting',
                                        sessionId: '',
                                        senderType: 'SYSTEM',
                                        senderId: '',
                                        content: config.liveChatGreeting || '',
                                        createdAt: new Date().toISOString(),
                                    }}
                                    theme={theme}
                                    isGreeting
                                />
                            );
                        }
                        if (item.type === 'typing') {
                            return <TypingIndicator theme={theme} />;
                        }
                    }
                    return <MessageBubble message={item as ChatMessage} theme={theme} />;
                }}
                contentContainerStyle={localStyles.messageList}
                showsVerticalScrollIndicator={false}
            />

            {/* Input or Closed Banner */}
            {isSessionActive ? (
                <View style={[localStyles.inputContainer, { borderTopColor: theme.borderColor }]}>
                    <TextInput
                        style={[localStyles.input, { backgroundColor: theme.surfaceColor }]}
                        placeholder="Type a message..."
                        placeholderTextColor={theme.secondaryTextColor}
                        value={inputText}
                        onChangeText={(text) => {
                            setInputText(text);
                            onTyping();
                        }}
                        onSubmitEditing={handleSend}
                        editable={isConnected}
                    />
                    <TouchableOpacity
                        style={[localStyles.sendButton, { backgroundColor: theme.primaryColor }]}
                        onPress={handleSend}
                        disabled={!inputText.trim() || isSending || !isConnected}
                    >
                        {isSending ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <Text style={{ color: '#FFF', fontSize: 18 }}>↑</Text>
                        )}
                    </TouchableOpacity>
                </View>
            ) : isSessionClosed ? (
                <View style={[localStyles.closedBanner, { backgroundColor: theme.surfaceColor }]}>
                    <Text style={{ color: theme.textColor, fontWeight: '500' }}>Chat has ended</Text>
                    <TouchableOpacity onPress={handleNewChat}>
                        <Text style={{ color: theme.primaryColor, fontWeight: '500', marginTop: 8 }}>
                            Start new chat
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : null}
        </View>
    );
}

export function ChatScreen(props: ChatScreenProps) {
    const { apiClient } = useMsgMorph();

    if (!apiClient) return null;

    return (
        <ChatProvider
            projectId={props.config.projectId}
            apiBaseUrl={(apiClient as any).baseUrl || 'https://api.msgmorph.com'}
        >
            <ChatScreenContent {...props} />
        </ChatProvider>
    );
}

const localStyles = StyleSheet.create({
    agentAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },
    agentInfo: {
        flex: 1,
        marginLeft: 10,
    },
    agentName: {
        fontSize: 15,
        fontWeight: '600',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 4,
    },
    messageList: {
        padding: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderTopWidth: 1,
    },
    input: {
        flex: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
        maxHeight: 100,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    closedBanner: {
        padding: 16,
        alignItems: 'center',
    },
});
