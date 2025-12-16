/**
 * MsgMorph React Native SDK - Inline Button
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useMsgMorph } from '../../context/MsgMorphContext';
import type { FeedbackType } from '../../core/types';

export interface InlineButtonProps {
    /** Button text */
    text?: string;
    /** Text color override */
    color?: string;
    /** Feedback type to open directly */
    feedbackType?: FeedbackType;
    /** Custom style */
    style?: object;
}

export function InlineButton({
    text = 'Send Feedback',
    color,
    feedbackType,
    style,
}: InlineButtonProps) {
    const { show, showFeedback, config } = useMsgMorph();

    const primaryColor = color || config?.branding?.primaryColor || '#007AFF';

    const handlePress = () => {
        if (feedbackType) {
            showFeedback(feedbackType);
        } else {
            show();
        }
    };

    return (
        <TouchableOpacity style={[styles.container, style]} onPress={handlePress}>
            <Text style={[styles.text, { color: primaryColor }]}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    text: {
        fontSize: 14,
        fontWeight: '500',
    },
});
