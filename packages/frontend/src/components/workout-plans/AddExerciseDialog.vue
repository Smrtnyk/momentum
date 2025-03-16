<template>
    <v-card-text>
        <v-form ref="exerciseForm">
            <v-text-field
                v-model="newExercise.name"
                label="Exercise Name"
                variant="outlined"
                density="comfortable"
                :rules="[required]"
                required
                class="mb-3"
            ></v-text-field>

            <v-textarea
                v-model="newExercise.description"
                label="Description (optional)"
                variant="outlined"
                density="comfortable"
                rows="3"
                class="mb-3"
            ></v-textarea>

            <v-select
                v-model="newExercise.muscleIds"
                label="Target Muscles"
                :items="muscleGroups"
                item-title="name"
                item-value="id"
                multiple
                chips
                variant="outlined"
                density="comfortable"
                :rules="[hasItems]"
                required
            ></v-select>
        </v-form>
    </v-card-text>

    <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey-darken-1" variant="text" @click="$emit('close')"> Cancel </v-btn>
        <v-btn color="primary" variant="elevated" @click="addExercise"> Add Exercise </v-btn>
    </v-card-actions>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

import { hasItems, required } from "../../helpers/form-validators";

interface ExerciseFormData {
    description: string;
    muscleIds: string[];
    name: string;
}

interface MuscleGroup {
    id: string;
    name: string;
}

const props = defineProps<{
    muscleGroups: MuscleGroup[];
    onAdd?: (exercise: ExerciseFormData) => void;
}>();

const emit = defineEmits<(e: "close") => void>();

const exerciseForm = ref<any>(null);

const newExercise = reactive<ExerciseFormData>({
    description: "",
    muscleIds: [],
    name: "",
});

function addExercise(): void {
    if (!exerciseForm.value?.validate?.().valid) {
        return;
    }

    if (props.onAdd) {
        props.onAdd({
            description: newExercise.description,
            muscleIds: newExercise.muscleIds,
            name: newExercise.name,
        });
    }

    emit("close");
}
</script>
