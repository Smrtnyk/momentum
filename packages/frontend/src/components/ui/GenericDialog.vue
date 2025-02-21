<template>
    <v-dialog v-model="isOpen" persistent max-width="600">
        <v-card v-if="dialogContent">
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
