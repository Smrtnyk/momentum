<template>
    <v-card-text>
        <p class="text-body-1 mb-3">
            Describe what you ate in natural language. The AI will analyze your description and
            extract nutritional information.
        </p>
        <v-textarea
            v-model="foodDescription"
            variant="outlined"
            label="Food Description"
            placeholder="Example: I had a large grilled chicken salad with romaine lettuce, cherry tomatoes, cucumber, a tablespoon of olive oil and balsamic vinegar"
            counter
            rows="4"
            auto-grow
            :loading="isProcessing"
            :disabled="isProcessing"
            :rules="[required]"
        ></v-textarea>

        <v-alert v-if="error" type="error" variant="tonal" density="comfortable" class="mb-3">
            {{ error }}
        </v-alert>

        <v-alert type="info" variant="tonal" density="comfortable" class="mb-0">
            For best results, be specific about ingredients, quantities, and preparation methods.
        </v-alert>
    </v-card-text>

    <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="default" variant="text" @click="$emit('close')" :disabled="isProcessing">
            Cancel
        </v-btn>
        <v-btn color="primary" @click="analyzeFood" :loading="isProcessing" :disabled="!isValid">
            Analyze
        </v-btn>
    </v-card-actions>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import type { FoodItem } from "../../types/food";

import { required } from "../../helpers/form-validators";
import { logger } from "../../logger/app-logger";
import { analyzeFood as analyzeFoodWithAI } from "../../services/food-ai";

const emit = defineEmits<{
    close: [];
    "food-analyzed": [food: FoodItem];
}>();

const foodDescription = ref("");
const isProcessing = ref(false);
const error = ref("");

const isValid = computed(() => {
    return foodDescription.value.trim().length > 0;
});

async function analyzeFood(): Promise<void> {
    if (!isValid.value || isProcessing.value) return;

    try {
        isProcessing.value = true;
        error.value = "";

        const food = await analyzeFoodWithAI(foodDescription.value);

        if (!food) {
            error.value = "Could not analyze food description. Please try again with more details.";
            return;
        }

        emit("food-analyzed", food);
        emit("close");
    } catch (err) {
        error.value = "Failed to analyze food. Please try again or enter nutrients manually.";
        logger.error("Food analysis error:", "FoodPromptDialog", err);
    } finally {
        isProcessing.value = false;
    }
}
</script>
