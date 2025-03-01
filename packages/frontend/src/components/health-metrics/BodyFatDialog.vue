<template>
    <v-card-text>
        <v-text-field
            v-model.number="percentage"
            type="number"
            label="Body Fat (%)"
            variant="outlined"
            step="0.1"
            :rules="[required, betweenValues(3, 40)]"
        ></v-text-field>

        <v-select
            v-model="method"
            :items="measurementMethods"
            label="Measurement Method"
            variant="outlined"
        ></v-select>
    </v-card-text>
    <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('close')">Cancel</v-btn>
        <v-btn
            color="primary"
            @click="saveBodyFat"
            :disabled="!percentage || percentage < 3 || percentage > 40"
        >
            Save
        </v-btn>
    </v-card-actions>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { betweenValues, required } from "../../helpers/form-validators";

const { initialMethod = "calipers", initialPercentage = null } = defineProps<{
    initialMethod?: string;
    initialPercentage?: number;
}>();

const emit = defineEmits<{
    close: [];
    save: [percentage: number, method: string];
}>();

const percentage = ref<null | number>(initialPercentage ?? null);
const method = ref<string>(initialMethod ?? "calipers");
const measurementMethods = ["calipers", "bioimpedance", "visual estimate"];

function saveBodyFat(): void {
    if (percentage.value !== null && percentage.value >= 3 && percentage.value <= 40) {
        emit("save", percentage.value, method.value);
        emit("close");
    }
}
</script>
