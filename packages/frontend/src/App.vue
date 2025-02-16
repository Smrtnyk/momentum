<template>
  <TopMenu v-if="user" />
  <router-view />
</template>

<script setup lang="ts">
import type { User } from "firebase/auth";

import { onAuthStateChanged } from "firebase/auth";
import { ref } from "vue";

import TopMenu from "./components/TopMenu.vue";
import { auth } from "./firebase";

const user = ref<null | User>(null);

onAuthStateChanged(auth, function (currentUser: null | User): void {
  user.value = currentUser;
});
</script>
