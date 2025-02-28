<template>
    <v-card-title>Log Today's Weight</v-card-title>
    <v-card-text>
        <v-text-field
            v-model.number="weight"
            type="number"
            label="Weight (kg)"
            variant="outlined"
            step="0.1"
            :rules="[(v) => !!v || 'Weight is required', (v) => v > 0 || 'Weight must be positive']"
        ></v-text-field>
    </v-card-text>
    <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('close')">Cancel</v-btn>
        <v-btn color="primary" @click="saveWeight" :disabled="!weight || weight <= 0"> Save </v-btn>
    </v-card-actions>
</template>

<script setup lang="ts">
import { ref } from "vue";

const { initialWeight = null } = defineProps<{
    initialWeight?: number;
}>();

const emit = defineEmits<{
    close: [];
    save: [weight: number];
}>();

const weight = ref<null | number>(initialWeight);

function saveWeight(): void {
    if (weight.value && weight.value > 0) {
        emit("save", weight.value);
        emit("close");
    }
}
</script>
