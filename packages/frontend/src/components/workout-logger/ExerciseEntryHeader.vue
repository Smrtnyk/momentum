<template>
    <v-expansion-panel-title class="d-flex align-center">
        <v-icon left size="small" class="mr-2">{{ icon }}</v-icon>
        {{ title || defaultTitle }}
        <v-spacer />
        <v-btn icon @click="$emit('delete')" size="small" flat>
            <v-icon>mdi-close</v-icon>
        </v-btn>
    </v-expansion-panel-title>
</template>

<script setup lang="ts">
const { defaultTitle, icon, title } = defineProps<{
    defaultTitle: string;
    icon: string;
    title: string;
}>();

defineEmits(["delete"]);
</script>
