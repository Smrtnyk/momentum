<template>
    <v-app>
        <TopMenu v-if="authStore.currentUser" />

        <v-progress-linear
            v-if="globalStore.globalLoading"
            indeterminate
            absolute
            color="primary"
            style="z-index: 9999"
        />

        <v-main>
            <transition name="page" mode="out-in">
                <router-view />
            </transition>
        </v-main>

        <GlobalSnackbar />
        <GenericDialog />
        <GlobalConfirmDialog />
    </v-app>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

import TopMenu from "./components/TopMenu.vue";
import GenericDialog from "./components/ui/GenericDialog.vue";
import GlobalConfirmDialog from "./components/ui/GlobalConfirmDialog.vue";
import GlobalSnackbar from "./components/ui/GlobalSnackbar.vue";
import { useAuthStore } from "./stores/auth";
import { useGlobalStore } from "./stores/global";

const globalStore = useGlobalStore();
const authStore = useAuthStore();

onMounted(() => {
    const cleanup = authStore.initializeAuthListener();
    onUnmounted(cleanup);
});
</script>

<style>
/* Fade transition */
.page-enter-active,
.page-leave-active {
    transition: opacity 0.5s ease;
}
.page-enter-from,
.page-leave-to {
    opacity: 0;
}
</style>
