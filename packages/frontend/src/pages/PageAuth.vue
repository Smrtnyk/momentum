<template>
    <v-container class="auth-container" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
                <v-card class="pa-5 auth-card">
                    <v-card-title class="headline justify-center">
                        Welcome to Momentum
                    </v-card-title>
                    <v-card-text>
                        <p>Please sign in with your Google account to continue.</p>
                    </v-card-text>
                    <v-card-actions class="justify-center">
                        <v-btn color="primary" large block @click="handleGoogleLogin">
                            <v-icon left>mdi-google</v-icon>
                            Sign in with Google
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

import { loginWithGoogle } from "../services/auth";
import { useGlobalStore } from "../stores/global";

const globalStore = useGlobalStore();
const router = useRouter();

async function handleGoogleLogin(): Promise<void> {
    try {
        await loginWithGoogle();
        await router.push("/home");
    } catch (error) {
        globalStore.notifyError(error);
    }
}
</script>

<style scoped>
.auth-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, #232e36, #212425);
}

.auth-card {
    text-align: center;
}
</style>
