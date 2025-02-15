<template>
  <div>
    <h2>{{ isLogin ? "Login" : "Register" }}</h2>
    <form @submit.prevent="handleSubmit">
      <input v-model="email" type="email" placeholder="Email" required />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />
      <button type="submit">{{ isLogin ? "Login" : "Register" }}</button>
    </form>
    <button @click="toggleMode">
      Switch to {{ isLogin ? "Register" : "Login" }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { loginUser, registerUser } from "../services/auth";

const isLogin = ref(true);
const email = ref("");
const password = ref("");

async function handleSubmit(): Promise<void> {
  try {
    if (isLogin.value) {
      await loginUser(email.value, password.value);
      alert("Logged in successfully");
    } else {
      await registerUser(email.value, password.value);
      alert("Registered successfully");
    }
  } catch (error: any) {
    alert(error.message);
  }
}

function toggleMode(): void {
  isLogin.value = !isLogin.value;
}
</script>
