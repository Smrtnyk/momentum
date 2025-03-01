<template>
    <v-card-text>
        <v-text-field
            v-model.number="steps"
            type="number"
            label="Steps"
            variant="outlined"
            :rules="[(v) => !!v || 'Steps are required', (v) => v > 0 || 'Steps must be positive']"
        ></v-text-field>
    </v-card-text>
    <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('close')">Cancel</v-btn>
        <v-btn color="primary" @click="saveSteps" :disabled="!steps || steps <= 0"> Save </v-btn>
    </v-card-actions>
</template>

<script setup lang="ts">
import { ref } from "vue";

const { initialSteps = null } = defineProps<{
    initialSteps?: number;
}>();

const emit = defineEmits<{
    close: [];
    save: [steps: number];
}>();

const steps = ref<null | number>(initialSteps);

function saveSteps(): void {
    if (steps.value && steps.value > 0) {
        emit("save", steps.value);
        emit("close");
    }
}
</script>
