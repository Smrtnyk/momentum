<template>
    <teleport to="body">
        <div v-if="isRevealed" class="modal-layout">
            <div class="modal">
                <h2>{{ confirmState.title }}</h2>
                <p>{{ confirmState.message }}</p>
                <v-btn color="primary" @click="handleConfirm(true)">Yes</v-btn>
                <v-btn @click="handleConfirm(false)">No</v-btn>
            </div>
        </div>
    </teleport>
</template>

<script setup lang="ts">
import { useGlobalConfirm } from "../../composables/useConfirmDialog";

const { confirm, confirmState, isRevealed } = useGlobalConfirm();

function handleConfirm(response: boolean): void {
    confirm(response);
}
</script>

<style scoped>
.modal-layout {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}
.modal {
    background: #1e1e2f;
    padding: 16px;
    border-radius: 8px;
    color: #e0e0e0;
    text-align: center;
}
</style>
