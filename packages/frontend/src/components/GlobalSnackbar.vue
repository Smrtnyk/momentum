<template>
  <v-snackbar
    v-model="notificationState.show"
    :color="notificationState.color"
    :timeout="notificationState.timeout"
    top
    right
    elevation="2"
  >
    {{ notificationState.message }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { notificationState } from "../composables/useNotify";
</script>
