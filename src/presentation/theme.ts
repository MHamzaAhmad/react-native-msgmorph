/**
 * MsgMorph React Native SDK - Theme
 */

import { StyleSheet } from 'react-native';
import type { WidgetBranding } from '../core/types';

export interface MsgMorphTheme {
    primaryColor: string;
    textColor: string;
    secondaryTextColor: string;
    backgroundColor: string;
    surfaceColor: string;
    borderColor: string;
}

export function createTheme(branding?: WidgetBranding): MsgMorphTheme {
    const primaryColor = branding?.primaryColor || '#007AFF';

    return {
        primaryColor,
        textColor: '#1C1C1E',
        secondaryTextColor: '#8E8E93',
        backgroundColor: '#FFFFFF',
        surfaceColor: '#F2F2F7',
        borderColor: '#E5E5EA',
    };
}

export function createStyles(theme: MsgMorphTheme) {
    return StyleSheet.create({
        // Container
        container: {
            flex: 1,
            backgroundColor: theme.backgroundColor,
        },

        // Header
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor,
        },
        headerTitle: {
            fontSize: 17,
            fontWeight: '600',
            color: theme.textColor,
        },
        headerButton: {
            padding: 4,
        },

        // Typography
        heading: {
            fontSize: 24,
            fontWeight: '700',
            color: theme.textColor,
        },
        subheading: {
            fontSize: 15,
            color: theme.secondaryTextColor,
            marginTop: 4,
        },
        sectionTitle: {
            fontSize: 12,
            fontWeight: '600',
            color: theme.secondaryTextColor,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },

        // Buttons
        primaryButton: {
            backgroundColor: theme.primaryColor,
            borderRadius: 20,
            paddingVertical: 14,
            paddingHorizontal: 24,
            alignItems: 'center',
            justifyContent: 'center',
        },
        primaryButtonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '600',
        },
        secondaryButton: {
            backgroundColor: theme.surfaceColor,
            borderRadius: 20,
            paddingVertical: 14,
            paddingHorizontal: 24,
            alignItems: 'center',
            justifyContent: 'center',
        },
        secondaryButtonText: {
            color: theme.textColor,
            fontSize: 16,
            fontWeight: '500',
        },
        pillButton: {
            backgroundColor: theme.surfaceColor,
            borderRadius: 20,
            paddingVertical: 12,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
        },
        pillButtonText: {
            fontSize: 14,
            fontWeight: '500',
            color: theme.textColor,
            marginLeft: 8,
        },

        // Input
        input: {
            backgroundColor: theme.surfaceColor,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            fontSize: 16,
            color: theme.textColor,
            minHeight: 48,
        },
        textArea: {
            minHeight: 120,
            textAlignVertical: 'top',
        },

        // Card
        card: {
            backgroundColor: theme.backgroundColor,
            borderRadius: 16,
            padding: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },

        // Footer
        footer: {
            paddingVertical: 12,
            borderTopWidth: 1,
            borderTopColor: theme.borderColor,
            alignItems: 'center',
        },
        footerText: {
            fontSize: 12,
            color: theme.secondaryTextColor,
        },

        // Misc
        row: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        center: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        flex1: {
            flex: 1,
        },
    });
}

export type MsgMorphStyles = ReturnType<typeof createStyles>;
