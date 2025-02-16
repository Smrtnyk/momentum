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
          <IInput v-model="email" type="email" placeholder="Email" required />
          <IInput
            v-model="password"
            type="password"
            placeholder="Password"
            required
          />
          <RippleButton type="submit">{{
            isLogin ? "Login" : "Register"
          }}</RippleButton>
        </form>
        <RippleButton @click="toggleMode">
          Switch to {{ isLogin ? "Register" : "Login" }}
        </RippleButton>
      </Motion>
    </AuroraBackground>
  </div>
</template>

<script setup lang="ts">
import { Motion } from "motion-v";
import { ref } from "vue";
import { useRouter } from "vue-router";

import AuroraBackground from "../components/ui/AuroraBackground.vue";
import IInput from "../components/ui/IInput.vue";
import RippleButton from "../components/ui/RippleButton.vue";
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
