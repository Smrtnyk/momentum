<template>
    <div class="metric-card">
        <div class="d-flex justify-space-between align-center mb-2">
            <div class="d-flex align-center">
                <v-icon :color="color" class="mr-2" size="small">{{ icon }}</v-icon>
                <span class="text-subtitle-1">{{ title }}</span>
            </div>

            <v-btn icon variant="text" :color="color" density="comfortable" @click="emit('action')">
                <v-icon>{{ actionIcon }}</v-icon>
            </v-btn>
        </div>

        <div class="metric-content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    actionIcon?: string;
    color: string;
    icon: string;
    title: string;
}

const props = defineProps<Props>();

type Emits = (e: "action") => void;

const emit = defineEmits<Emits>();

const actionIcon = props.actionIcon ?? "mdi-plus";
</script>

<style scoped>
.metric-card {
    height: 100%;
    padding: 12px;
    border-radius: 16px;
}

.metric-content {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 120px;
}
</style>
