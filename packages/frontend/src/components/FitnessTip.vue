<script setup lang="ts">
import { computed, ref } from "vue";

import { fitnessTips, getTipCategory, getTipIcon } from "../data/fitness-tips";

const drawer = ref(false);
const tipIndex = ref(Math.floor(Math.random() * fitnessTips.length));

const tipOfTheDay = computed(() => {
    return fitnessTips[tipIndex.value];
});

const tipIcon = computed(() => {
    return getTipIcon(tipOfTheDay.value);
});

const tipCategory = computed(() => {
    return getTipCategory(tipOfTheDay.value);
});

function getNewTip(): void {
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * fitnessTips.length);
    } while (newIndex === tipIndex.value);

    tipIndex.value = newIndex;
}
</script>

<template>
    <div>
        <v-btn
            class="fitness-tip-trigger"
            :color="tipIcon.color"
            :icon="tipIcon.icon"
            elevation="4"
            fab
            @click="drawer = !drawer"
        />

        <v-navigation-drawer
            v-model="drawer"
            location="right"
            temporary
            width="320"
            floating
            class="fitness-tip-drawer"
        >
            <v-card flat>
                <v-toolbar density="compact" :color="tipIcon.color + '16'">
                    <template #prepend>
                        <v-avatar :color="tipIcon.color + '32'" class="mr-2">
                            <v-icon :color="tipIcon.color" size="24">{{ tipIcon.icon }}</v-icon>
                        </v-avatar>
                    </template>
                    <v-toolbar-title class="text-subtitle-1 font-weight-bold"
                        >FITNESS TIP</v-toolbar-title
                    >
                    <template #append>
                        <v-btn icon @click="drawer = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </template>
                </v-toolbar>

                <v-divider></v-divider>

                <v-card-text class="pa-4">
                    <blockquote class="tip-text mb-4">
                        {{ tipOfTheDay }}
                    </blockquote>

                    <div class="d-flex justify-space-between align-center">
                        <v-chip
                            size="small"
                            :color="tipIcon.color"
                            variant="outlined"
                            class="font-weight-medium text-caption"
                        >
                            {{ tipCategory }}
                        </v-chip>

                        <v-btn icon variant="text" @click="getNewTip" :color="tipIcon.color">
                            <v-icon>mdi-refresh</v-icon>
                        </v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-navigation-drawer>
    </div>
</template>

<style scoped>
.fitness-tip-trigger {
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 99;
    border-radius: 28px 0 0 28px !important;
    height: 56px;
    width: 56px;
    transition: transform 0.2s ease;
}

.fitness-tip-trigger:hover {
    transform: translateY(-50%) translateX(-4px);
}

.fitness-tip-drawer {
    border-radius: 16px 0 0 16px;
    overflow: hidden !important;
}

.tip-text {
    font-size: 1rem;
    line-height: 1.6;
    font-style: italic;
    border-left: 3px solid;
    border-color: v-bind("tipIcon.color");
    padding-left: 16px;
}

@media (max-width: 600px) {
    .fitness-tip-trigger {
        top: unset;
        bottom: 80px;
        transform: none;
    }

    .fitness-tip-trigger:hover {
        transform: translateX(-4px);
    }
}
</style>
