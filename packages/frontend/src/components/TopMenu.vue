<template>
    <v-app-bar app flat color="background" dark>
        <v-btn v-if="showBackButton" icon @click="goBack">
            <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn to="/dashboard" icon>
            <v-icon>mdi-home</v-icon>
        </v-btn>
        <v-btn to="/profile" icon>
            <v-icon>mdi-account</v-icon>
        </v-btn>
        <v-btn @click="handleLogout" icon color="error">
            <v-icon>mdi-logout</v-icon>
        </v-btn>
    </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { logoutUser } from "../services/auth";

const router = useRouter();
const route = useRoute();

const mainRoutes = ["Dashboard", "Auth"];

const showBackButton = computed(() => {
    return !mainRoutes.includes(route.name as string);
});

function goBack(): void {
    router.back();
}

async function handleLogout(): Promise<void> {
    await logoutUser();
    await router.push("/auth");
}
</script>
