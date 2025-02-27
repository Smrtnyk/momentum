<template>
    <v-card-text>
        <v-text-field
            v-model.number="calorieGoal"
            label="Daily Calories"
            type="number"
            variant="outlined"
            :rules="[
                (v) => !!v || 'Calorie goal is required',
                (v) => v >= 1200 || 'Goal should be at least 1200 calories',
                (v) => v <= 5000 || 'Goal should not exceed 5000 calories',
            ]"
            min="1200"
            max="5000"
            step="50"
        ></v-text-field>

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

const props = defineProps<{
    currentGoal: number;
}>();

const emit = defineEmits<{
    close: [];
    save: [goal: number];
}>();

const calorieGoal = ref(props.currentGoal);

const isValid = computed(() => {
    return calorieGoal.value && calorieGoal.value >= 1200 && calorieGoal.value <= 5000;
});

function saveGoal(): void {
    if (!isValid.value) return;

    emit("save", calorieGoal.value);
    emit("close");
}
</script>
