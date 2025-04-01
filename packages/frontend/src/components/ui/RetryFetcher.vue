<template>
    <div class="d-flex flex-column align-center justify-center" :style="containerStyle">
        <v-icon :icon="icon" :color="iconColor" :size="iconSize" class="mb-4" />
        <h3 class="text-h5 mb-2 text-center">{{ title }}</h3>
        <p class="text-body-1 text-center mb-6" v-if="message">
            {{ message }}
        </p>

        <v-btn
            :color="buttonColor"
            :loading="isRetrying"
            @click="handleRetry"
            variant="elevated"
            :size="buttonSize"
            class="text-none"
        >
            <v-icon :icon="buttonIcon" class="mr-2" />
            {{ buttonText }}
        </v-btn>
    </div>
</template>

<script setup lang="ts">
import { isNumber } from "es-toolkit/compat";
import { computed, ref } from "vue";

interface RetryFetcherProps {
    buttonColor?: string;
    buttonIcon?: string;
    buttonSize?: string;
    buttonText?: string;
    fetcher: () => (() => unknown) | (() => void) | Promise<unknown>;
    height?: number | string;
    icon?: string;
    iconColor?: string;
    iconSize?: number | string;
    message?: string;
    title?: string;
}

const {
    buttonColor = "primary",
    buttonIcon = "mdi-refresh",
    buttonSize = "large",
    buttonText = "Retry",
    fetcher,
    height = "300px",
    icon = "mdi-refresh-circle",
    iconColor = "warning",
    iconSize = 48,
    message = "There was a problem loading the data. Please try again.",
    title = "Failed to load data",
} = defineProps<RetryFetcherProps>();

const isRetrying = ref(false);

const containerStyle = computed(function getContainerStyle() {
    return {
        minHeight: isNumber(height) ? `${height}px` : height,
    };
});

async function handleRetry(): Promise<void> {
    if (isRetrying.value) return;

    isRetrying.value = true;
    await fetcher();
    isRetrying.value = false;
}
</script>
