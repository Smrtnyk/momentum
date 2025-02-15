<template>
  <div id="app">
    <div v-if="!user">
      <AuthForm />
    </div>
    <div v-else>
      <h1>Welcome, you are logged in!</h1>
      <button @click="logout">Logout</button>
      <WorkoutLogger />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from "firebase/auth";

import { onAuthStateChanged } from "firebase/auth";
import { ref } from "vue";

import AuthForm from "./components/AuthForm.vue";
import WorkoutLogger from "./components/WorkoutLogger.vue";
import { auth } from "./firebase";
import { logoutUser } from "./services/auth";

const user = ref<null | User>(null);

onAuthStateChanged(auth, (currentUser) => {
  user.value = currentUser;
});

async function logout(): Promise<void> {
  await logoutUser();
}
</script>
