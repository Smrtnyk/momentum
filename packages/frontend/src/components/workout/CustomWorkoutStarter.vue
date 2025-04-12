<template>
    <div>
        <v-card-text class="pa-4 pt-0 pb-0">
            <v-text-field
                v-model="workoutName"
                label="Workout Name"
                variant="outlined"
                density="comfortable"
                hide-details
                placeholder="My Custom Workout"
                :rules="[required]"
                class="mb-4"
            ></v-text-field>
        </v-card-text>

        <div class="pa-4 pt-0">
            <v-btn
                color="success"
                prepend-icon="mdi-play"
                @click="startWorkout"
                class="px-4"
                size="large"
                :loading="loading"
                :disabled="!workoutName"
            >
                Start Workout
            </v-btn>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { required } from "../../helpers/form-validators";
import { useActiveWorkoutStore } from "../../stores/active-workout";
import { useGlobalStore } from "../../stores/global";

type Emits = (e: "close") => void;

const emit = defineEmits<Emits>();

const activeWorkoutStore = useActiveWorkoutStore();
const globalStore = useGlobalStore();
const router = useRouter();
const loading = ref(false);
const workoutName = ref("");

async function startWorkout(): Promise<void> {
    if (!workoutName.value) return;

    try {
        loading.value = true;
        activeWorkoutStore.startCustomWorkout(workoutName.value);
        await router.push({ name: "CustomWorkout" });
        emit("close");
    } catch {
        globalStore.notifyError("Failed to start workout");
    } finally {
        loading.value = false;
    }
}
</script>
