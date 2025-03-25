<template>
    <v-card-text>
        <v-text-field
            v-model.number="weight"
            type="number"
            label="Weight (kg)"
            variant="outlined"
            step="0.1"
            :rules="[positiveRequired]"
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

import { positiveRequired } from "../../helpers/form-validators";

const { initialWeight = null } = defineProps<{
    initialWeight?: number;
}>();

interface Emits {
    (e: "close"): void;
    (e: "save", weight: number): void;
}

const emit = defineEmits<Emits>();

const weight = ref<null | number>(initialWeight);

function saveWeight(): void {
    if (weight.value && weight.value > 0) {
        emit("save", weight.value);
        emit("close");
    }
}
</script>
