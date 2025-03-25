<template>
    <v-card-text>
        <v-text-field
            v-model.number="calorieGoal"
            label="Daily Calories"
            type="number"
            variant="outlined"
            :rules="[required, betweenValues(1200, 5000)]"
            min="1200"
            max="5000"
            step="50"
        ></v-text-field>

        <v-checkbox
            v-model="setAsDefault"
            label="Set as my default calorie goal"
            density="compact"
            hide-details
            class="mt-2"
        ></v-checkbox>

        <v-alert type="info" variant="tonal" density="compact" class="mt-4">
            Setting an appropriate calorie goal helps track your nutrition more effectively. For
            most adults, a daily intake between 1800-2500 calories is recommended, but this varies
            based on activity level, body composition, and goals.
        </v-alert>
    </v-card-text>
    <v-card-actions>
        <v-btn variant="text" @click="$emit('close')">Cancel</v-btn>
        <v-btn color="primary" @click="saveGoal" :disabled="!isValid"> Save </v-btn>
    </v-card-actions>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import { betweenValues, required } from "../../helpers/form-validators";

const props = defineProps<{
    currentGoal: number;
}>();

interface Emits {
    (e: "close"): void;
    (e: "save", goal: number, setAsDefault: boolean): void;
}

const emit = defineEmits<Emits>();

const calorieGoal = ref(props.currentGoal);
const setAsDefault = ref(false);

const isValid = computed(() => {
    return calorieGoal.value && calorieGoal.value >= 1200 && calorieGoal.value <= 5000;
});

function saveGoal(): void {
    if (!isValid.value) return;

    emit("save", calorieGoal.value, setAsDefault.value);
    emit("close");
}
</script>
