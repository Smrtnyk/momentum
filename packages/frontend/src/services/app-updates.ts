import { useRegisterSW } from "virtual:pwa-register/vue";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

import { ONE_HOUR } from "../helpers/date-utils";
import { logger } from "../logger/app-logger";
import { saveAppState } from "./state-persistence";

export function useAppUpdates() {
    const router = useRouter();
    const updateAvailable = ref(false);
    const updateDismissed = ref(false);

    const { needRefresh, updateServiceWorker } = useRegisterSW({
        immediate: false,
        onRegisteredSW(swUrl, registration) {
            logger.info("Service worker registered:", "AppUpdates", swUrl);

            if (registration) {
                setInterval(() => {
                    registration
                        .update()
                        .catch((err) => logger.error("Failed to update SW:", "AppUpdates", err));
                }, ONE_HOUR);
            }
        },
        onRegisterError(error) {
            logger.error("Service worker registration error:", "AppUpdates", error);
        },
    });

    watch(needRefresh, (value) => {
        if (!value) {
            return;
        }
        updateAvailable.value = true;
        updateDismissed.value = false;

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
    });

    watch(updateAvailable, (value) => {
        if (!value && needRefresh.value) {
            updateDismissed.value = true;
        }
    });

    async function applyUpdate(): Promise<void> {
        updateAvailable.value = false;
        updateDismissed.value = false;
        await updateServiceWorker(true);
    }

    function showUpdateNotification(): void {
        updateAvailable.value = true;
        updateDismissed.value = false;
    }

    return {
        applyUpdate,
        checkForUpdates,
        showUpdateNotification,
        updateAvailable,
        updateDismissed,
    };
}

async function checkForUpdates(): Promise<void> {
    if (!navigator.serviceWorker) return;

    try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
            // eslint-disable-next-line no-await-in-loop -- fine here
            await registration.update();
        }
        logger.info("Manual update check completed", "AppUpdates");
    } catch (err) {
        logger.error("Failed to check for updates:", "AppUpdates", err);
    }
}
