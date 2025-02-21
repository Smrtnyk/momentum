<template>
    <v-app>
        <TopMenu v-if="user" />
        <v-main>
            <router-view />
        </v-main>

        <GlobalSnackbar />
        <GenericDialog />
    </v-app>
</template>

<script setup lang="ts">
import type { User } from "firebase/auth";

import { onAuthStateChanged } from "firebase/auth";
import { ref } from "vue";

import TopMenu from "./components/TopMenu.vue";
import GenericDialog from "./components/ui/GenericDialog.vue";
import GlobalSnackbar from "./components/ui/GlobalSnackbar.vue";
import { initializeFirebase } from "./firebase";

const { auth } = initializeFirebase();

const user = ref<null | User>(null);
onAuthStateChanged(auth, function (currentUser: null | User): void {
    user.value = currentUser;
});
</script>
