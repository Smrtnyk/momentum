<script setup lang="ts">
import { computed, ref } from "vue";

import { fitnessTips } from "../data/fitness-tips";

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

// eslint-disable-next-line complexity -- kinda complex
function getTipCategory(tip: string): string {
    const tipLower = tip.toLowerCase();

    if (
        tipLower.includes("protein") ||
        tipLower.includes("diet") ||
        tipLower.includes("eat") ||
        tipLower.includes("food") ||
        tipLower.includes("meal") ||
        tipLower.includes("nutrition")
    ) {
        return "NUTRITION";
    } else if (
        tipLower.includes("sleep") ||
        tipLower.includes("rest") ||
        tipLower.includes("recovery")
    ) {
        return "RECOVERY";
    } else if (tipLower.includes("water") || tipLower.includes("hydrat")) {
        return "HYDRATION";
    } else if (
        tipLower.includes("cardio") ||
        tipLower.includes("walk") ||
        tipLower.includes("run")
    ) {
        return "CARDIO";
    } else if (
        tipLower.includes("weight") ||
        tipLower.includes("strength") ||
        tipLower.includes("muscle")
    ) {
        return "STRENGTH";
    } else if (
        tipLower.includes("stretch") ||
        tipLower.includes("flexib") ||
        tipLower.includes("mobility")
    ) {
        return "MOBILITY";
    } else if (tipLower.includes("supplement") || tipLower.includes("vitamin")) {
        return "SUPPLEMENTS";
    } else if (
        tipLower.includes("mental") ||
        tipLower.includes("habit") ||
        tipLower.includes("consist")
    ) {
        return "MINDSET";
    }

    return "FITNESS";
}

// eslint-disable-next-line complexity -- kinda complex
function getTipIcon(tip: string): { color: string; icon: string } {
    const tipLower = tip.toLowerCase();

    // Nutrition related tips
    if (
        tipLower.includes("protein") ||
        tipLower.includes("diet") ||
        tipLower.includes("eat") ||
        tipLower.includes("food") ||
        tipLower.includes("meal") ||
        tipLower.includes("nutrition") ||
        tipLower.includes("carbohydrate") ||
        tipLower.includes("caloric")
    ) {
        return { color: "#4CAF50", icon: "mdi-food-apple" };
    }

    // Sleep related tips
    else if (
        tipLower.includes("sleep") ||
        tipLower.includes("rest") ||
        tipLower.includes("recovery") ||
        tipLower.includes("nap")
    ) {
        return { color: "#3F51B5", icon: "mdi-sleep" };
    }

    // Water/hydration related tips
    else if (tipLower.includes("water") || tipLower.includes("hydrat")) {
        return { color: "#2196F3", icon: "mdi-water" };
    }

    // Cardio/walking related tips
    else if (
        tipLower.includes("walk") ||
        tipLower.includes("cardio") ||
        tipLower.includes("steps") ||
        tipLower.includes("running") ||
        tipLower.includes("jog")
    ) {
        return { color: "#FF5722", icon: "mdi-run" };
    }

    // Weight training related tips
    else if (
        tipLower.includes("weight") ||
        tipLower.includes("strength") ||
        tipLower.includes("muscle") ||
        tipLower.includes("lift") ||
        tipLower.includes("resistance") ||
        tipLower.includes("dumbbell") ||
        tipLower.includes("barbell") ||
        tipLower.includes("rep")
    ) {
        return { color: "#607D8B", icon: "mdi-dumbbell" };
    }

    // Stretching/mobility related tips
    else if (
        tipLower.includes("stretch") ||
        tipLower.includes("flexib") ||
        tipLower.includes("mobility") ||
        tipLower.includes("range of motion") ||
        tipLower.includes("foam roll")
    ) {
        return { color: "#9C27B0", icon: "mdi-human-handsup" };
    }

    // Supplement related tips
    else if (
        tipLower.includes("supplement") ||
        tipLower.includes("vitamin") ||
        tipLower.includes("creatine") ||
        tipLower.includes("protein powder") ||
        tipLower.includes("omega-3")
    ) {
        return { color: "#FFC107", icon: "mdi-pill" };
    }

    // Mental focus/motivation related tips
    else if (
        tipLower.includes("focus") ||
        tipLower.includes("mental") ||
        tipLower.includes("motivation") ||
        tipLower.includes("habit") ||
        tipLower.includes("consist") ||
        tipLower.includes("journal") ||
        tipLower.includes("track")
    ) {
        return { color: "#9C27B0", icon: "mdi-brain" };
    }

    // Default icon for other tips
    return { color: "#FFC107", icon: "mdi-lightbulb-on" };
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
