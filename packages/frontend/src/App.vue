<template>
    <v-app>
        <TopMenu
            :update-dismissed="updateDismissed"
            @showUpdateNotification="showUpdateNotification"
            v-if="authStore.currentUser"
        />

        <v-progress-linear
            v-if="globalStore.globalLoading"
            indeterminate
            color="primary"
            style="z-index: 9999; position: fixed; top: 0; left: 0; right: 0; width: 100%"
        />

        <v-main>
            <router-view v-slot="{ Component }">
                <transition name="page" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </v-main>

        <v-snackbar
            v-model="updateAvailable"
            :timeout="4000"
            color="info"
            location="bottom"
            close-on-back
            timer
        >
            <div class="d-flex align-center">
                <v-icon icon="mdi-update" class="mr-2" />
                <span>A new version of the app is available</span>
                <v-spacer />
                <v-btn color="white" variant="text" @click="applyUpdate"> Update now </v-btn>
            </div>
        </v-snackbar>

        <GlobalSnackbar />
        <GenericDialog />
    </v-app>
</template>

<script setup lang="ts">
import { useEventListener } from "@vueuse/core";
import { onMounted, onUnmounted } from "vue";

import TopMenu from "./components/TopMenu.vue";
import GenericDialog from "./components/ui/GenericDialog.vue";
import GlobalSnackbar from "./components/ui/GlobalSnackbar.vue";
import { useAppUpdates } from "./services/app-updates";
import { useAuthStore } from "./stores/auth";
import { useGlobalStore } from "./stores/global";

const globalStore = useGlobalStore();
const authStore = useAuthStore();
const { applyUpdate, checkForUpdates, showUpdateNotification, updateAvailable, updateDismissed } =
    useAppUpdates();

onMounted(() => {
    const authCleanup = authStore.initializeAuthListener();

    useEventListener(document, "visibilitychange", () => {
        if (document.visibilityState === "visible") {
            checkForUpdates();
        }
    });

    onUnmounted(() => {
        authCleanup();
    });
});
</script>

<style>
/* Fade transition */
.page-enter-active,
.page-leave-active {
    transition: opacity 0.2s ease;
}
.page-enter-from,
.page-leave-to {
    opacity: 0;
}
</style>
