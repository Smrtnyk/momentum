<template>
    <div class="water-log-menu">
        <div v-if="entries.length === 0" class="text-center py-4">
            <v-icon size="x-large" color="grey-lighten-1">mdi-water-off</v-icon>
            <p class="text-grey mt-2">No water intake recorded today</p>
        </div>

        <div v-else>
            <div class="d-flex justify-space-between mb-4">
                <div class="text-body-1">
                    Total: <span class="font-weight-bold">{{ totalAmount }}ml</span>
                </div>
                <div class="text-body-2 text-grey">
                    {{ formatDate(new Date()) }}
                </div>
            </div>

            <v-divider></v-divider>

            <v-list class="water-log-list">
                <v-list-item v-for="(entry, index) in logEntries" :key="index" class="px-0">
                    <template #prepend>
                        <v-avatar color="blue-lighten-4" class="mr-3" size="36">
                            <span class="text-blue-darken-1 font-weight-bold text-caption"
                                >{{ entry.amount }}ml</span
                            >
                        </v-avatar>
                    </template>

                    <v-list-item-title class="text-subtitle-2">
                        {{ formatTime(entry.timestamp) }}
                    </v-list-item-title>

                    <template #append>
                        <v-btn
                            icon="mdi-delete"
                            variant="text"
                            density="compact"
                            color="error"
                            @click="confirmRemove(entry)"
                        ></v-btn>
                    </template>
                </v-list-item>
            </v-list>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Timestamp } from "firebase/firestore";

import { computed } from "vue";
import { useDate } from "vuetify";

import type { WaterLogEntry } from "../../types/health-metrics";

interface Props {
    entries: WaterLogEntry[];
}

const props = defineProps<Props>();
const emit = defineEmits<(e: "remove", val: WaterLogEntry) => void>();

const dateAdapter = useDate();

const logEntries = computed(function (): WaterLogEntry[] {
    return [...props.entries].sort(function (a, b) {
        return b.timestamp.toMillis() - a.timestamp.toMillis();
    });
});

const totalAmount = computed(function (): number {
    return props.entries.reduce(function (sum, entry) {
        return sum + entry.amount;
    }, 0);
});

function confirmRemove(entry: WaterLogEntry): void {
    emit("remove", entry);
}

function formatDate(date: Date): string {
    return dateAdapter.format(date, "fullDate");
}

function formatTime(timestamp: Timestamp): string {
    const date = timestamp.toDate();
    return dateAdapter.format(date, "time");
}
</script>

<style scoped>
.water-log-menu {
    min-width: 300px;
    max-width: 350px;
    padding: 16px;
}

.water-log-list {
    max-height: 350px;
    overflow-y: auto;
}
</style>
