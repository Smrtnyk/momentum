<template>
    <v-snackbar
        v-model="globalStore.notification.show"
        :color="globalStore.notification.color"
        :timeout="globalStore.notification.timeout"
        top
        right
        elevation="2"
    >
        {{ globalStore.notification.message }}
    </v-snackbar>
</template>

<script setup lang="ts">
import { useGlobalStore } from "../../stores/global";

const globalStore = useGlobalStore();
</script>
