<template>
    <div class="date-range-selector">
        <v-menu v-model="menuOpen" :close-on-content-click="false" location="bottom">
            <template v-slot:activator="{ props }">
                <v-btn
                    variant="outlined"
                    color="primary"
                    v-bind="props"
                    class="date-range-btn"
                    density="compact"
                >
                    <template v-slot:prepend>
                        <v-icon>mdi-calendar-range</v-icon>
                    </template>
                    <span class="d-none d-sm-inline">{{ getRangeDisplayText }}</span>
                    <span class="d-sm-none">{{ getShortRangeText }}</span>
                </v-btn>
            </template>

            <v-card min-width="300" max-width="100%" elevation="8">
                <v-card-text>
                    <v-list density="compact" nav>
                        <v-list-item
                            v-for="option in rangeOptions"
                            :key="option.value"
                            :value="option.value"
                            :active="modelValue === option.value"
                            @click="updateValue(option.value as DateRangeOption)"
                            :prepend-icon="option.icon"
                        >
                            {{ option.text }}
                        </v-list-item>
                    </v-list>

                    <v-divider class="my-2"></v-divider>

                    <div class="d-flex justify-space-between">
                        <v-btn
                            variant="text"
                            color="primary"
                            prepend-icon="mdi-close"
                            @click="menuOpen = false"
                        >
                            Close
                        </v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-menu>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import type { DateRangeOption } from "../../types/analytics";

import { getDateRangeDisplayName, getShortDateRangeDisplayName } from "../../helpers/date-utils";

const props = defineProps<{
    modelValue: DateRangeOption;
}>();

const emit = defineEmits<(e: "update:modelValue", value: DateRangeOption) => void>();

const menuOpen = ref(false);

const rangeOptions = [
    { icon: "mdi-calendar-week", text: "Last 7 Days", value: "last7Days" },
    { icon: "mdi-calendar-month", text: "Last 30 Days", value: "last30Days" },
    { icon: "mdi-calendar-month-outline", text: "Last 90 Days", value: "last90Days" },
    { icon: "mdi-calendar-range", text: "Last 6 Months", value: "last6Months" },
    { icon: "mdi-calendar-star", text: "Last Year", value: "lastYear" },
    { icon: "mdi-calendar-multiple", text: "All Time", value: "allTime" },
];

const getRangeDisplayText = computed(function (): string {
    return getDateRangeDisplayName(props.modelValue);
});

const getShortRangeText = computed(function (): string {
    return getShortDateRangeDisplayName(props.modelValue);
});

function updateValue(value: DateRangeOption): void {
    emit("update:modelValue", value);
    menuOpen.value = false;
}
</script>

<style scoped>
.date-range-selector {
    position: relative;
}

.date-range-btn {
    min-width: 140px;
}

@media (max-width: 600px) {
    .date-range-btn {
        min-width: auto;
    }
}
</style>
