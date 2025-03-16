<template>
    <v-card-text>
        <v-text-field
            v-model.number="amount"
            type="number"
            label="Amount (ml)"
            variant="outlined"
            :rules="[positiveRequired]"
        ></v-text-field>
    </v-card-text>
    <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('close')">Cancel</v-btn>
        <v-btn color="primary" @click="saveWaterIntake" :disabled="!amount || amount <= 0">
            Save
        </v-btn>
    </v-card-actions>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { positiveRequired } from "../../helpers/form-validators";

const { initialAmount = null } = defineProps<{
    initialAmount?: number;
}>();

const emit = defineEmits<{
    close: [];
    save: [amount: number];
}>();

const amount = ref<null | number>(initialAmount);

function saveWaterIntake(): void {
    if (amount.value && amount.value > 0) {
        emit("save", amount.value);
        emit("close");
    }
}
</script>
