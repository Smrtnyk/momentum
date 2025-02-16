<template>
  <div>
    <h2>{{ isLogin ? "Login" : "Register" }}</h2>
    <form @submit.prevent="handleSubmit">
      <v-text-field v-model="email" type="email" label="Email" required />
      <v-text-field
        v-model="password"
        type="password"
        label="Password"
        required
      />
      <v-btn type="submit">{{ isLogin ? "Login" : "Register" }}</v-btn>
    </form>
    <v-btn @click="toggleMode">
      Switch to {{ isLogin ? "Register" : "Login" }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { loginUser, registerUser } from "../services/auth";

const router = useRouter();
const isLogin = ref(true);
const email = ref("");
const password = ref("");

async function handleSubmit(): Promise<void> {
  try {
    if (isLogin.value) {
      await loginUser(email.value, password.value);
    } else {
      await registerUser(email.value, password.value);
    }
    await router.push("/dashboard");
  } catch (error: any) {
    console.error(error.message);
  }
}

function toggleMode(): void {
  isLogin.value = !isLogin.value;
}
</script>
