<template>
    <div v-if="error" class="error-boundary">
        <v-alert type="error" title="Application Error" variant="tonal" class="mb-4">
            {{ friendlyErrorMessage }}
        </v-alert>
        <v-btn color="primary" @click="refreshPage">Refresh Application</v-btn>
    </div>
    <slot v-else></slot>
</template>

<script setup lang="ts">
import { computed, onErrorCaptured, ref } from "vue";

import { logger } from "../logger/app-logger";
import { saveAppState } from "../services/state-persistence";

const { logErrors = true } = defineProps<{ logErrors?: boolean }>();

const error = ref<Error | null>(null);
const info = ref<string>("");

const friendlyErrorMessage = computed(() => {
    if (!error.value) return "";

    if (
        error.value.message?.includes("Failed to fetch dynamically imported module") ||
        error.value.message?.includes("Loading chunk") ||
        error.value.message?.includes("ChunkLoadError") ||
        error.value.message?.includes("Loading CSS chunk")
    ) {
        return "A new version of the application is available. Please refresh to update.";
    }

    return "Something went wrong. Please try refreshing the page.";
});

onErrorCaptured(function (err, instance, infoVal) {
    if (logErrors) {
        logger.error(err);
    }

    error.value = err as Error;
    info.value = infoVal;

    if (
        err.message?.includes("Failed to fetch dynamically imported module") ||
        err.message?.includes("Loading chunk") ||
        err.message?.includes("ChunkLoadError")
    ) {
        try {
            const router = instance?.$.appContext.config.globalProperties.$router;
            if (router) {
                const route = router.currentRoute.value;
                saveAppState({
                    route: {
                        params: { ...route.params } as Record<string, string>,
                        path: route.path,
                        query: { ...route.query } as Record<string, string>,
                    },
                });
            }
        } catch (e) {
            logger.error(e);
        }
    }

    return false;
});

function refreshPage(): void {
    globalThis.location.reload();
}
</script>

<style scoped>
.error-boundary {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    text-align: center;
}
</style>
