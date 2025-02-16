<template>
  <div>
    <AuroraBackground>
      <Motion
        as="div"
        :initial="{ opacity: 0, y: 40, filter: 'blur(10px)' }"
        :in-view="{
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
        }"
        :transition="{
          delay: 0.3,
          duration: 0.8,
          ease: 'easeInOut',
        }"
        class="relative flex flex-col items-center justify-center gap-4 px-4"
      >
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
      </Motion>
    </AuroraBackground>
  </div>
</template>

<script setup lang="ts">
import { Motion } from "motion-v";
import { ref } from "vue";

import { loginUser, registerUser } from "../services/auth";
import AuroraBackground from "./AuroraBackground.vue";

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
