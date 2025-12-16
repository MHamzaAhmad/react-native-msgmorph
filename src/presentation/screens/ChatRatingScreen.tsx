/**
 * MsgMorph React Native SDK - Chat Rating Screen
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import type { MsgMorphTheme, MsgMorphStyles } from '../theme';
import { useChat } from '../../context/ChatContext';

interface ChatRatingScreenProps {
    theme: MsgMorphTheme;
    styles: MsgMorphStyles;
    onComplete: () => void;
    onSkip: () => void;
}

export function ChatRatingScreen({
    theme,
    styles,
    onComplete,
    onSkip,
}: ChatRatingScreenProps) {
    const { rateChat } = useChat();
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const handleSubmit = async () => {
        if (rating > 0) {
            await rateChat(rating, feedback.trim() || undefined);
        }
        onComplete();
    };

    return (
        <View style={[styles.container, styles.center, { padding: 32 }]}>
            <Text style={[styles.heading, { textAlign: 'center' }]}>
                How was your experience?
            </Text>
            <Text style={[styles.subheading, { textAlign: 'center' }]}>
                Your feedback helps us improve
            </Text>

            {/* Star Rating */}
            <View style={localStyles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                        <Text
                            style={[
                                localStyles.star,
                                { color: rating >= star ? '#FFD60A' : theme.secondaryTextColor },
                            ]}
                        >
                            ★
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Feedback Input */}
            {rating > 0 && (
                <TextInput
                    style={[styles.input, styles.textArea, { marginTop: 24, width: '100%' }]}
                    placeholder="Additional feedback (optional)"
                    placeholderTextColor={theme.secondaryTextColor}
                    value={feedback}
                    onChangeText={setFeedback}
                    multiline
                    textAlignVertical="top"
                />
            )}

            {/* Submit Button */}
            <TouchableOpacity
                style={[
                    styles.primaryButton,
                    { marginTop: 24, width: '100%' },
                    rating === 0 && { opacity: 0.5 },
                ]}
                onPress={handleSubmit}
                disabled={rating === 0}
            >
                <Text style={styles.primaryButtonText}>Submit</Text>
            </TouchableOpacity>

            {/* Skip Button */}
            <TouchableOpacity style={{ marginTop: 16 }} onPress={onSkip}>
                <Text style={{ color: theme.secondaryTextColor }}>Skip</Text>
            </TouchableOpacity>
        </View>
    );
}

const localStyles = StyleSheet.create({
    starsContainer: {
        flexDirection: 'row',
        marginTop: 24,
        gap: 8,
    },
    star: {
        fontSize: 36,
    },
});
