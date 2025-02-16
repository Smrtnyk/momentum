<template>
  <header
    class="bg-primary text-primary-foreground p-4 flex justify-between items-center"
  >
    <div class="text-xl font-bold">Momentum</div>
    <nav>
      <ul class="flex space-x-4">
        <li>
          <router-link to="/dashboard" class="hover:underline"
            >Home</router-link
          >
        </li>
      </ul>
    </nav>
    <button
      @click="handleLogout"
      class="px-4 py-2 bg-destructive text-white rounded"
    >
      Logout
    </button>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

import { logoutUser } from "../services/auth";

const router = useRouter();

async function handleLogout(): Promise<void> {
  await logoutUser();
  await router.push("/auth");
}
</script>
