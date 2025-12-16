/**
 * MsgMorph React Native SDK - Pre-Chat Form Screen
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from 'react-native';
import type { WidgetConfig } from '../../core/types';
import type { MsgMorphTheme, MsgMorphStyles } from '../theme';

interface PreChatFormScreenProps {
    config: WidgetConfig;
    theme: MsgMorphTheme;
    styles: MsgMorphStyles;
    onClose: () => void;
    onBack: () => void;
    onSubmit: (name: string, email: string) => void;
}

export function PreChatFormScreen({
    config,
    theme,
    styles,
    onClose,
    onBack,
    onSubmit,
}: PreChatFormScreenProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);

    const preChatForm = config.preChatForm;
    const fields = preChatForm?.fields || [];

    const handleSubmit = () => {
        // Validate required fields
        for (const field of fields) {
            if (!field.required) continue;

            if (field.type === 'email' && !email.trim()) {
                setError('Email is required');
                return;
            }
            if (field.type === 'text' && field.id === 'name' && !name.trim()) {
                setError('Name is required');
                return;
            }
        }

        // Validate email format
        if (email.trim()) {
            const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
            if (!emailRegex.test(email.trim())) {
                setError('Please enter a valid email');
                return;
            }
        }

        onSubmit(name.trim(), email.trim());
    };

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
                <Text style={styles.heading}>Start a conversation</Text>
                <Text style={styles.subheading}>Fill out the form below to chat with us</Text>

                {/* Fields */}
                {fields.map((field) => {
                    if (field.type === 'email') {
                        return (
                            <TextInput
                                key={field.id}
                                style={[styles.input, { marginTop: 16 }]}
                                placeholder={`${field.label}${field.required ? ' *' : ''}`}
                                placeholderTextColor={theme.secondaryTextColor}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        );
                    }
                    if (field.id === 'name' || field.label.toLowerCase().includes('name')) {
                        return (
                            <TextInput
                                key={field.id}
                                style={[styles.input, { marginTop: 16 }]}
                                placeholder={`${field.label}${field.required ? ' *' : ''}`}
                                placeholderTextColor={theme.secondaryTextColor}
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                            />
                        );
                    }
                    return null;
                })}

                {/* Error */}
                {error && <Text style={localStyles.error}>{error}</Text>}

                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.primaryButton, { marginTop: 24 }]}
                    onPress={handleSubmit}
                >
                    <Text style={styles.primaryButtonText}>Start Chat</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const localStyles = StyleSheet.create({
    content: {
        padding: 20,
    },
    error: {
        marginTop: 12,
        color: '#FF3B30',
        fontSize: 13,
    },
});
