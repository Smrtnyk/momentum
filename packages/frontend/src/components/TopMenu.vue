<template>
  <header
    class="flex items-center justify-between px-4 py-3 bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
  >
    <div class="text-xl font-bold">Momentum</div>
    <nav>
      <ul class="flex space-x-4">
        <li>
          <router-link
            to="/dashboard"
            class="hover:underline transition-colors"
          >
            Home
          </router-link>
        </li>
      </ul>
    </nav>
    <button
      @click="handleLogout"
      class="px-4 py-2 rounded text-destructive-foreground hover:opacity-90 transition-opacity"
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
