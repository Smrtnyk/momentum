<template>
    <v-app>
        <TopMenu v-if="user" />

        <v-progress-linear
            v-if="globalStore.globalLoading"
            indeterminate
            absolute
            color="primary"
            style="z-index: 9999"
        />

        <v-main>
            <router-view />
        </v-main>

        <GlobalSnackbar />
        <GenericDialog />
        <GlobalConfirmDialog />
    </v-app>
</template>

<script setup lang="ts">
import type { User } from "firebase/auth";

import { onAuthStateChanged } from "firebase/auth";
import { ref } from "vue";

import TopMenu from "./components/TopMenu.vue";
import GenericDialog from "./components/ui/GenericDialog.vue";
import GlobalConfirmDialog from "./components/ui/GlobalConfirmDialog.vue";
import GlobalSnackbar from "./components/ui/GlobalSnackbar.vue";
import { initializeFirebase } from "./firebase";
import { useGlobalStore } from "./stores/global";

const { auth } = initializeFirebase();
const globalStore = useGlobalStore();
const user = ref<null | User>(null);
onAuthStateChanged(auth, function (currentUser: null | User): void {
    user.value = currentUser;
});
</script>
