import { useRegisterSW } from "virtual:pwa-register/vue";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

import { ONE_HOUR } from "../helpers/date-utils";
import { logger } from "../logger/app-logger";
import { saveAppState } from "./state-persistence";

export function useAppUpdates() {
    const router = useRouter();
    const updateAvailable = ref(false);

    const { needRefresh, updateServiceWorker } = useRegisterSW({
        onRegisteredSW(scriptUrl, registration) {
            logger.info("Service worker registered:", "AppUpdates", registration);

            // a periodic check for updates
            if (registration) {
                setInterval(() => {
                    registration.update().catch(logger.error.bind(logger));
                }, ONE_HOUR);
            }
        },
        onRegisterError(error) {
            logger.error("Service worker registration error:", "AppUpdates", error);
        },
    });

    watch(needRefresh, (value) => {
        updateAvailable.value = value;
    });

    async function applyUpdate(): Promise<void> {
        if (router) {
            const route = router.currentRoute.value;
            saveAppState({
                route: {
                    params: { ...route.params } as Record<string, string>,
                    path: route.path,
                    query: { ...route.query } as Record<string, string>,
                },
                scrollPosition: {
                    x: window.scrollX,
                    y: window.scrollY,
                },
            });
        }

        updateAvailable.value = false;
        await updateServiceWorker(true);
    }

    return {
        applyUpdate,
        checkForUpdates,
        needRefresh,
        updateAvailable,
    };
}

async function checkForUpdates(): Promise<void> {
    if (!navigator.serviceWorker) return;

    try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        const updatePromises = registrations.map((registration) => registration.update());
        await Promise.all(updatePromises);
    } catch (err) {
        logger.error("Failed to check for updates:", "AppUpdates", err);
    }
}
