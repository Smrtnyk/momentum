<template>
    <v-app-bar app flat color="background" dark>
        <v-btn v-if="showBackButton" icon @click="goBack">
            <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-btn
            v-if="updateDismissed"
            icon
            color="warning"
            @click="emit('show-update-notification')"
            class="ml-2"
        >
            <v-icon>mdi-update</v-icon>
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn to="/home" icon>
            <v-icon>mdi-home</v-icon>
        </v-btn>
        <v-btn to="/workouts" icon :class="{ 'workout-active-btn': hasActiveWorkout }">
            <v-icon>mdi-dumbbell</v-icon>
            <v-badge
                v-if="hasActiveWorkout"
                color="success"
                dot
                location="bottom end"
                offset-x="3"
                offset-y="3"
            ></v-badge>
        </v-btn>
        <v-btn to="/calories" icon>
            <v-icon>mdi-nutrition</v-icon>
        </v-btn>
        <v-btn to="/analytics" icon>
            <v-icon>mdi-chart-bar</v-icon>
        </v-btn>

        <v-btn to="/profile" icon>
            <v-icon>mdi-account</v-icon>
        </v-btn>
    </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useActiveWorkoutStore } from "../stores/active-workout";

const { updateDismissed } = defineProps<{
    updateDismissed: boolean;
}>();

type Emits = (e: "show-update-notification") => void;

const emit = defineEmits<Emits>();

const router = useRouter();
const route = useRoute();
const activeWorkoutStore = useActiveWorkoutStore();

const mainRoutes = ["Home", "Auth"];

const showBackButton = computed(() => {
    return !mainRoutes.includes(route.name as string);
});

const hasActiveWorkout = computed(function () {
    return activeWorkoutStore.isWorkoutActive;
});

function goBack(): void {
    router.back();
}
</script>

<style scoped>
.workout-active-btn {
    position: relative;
}
</style>
