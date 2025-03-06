import type { LocationQueryValue } from "vue-router";

import { ONE_HOUR } from "../helpers/date-utils";
import { logger } from "../logger/app-logger";

type PersistableState = {
    route?: {
        params: { [x: string]: string | string[] };
        path: string;
        query: { [x: string]: LocationQueryValue | LocationQueryValue[] };
    };
    scrollPosition?: {
        x: number;
        y: number;
    };
    userInput?: Record<string, any>;
};

const STATE_STORAGE_KEY = "momentum_app_state";
const STATE_VERSION = 1;

export function clearAppState(): void {
    localStorage.removeItem(STATE_STORAGE_KEY);
}

export function loadAppState(): null | PersistableState {
    try {
        const stateJson = localStorage.getItem(STATE_STORAGE_KEY);
        if (!stateJson) {
            return null;
        }

        const state = JSON.parse(stateJson);

        // version compatibility
        if (state.version !== STATE_VERSION) {
            logger.warn("Stored state version mismatch, discarding");
            localStorage.removeItem(STATE_STORAGE_KEY);
            return null;
        }

        const timestamp = new Date(state.timestamp);
        const now = new Date();
        if (now.getTime() - timestamp.getTime() > ONE_HOUR) {
            logger.warn("Stored state is too old, discarding");
            localStorage.removeItem(STATE_STORAGE_KEY);
            return null;
        }

        delete state.version;
        delete state.timestamp;

        return state;
    } catch (error) {
        logger.error(error);
        return null;
    }
}

export function saveAppState(state: PersistableState): void {
    try {
        const stateWithVersion = {
            ...state,
            timestamp: new Date().toISOString(),
            version: STATE_VERSION,
        };
        localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(stateWithVersion));
    } catch (error) {
        logger.error(error);
    }
}
