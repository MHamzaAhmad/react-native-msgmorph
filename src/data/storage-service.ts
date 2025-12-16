/**
 * MsgMorph React Native SDK - Storage Service
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from '../core/constants';

class StorageService {
    async getOrCreateVisitorId(): Promise<string> {
        let visitorId = await this.getVisitorId();
        if (!visitorId) {
            visitorId = this.generateVisitorId();
            await this.setVisitorId(visitorId);
        }
        return visitorId;
    }

    async getVisitorId(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(StorageKeys.VISITOR_ID);
        } catch {
            return null;
        }
    }

    async setVisitorId(visitorId: string): Promise<void> {
        try {
            await AsyncStorage.setItem(StorageKeys.VISITOR_ID, visitorId);
        } catch {
            // Ignore storage errors
        }
    }

    async getActiveSessionId(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(StorageKeys.ACTIVE_SESSION_ID);
        } catch {
            return null;
        }
    }

    async setActiveSessionId(sessionId: string | null): Promise<void> {
        try {
            if (sessionId === null) {
                await AsyncStorage.removeItem(StorageKeys.ACTIVE_SESSION_ID);
            } else {
                await AsyncStorage.setItem(StorageKeys.ACTIVE_SESSION_ID, sessionId);
            }
        } catch {
            // Ignore storage errors
        }
    }

    async clear(): Promise<void> {
        try {
            await AsyncStorage.multiRemove([
                StorageKeys.VISITOR_ID,
                StorageKeys.ACTIVE_SESSION_ID,
            ]);
        } catch {
            // Ignore storage errors
        }
    }

    private generateVisitorId(): string {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 10);
        return `visitor_${random}${timestamp}`;
    }
}

export const storageService = new StorageService();
