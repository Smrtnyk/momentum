<template>
    <div class="dialog-container">
        <template v-for="dialog in dialogs" :key="dialog.id">
            <v-dialog
                v-model="dialogVisibility[dialog.id]"
                :persistent="dialog.persistent ?? false"
                :fullscreen="dialog.fullscreen ?? $vuetify.display.mobile"
                :max-width="dialog.maxWidth"
                transition="dialog-bottom-transition"
                :content-class="`dialog-z-${dialog.id}`"
                @update:model-value="handleDialogVisibility(dialog.id, $event)"
            >
                <v-card rounded="lg">
                    <v-card-title class="d-flex justify-space-between align-center">
                        <span class="text-h5">{{ dialog.title ?? "" }}</span>
                        <v-btn icon size="small" @click="closeDialog(dialog.id)" variant="text">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-card-title>

                    <component
                        :is="dialog.component"
                        v-bind="dialog.props ?? {}"
                        @close="closeDialog(dialog.id)"
                    />
                </v-card>
            </v-dialog>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

import { globalDialog } from "../../composables/useDialog";

const dialogs = computed(() => globalDialog.dialogs.value);

const dialogVisibility = ref<Record<string, boolean>>({});

watch(
    dialogs,
    function (newDialogs) {
        newDialogs.forEach((dialog) => {
            if (dialogVisibility.value[dialog.id] === undefined) {
                dialogVisibility.value[dialog.id] = true;
            }
        });

        // Clean up old dialogs after transition
        const currentIds = new Set(newDialogs.map(({ id }) => id));
        Object.keys(dialogVisibility.value).forEach((id) => {
            if (!currentIds.has(id) && dialogVisibility.value[id] === false) {
                setTimeout(() => {
                    const updatedVisibility = { ...dialogVisibility.value };
                    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- FIXME
                    delete updatedVisibility[id];
                    dialogVisibility.value = updatedVisibility;
                }, 300);
            }
        });
    },
    { immediate: true },
);

function closeDialog(dialogId: string): void {
    // Set to false first to trigger transition
    dialogVisibility.value[dialogId] = false;
    // Give the dialog time to animate out before removing it
    setTimeout(() => {
        globalDialog.closeDialog(dialogId);
    }, 300);
}

function handleDialogVisibility(dialogId: string, isVisible: boolean): void {
    if (!isVisible) {
        const dialog = dialogs.value.find(({ id }) => id === dialogId);
        if (dialog && !dialog.persistent) {
            closeDialog(dialogId);
        } else {
            // Reset visibility if dialog is persistent
            dialogVisibility.value[dialogId] = true;
        }
    }
}
</script>
