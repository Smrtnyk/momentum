<template>
    <v-app-bar app flat color="background" dark>
        <v-btn v-if="showBackButton" icon @click="goBack">
            <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn to="/home" icon>
            <v-icon>mdi-home</v-icon>
        </v-btn>
        <v-btn to="/workouts" icon>
            <v-icon>mdi-dumbbell</v-icon>
        </v-btn>
        <v-btn to="/workout-plans" icon>
            <v-icon>mdi-clipboard-text-outline</v-icon>
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

const router = useRouter();
const route = useRoute();

const mainRoutes = ["Home", "Auth"];

const showBackButton = computed(() => {
    return !mainRoutes.includes(route.name as string);
});

function goBack(): void {
    router.back();
}
</script>
