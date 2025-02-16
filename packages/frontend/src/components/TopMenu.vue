<template>
  <v-app-bar app flat color="background" dark>
    <v-toolbar-title>Momentum</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn to="/dashboard"> Home </v-btn>
    <v-btn @click="handleLogout" color="error"> Logout </v-btn>
  </v-app-bar>
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
