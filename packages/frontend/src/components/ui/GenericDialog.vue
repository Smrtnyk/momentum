<template>
    <v-dialog
        v-model="isOpen"
        persistent
        :fullscreen="$vuetify.display.mobile"
        :max-width="600"
        transition="dialog-bottom-transition"
    >
        <v-card v-if="dialogContent" rounded="lg">
            <v-card-title class="d-flex justify-space-between align-center">
                <span class="text-h5">{{ dialogContent?.title ?? "" }}</span>
                <v-btn icon size="small" @click="closeDialog" variant="text">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <component
                :is="dialogContent.component"
                v-bind="dialogContent.props"
                @close="closeDialog"
            />
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { useDialog } from "../../composables/useDialog";

const { closeDialog, dialogContent, isOpen } = useDialog();
</script>

<style scoped>
.close-button-container {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 1;
}
</style>
