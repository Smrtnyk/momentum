<template>
    <div class="macro-nutrient-display">
        <div class="d-flex justify-space-around mb-2">
            <div class="text-center">
                <div class="text-caption">Protein</div>
                <div class="text-h6">{{ protein.toFixed(1) }}g</div>
                <div v-if="showCalories" class="text-caption">{{ proteinCalories }} cal</div>
            </div>

            <div class="text-center">
                <div class="text-caption">Carbs</div>
                <div class="text-h6">{{ carbs.toFixed(1) }}g</div>
                <div v-if="showCalories" class="text-caption">{{ carbCalories }} cal</div>
            </div>

            <div class="text-center">
                <div class="text-caption">Fat</div>
                <div class="text-h6">{{ fat.toFixed(1) }}g</div>
                <div v-if="showCalories" class="text-caption">{{ fatCalories }} cal</div>
            </div>
        </div>

        <div class="macro-bars">
            <div class="macro-bar protein" :style="{ width: `${percentages.protein}%` }"></div>
            <div class="macro-bar carbs" :style="{ width: `${percentages.carbs}%` }"></div>
            <div class="macro-bar fat" :style="{ width: `${percentages.fat}%` }"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
    carbs: number;
    fat: number;
    protein: number;
    showCalories?: boolean;
}

const { carbs, fat, protein, showCalories = false } = defineProps<Props>();

const proteinCalories = computed(function () {
    return Math.round(protein * 4);
});

const carbCalories = computed(function () {
    return Math.round(carbs * 4);
});

const fatCalories = computed(function () {
    return Math.round(fat * 9);
});

const percentages = computed(function () {
    const totalCalories = proteinCalories.value + carbCalories.value + fatCalories.value;

    if (totalCalories === 0) {
        return { carbs: 0, fat: 0, protein: 0 };
    }

    return {
        carbs: Math.round((carbCalories.value / totalCalories) * 100),
        fat: Math.round((fatCalories.value / totalCalories) * 100),
        protein: Math.round((proteinCalories.value / totalCalories) * 100),
    };
});
</script>

<style scoped>
.macro-bars {
    display: flex;
    height: 8px;
    width: 100%;
    border-radius: 4px;
    overflow: hidden;
}

.macro-bar {
    height: 100%;
    transition: width 0.3s ease;
}

.macro-bar.protein {
    background-color: #7986cb;
}

.macro-bar.carbs {
    background-color: #4fc3f7;
}

.macro-bar.fat {
    background-color: #ffb74d;
}
</style>
