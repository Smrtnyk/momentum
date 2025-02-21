<template>
    <v-container fluid class="pa-4">
        <v-card class="mb-4" elevation="2">
            <v-card-text>
                <v-row>
                    <v-col cols="12" class="text-center">
                        <v-avatar size="120" class="elevation-6">
                            <v-img :src="profile?.profilePictureUrl || defaultAvatar" />
                        </v-avatar>
                    </v-col>

                    <v-col cols="12" class="text-center">
                        <h2 class="mt-2">
                            {{ profile?.name || "No Profile Found" }}
                        </h2>
                        <div v-if="profile">
                            <div v-if="profile.birthDate">
                                <strong>Age:</strong> {{ computedAge }}
                            </div>
                            <div><strong>Height:</strong> {{ profile.height }} cm</div>
                            <div><strong>Weight:</strong> {{ profile.weight }} kg</div>
                            <div v-if="bmi"><strong>BMI:</strong> {{ bmi.toFixed(1) }}</div>
                            <div><strong>Gender:</strong> {{ profile.gender }}</div>
                            <div v-if="profile.bio" class="mt-2">
                                <strong>About Me:</strong>
                                <p>{{ profile.bio }}</p>
                            </div>
                            <div v-if="profile.goals" class="mt-2">
                                <strong>Fitness Goals:</strong>
                                <p>{{ profile.goals }}</p>
                            </div>
                        </div>
                        <v-btn class="mt-4" color="primary" @click="openEditDialog">
                            {{ profile ? "Edit Profile" : "Create Profile" }}
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { useAsyncState } from "@vueuse/core";
import { computed, watch } from "vue";

import type { UserProfile } from "../services/user";

import EditProfileForm from "../components/EditProfileForm.vue";
import { useDialog } from "../composables/useDialog";
import { notifyError } from "../composables/useNotify";
import { auth } from "../firebase";
import { getUserProfile } from "../services/user";

const defaultAvatar = "https://placehold.co/150x150.png";

const { error, state: profile } = useAsyncState<null | UserProfile>(async () => {
    if (!auth.currentUser) return null;
    try {
        return await getUserProfile(auth.currentUser.uid);
    } catch (err) {
        return null;
    }
}, null);

watch(error, (err) => {
    if (err) {
        notifyError(err);
    }
});

const bmi = computed(() => {
    if (profile.value?.height && profile.value.weight) {
        const heightInMeters = profile.value.height / 100;
        return profile.value.weight / (heightInMeters * heightInMeters);
    }
    return null;
});

const computedAge = computed(() => {
    if (profile.value?.birthDate) {
        const birth = new Date(profile.value.birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const month = today.getMonth() - birth.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }
    return "";
});

const { openDialog } = useDialog();

function handleProfileSaved(updatedProfile: UserProfile): void {
    profile.value = { ...updatedProfile };
}

function openEditDialog(): void {
    openDialog(EditProfileForm, {
        initialProfile: profile.value,
        onProfileSaved: handleProfileSaved,
    });
}
</script>
