/**
 * MsgMorph React Native SDK - Home Screen
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, ActivityIndicator } from 'react-native';
import type { WidgetConfig, FeedbackType } from '../../core/types';
import type { MsgMorphTheme, MsgMorphStyles } from '../theme';
import { FeedbackTypeMeta } from '../../core/constants';
import { useMsgMorph } from '../../context/MsgMorphContext';

interface HomeScreenProps {
    config: WidgetConfig;
    theme: MsgMorphTheme;
    styles: MsgMorphStyles;
    onClose: () => void;
    onSelectFeedbackType: (type: FeedbackType) => void;
    onStartLiveChat: () => void;
    onShowOffline: () => void;
}

export function HomeScreen({
    config,
    theme,
    styles,
    onClose,
    onSelectFeedbackType,
    onStartLiveChat,
    onShowOffline,
}: HomeScreenProps) {
    const { apiClient } = useMsgMorph();

    const feedbackItems = config.items.filter(
        (item) => item.isEnabled && ['ISSUE', 'FEATURE_REQUEST', 'FEEDBACK', 'OTHER'].includes(item.type)
    );
    const hasLiveChat = config.items.some((item) => item.type === 'LIVE_CHAT' && item.isEnabled);


    const handleLiveChatPress = () => {
        onStartLiveChat();
    };

    // Determine live chat subtitle
    const getLiveChatSubtitle = () => {
        return 'Instant AI support • Humans available on request';
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                {config.branding.logoUrl ? (
                    <Image
                        source={{ uri: config.branding.logoUrl }}
                        style={localStyles.logo}
                        resizeMode="contain"
                    />
                ) : (
                    <View style={[localStyles.logoPlaceholder, { backgroundColor: theme.primaryColor }]} />
                )}
                <TouchableOpacity onPress={onClose} style={styles.headerButton}>
                    <Text style={{ fontSize: 24, color: theme.secondaryTextColor }}>×</Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView contentContainerStyle={localStyles.content}>
                {/* Greeting */}
                <Text style={styles.heading}>
                    {config.branding.title || 'Hey there 👋'}
                </Text>
                <Text style={styles.subheading}>
                    {config.branding.subtitle || 'How can we help you today?'}
                </Text>

                {/* Feedback Types */}
                {feedbackItems.length > 0 && (
                    <View style={localStyles.section}>
                        <Text style={styles.sectionTitle}>Send us a message</Text>
                        <View style={localStyles.pillGroup}>
                            {feedbackItems.map((item) => {
                                const meta = FeedbackTypeMeta[item.type as FeedbackType] || FeedbackTypeMeta.OTHER;
                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={styles.pillButton}
                                        onPress={() => onSelectFeedbackType(item.type as FeedbackType)}
                                    >
                                        <Text style={{ fontSize: 16 }}>{meta.emoji}</Text>
                                        <Text style={styles.pillButtonText}>{item.label}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                )}

                {/* Live Chat */}
                {hasLiveChat && (
                    <TouchableOpacity
                        style={[localStyles.liveChatButton, { backgroundColor: theme.textColor }]}
                        onPress={handleLiveChatPress}
                    >
                        <View style={localStyles.liveChatIcon}>
                            <Text style={{ fontSize: 20 }}>💬</Text>
                        </View>
                        <View style={localStyles.liveChatText}>
                            <Text style={localStyles.liveChatTitle}>Chat with us</Text>
                            <View style={localStyles.subtitleRow}>
                                <View
                                    style={[
                                        localStyles.statusDot,
                                        { backgroundColor: '#34C759' },
                                    ]}
                                />
                                <Text style={localStyles.liveChatSubtitle}>{getLiveChatSubtitle()}</Text>
                            </View>
                        </View>
                        <Text style={localStyles.liveChatArrow}>›</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Powered by <Text style={{ fontWeight: '600' }}>MsgMorph</Text>
                </Text>
            </View>
        </View>
    );
}

const localStyles = StyleSheet.create({
    logo: {
        width: 32,
        height: 32,
        borderRadius: 8,
    },
    logoPlaceholder: {
        width: 32,
        height: 32,
        borderRadius: 8,
    },
    content: {
        padding: 20,
    },
    section: {
        marginTop: 24,
    },
    pillGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 12,
    },
    liveChatButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginTop: 24,
    },
    liveChatIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    liveChatText: {
        flex: 1,
        marginLeft: 12,
    },
    liveChatTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    liveChatSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        marginTop: 2,
    },
    liveChatArrow: {
        fontSize: 24,
        color: 'rgba(255,255,255,0.5)',
    },
    subtitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 4,
    },
});

