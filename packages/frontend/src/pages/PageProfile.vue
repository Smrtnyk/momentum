<template>
    <v-container class="pa-4 pa-sm-8" style="max-width: 800px">
        <!-- Profile Header Card -->
        <v-card class="mb-6" elevation="2" rounded="lg">
            <v-card-text class="pa-6">
                <v-row align="center" no-gutters>
                    <v-col cols="auto" class="mr-4">
                        <v-avatar size="100" class="elevation-4">
                            <v-img
                                :src="
                                    auth.currentUser?.photoURL ||
                                    profile?.profilePictureUrl ||
                                    defaultAvatar
                                "
                            />
                        </v-avatar>
                    </v-col>
                    <v-col>
                        <h1 class="text-h4 font-weight-bold">
                            {{ profile?.name || "Anonymous User" }}
                        </h1>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <!-- Stats Grid -->
        <v-row class="mb-6" dense>
            <v-col cols="12" md="6">
                <v-card elevation="2" rounded="lg" class="h-100">
                    <v-card-title class="bg-primary">
                        <v-icon icon="mdi-account-box" class="mr-2" />
                        Personal Details
                    </v-card-title>
                    <v-card-text class="pa-4">
                        <v-list density="comfortable">
                            <v-list-item v-if="computedAge">
                                <template #prepend>
                                    <v-icon icon="mdi-cake-variant" class="mr-4" />
                                </template>
                                <v-list-item-title>Age</v-list-item-title>
                                <v-list-item-subtitle>{{ computedAge }} years</v-list-item-subtitle>
                            </v-list-item>

                            <v-list-item>
                                <template #prepend>
                                    <v-icon icon="mdi-human-male-height" class="mr-4" />
                                </template>
                                <v-list-item-title>Height</v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ profile?.height || "-" }} cm
                                </v-list-item-subtitle>
                            </v-list-item>

                            <v-list-item>
                                <template #prepend>
                                    <v-icon icon="mdi-weight-kilogram" class="mr-4" />
                                </template>
                                <v-list-item-title>Weight</v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ profile?.weight || "-" }} kg
                                </v-list-item-subtitle>
                            </v-list-item>

                            <v-list-item>
                                <template #prepend>
                                    <v-icon icon="mdi-gender-male-female" class="mr-4" />
                                </template>
                                <v-list-item-title>Gender</v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ profile?.gender || "-" }}
                                </v-list-item-subtitle>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="6">
                <v-card elevation="2" rounded="lg" class="h-100">
                    <v-card-title class="bg-secondary">
                        <v-icon icon="mdi-chart-areaspline" class="mr-2" />
                        Health Metrics
                    </v-card-title>
                    <v-card-text class="pa-4">
                        <div class="d-flex align-center justify-center mb-4">
                            <v-progress-circular
                                v-if="bmi"
                                :model-value="bmi"
                                :size="120"
                                :width="12"
                                :color="bmiColor"
                                class="mr-4"
                            >
                                <span class="text-h6">{{ bmi.toFixed(1) }}</span>
                            </v-progress-circular>
                            <div>
                                <div class="text-h6 mb-1">Body Mass Index</div>
                                <div class="text-caption text-medium-emphasis">
                                    {{ bmiStatus }}
                                </div>
                            </div>
                        </div>

                        <v-divider class="my-4" />

                        <div class="text-caption text-medium-emphasis">
                            BMI Classification:
                            <v-chip :color="bmiColor" size="small" class="ml-2">
                                {{ bmiStatus }}
                            </v-chip>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Action Buttons -->
        <div class="d-flex gap-2 justify-end mt-6">
            <v-btn
                color="primary"
                variant="tonal"
                prepend-icon="mdi-account-edit"
                @click="openEditDialog"
            >
                {{ profile ? "Edit Profile" : "Create Profile" }}
            </v-btn>

            <v-btn color="error" variant="tonal" prepend-icon="mdi-logout" @click="handleLogout">
                Logout
            </v-btn>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import { useAsyncState } from "@vueuse/core";
import { computed, watch } from "vue";
import { useRouter } from "vue-router";

import type { UserProfile } from "../services/user";

import EditProfileForm from "../components/EditProfileForm.vue";
import { useDialog } from "../composables/useDialog";
import { auth } from "../firebase";
import { logoutUser } from "../services/auth";
import { getUserProfile } from "../services/user";
import { useGlobalStore } from "../stores/global";

const globalStore = useGlobalStore();
const router = useRouter();
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
        globalStore.notifyError(err);
    }
});

const bmiColor = computed(() => {
    if (!bmi.value) return "grey";
    if (bmi.value < 18.5) return "cyan";
    if (bmi.value < 25) return "green";
    if (bmi.value < 30) return "orange";
    return "red";
});

const bmiStatus = computed(() => {
    if (!bmi.value) return "Not available";
    if (bmi.value < 18.5) return "Underweight";
    if (bmi.value < 25) return "Healthy";
    if (bmi.value < 30) return "Overweight";
    return "Obese";
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

async function handleLogout(): Promise<void> {
    await logoutUser();
    await router.push("/auth");
}

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
