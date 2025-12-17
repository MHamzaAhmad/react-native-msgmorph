/**
 * MsgMorph React Native SDK - Compose Screen
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import type { WidgetConfig, FeedbackType } from '../../core/types';
import type { MsgMorphTheme, MsgMorphStyles } from '../theme';
import { FeedbackTypeMeta, CollectionRequirement } from '../../core/constants';
import { useMsgMorph } from '../../context/MsgMorphContext';
import { collectDeviceContext } from '../../core/context-collector';

interface ComposeScreenProps {
    config: WidgetConfig;
    theme: MsgMorphTheme;
    styles: MsgMorphStyles;
    feedbackType: FeedbackType;
    onClose: () => void;
    onBack: () => void;
    onSubmitted: () => void;
}

export function ComposeScreen({
    config,
    theme,
    styles,
    feedbackType,
    onClose,
    onBack,
    onSubmitted,
}: ComposeScreenProps) {
    const { submitFeedback } = useMsgMorph();

    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [showContactFields, setShowContactFields] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const meta = FeedbackTypeMeta[feedbackType] || FeedbackTypeMeta.OTHER;
    const needsContact =
        config.collectEmail !== CollectionRequirement.NONE ||
        config.collectName !== CollectionRequirement.NONE;

    const handleSubmit = async () => {
        if (!message.trim()) return;

        // Validate required fields
        if (config.collectEmail === CollectionRequirement.REQUIRED && !email.trim()) {
            setShowContactFields(true);
            setError('Email is required');
            return;
        }

        if (config.collectName === CollectionRequirement.REQUIRED && !name.trim()) {
            setShowContactFields(true);
            setError('Name is required');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Collect comprehensive device context
            const deviceContext = collectDeviceContext();

            const success = await submitFeedback({
                type: feedbackType,
                content: message.trim(),
                email: email.trim() || undefined,
                name: name.trim() || undefined,
                deviceContext,
            });

            if (success) {
                onSubmitted();
            } else {
                setError('Failed to submit feedback. Please try again.');
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to submit feedback');
        } finally {
            setIsSubmitting(false);
        }
    };

    const hasMessage = message.trim().length > 0;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.headerButton}>
                    <Text style={{ fontSize: 24, color: theme.secondaryTextColor }}>‹</Text>
                </TouchableOpacity>
                <View style={styles.flex1} />
                <TouchableOpacity onPress={onClose} style={styles.headerButton}>
                    <Text style={{ fontSize: 24, color: theme.secondaryTextColor }}>×</Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView contentContainerStyle={localStyles.content}>
                {/* Type Badge */}
                <View style={[localStyles.typeBadge, { backgroundColor: `${theme.primaryColor}15` }]}>
                    <Text style={{ fontSize: 14 }}>{meta.emoji}</Text>
                    <Text style={[localStyles.typeBadgeText, { color: theme.primaryColor }]}>
                        {meta.label}
                    </Text>
                </View>

                {/* Message Input */}
                <TextInput
                    style={[styles.input, styles.textArea, { marginTop: 16 }]}
                    placeholder={meta.placeholder}
                    placeholderTextColor={theme.secondaryTextColor}
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    textAlignVertical="top"
                />

                {/* Contact Fields Toggle */}
                {needsContact && !showContactFields && (
                    <TouchableOpacity
                        style={localStyles.contactToggle}
                        onPress={() => setShowContactFields(true)}
                    >
                        <Text style={{ color: theme.secondaryTextColor }}>
                            + Add your contact info
                            {(config.collectEmail === CollectionRequirement.REQUIRED ||
                                config.collectName === CollectionRequirement.REQUIRED) && (
                                    <Text style={{ color: '#FF3B30' }}> *</Text>
                                )}
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Contact Fields */}
                {needsContact && showContactFields && (
                    <View style={[localStyles.contactFields, { backgroundColor: theme.surfaceColor }]}>
                        {config.collectName !== CollectionRequirement.NONE && (
                            <TextInput
                                style={[styles.input, { marginBottom: 12 }]}
                                placeholder={
                                    config.collectName === CollectionRequirement.REQUIRED ? 'Name *' : 'Name'
                                }
                                placeholderTextColor={theme.secondaryTextColor}
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                            />
                        )}
                        {config.collectEmail !== CollectionRequirement.NONE && (
                            <TextInput
                                style={styles.input}
                                placeholder={
                                    config.collectEmail === CollectionRequirement.REQUIRED ? 'Email *' : 'Email'
                                }
                                placeholderTextColor={theme.secondaryTextColor}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        )}
                    </View>
                )}

                {/* Error */}
                {error && (
                    <Text style={localStyles.error}>{error}</Text>
                )}
            </ScrollView>

            {/* Send Bar */}
            <View style={[localStyles.sendBar, { borderTopColor: theme.borderColor }]}>
                <Text style={{ color: theme.secondaryTextColor, fontSize: 12 }}>
                    {hasMessage ? `${message.length} characters` : ''}
                </Text>
                <TouchableOpacity
                    style={[
                        styles.primaryButton,
                        !hasMessage || isSubmitting ? { opacity: 0.5 } : null,
                    ]}
                    onPress={handleSubmit}
                    disabled={!hasMessage || isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                        <Text style={styles.primaryButtonText}>Send ✓</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const localStyles = StyleSheet.create({
    content: {
        padding: 20,
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    typeBadgeText: {
        fontSize: 13,
        fontWeight: '500',
        marginLeft: 6,
    },
    contactToggle: {
        marginTop: 16,
    },
    contactFields: {
        marginTop: 16,
        padding: 16,
        borderRadius: 12,
    },
    error: {
        marginTop: 12,
        color: '#FF3B30',
        fontSize: 13,
    },
    sendBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
    },
});
