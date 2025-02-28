<script setup lang="ts">
import { computed, ref } from "vue";

import { fitnessTips, getTipCategory, getTipIcon } from "../data/fitness-tips";

const tipIndex = ref(Math.floor(Math.random() * fitnessTips.length));
const tipOfTheDay = computed(() => {
    return fitnessTips[tipIndex.value];
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
    <v-card class="tip-card rounded-lg" elevation="2">
        <div class="tip-content-wrapper pa-5">
            <div class="d-flex align-center mb-4">
                <div class="tip-icon-container mr-3">
                    <v-icon :color="getTipIcon(tipOfTheDay).color" size="24">
                        {{ getTipIcon(tipOfTheDay).icon }}
                    </v-icon>
                </div>
                <h2 class="text-subtitle-1 font-weight-bold">FITNESS TIP</h2>
            </div>

            <blockquote class="tip-text mb-4">
                {{ tipOfTheDay }}
            </blockquote>

            <div class="d-flex justify-space-between align-center">
                <v-chip small outlined color="primary" class="tip-category-chip">
                    {{ getTipCategory(tipOfTheDay) }}
                </v-chip>

                <v-btn flat icon @click="getNewTip" class="refresh-tip-button">
                    <v-icon size="20">mdi-refresh</v-icon>
                </v-btn>
            </div>
        </div>
    </v-card>
</template>

<style scoped>
.tip-card {
    position: relative;
    overflow: hidden;
}

.tip-icon-container {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.tip-text {
    font-size: 1rem;
    line-height: 1.6;
    font-style: italic;
    border-left: 3px solid #2196f3;
    padding-left: 16px;
}

.tip-category-chip {
    font-weight: 600;
    font-size: 0.7rem;
}
</style>
