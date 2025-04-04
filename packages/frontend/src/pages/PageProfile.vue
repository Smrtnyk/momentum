<template>
    <v-container class="pa-2 mx-auto">
        <!-- Profile Header Card -->
        <v-card class="mb-6" elevation="2" rounded="lg">
            <v-card-text class="pa-6">
                <v-row align="center" no-gutters>
                    <v-col cols="auto" class="mr-4">
                        <v-avatar size="100" class="elevation-4">
                            <v-img
                                :src="
                                    authStore.currentUser?.photoURL ||
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
                                <v-list-item-title>Latest weight</v-list-item-title>
                                <v-list-item-subtitle>
                                    {{
                                        latestWeight ? `${latestWeight.weight.toFixed(1)} kg` : "-"
                                    }}
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
                        <!-- Loading state for BMI -->
                        <div v-if="isLoading" class="d-flex align-center justify-center mb-4">
                            <v-skeleton-loader
                                type="avatar"
                                :width="120"
                                :height="120"
                                class="mr-4"
                            ></v-skeleton-loader>
                            <div>
                                <v-skeleton-loader type="text" width="120"></v-skeleton-loader>
                                <v-skeleton-loader
                                    type="text"
                                    width="80"
                                    class="mt-2"
                                ></v-skeleton-loader>
                            </div>
                        </div>

                        <!-- Loaded BMI data -->
                        <div v-else-if="bmi" class="d-flex align-center justify-center mb-4">
                            <v-progress-circular
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

                        <!-- No BMI data available -->
                        <div v-else class="d-flex align-center justify-center mb-4">
                            <v-progress-circular
                                :size="120"
                                :width="12"
                                color="grey"
                                indeterminate
                                class="mr-4"
                            >
                                <span class="text-h6">-</span>
                            </v-progress-circular>
                            <div>
                                <div class="text-h6 mb-1">Body Mass Index</div>
                                <div class="text-caption text-medium-emphasis">Not available</div>
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
        <div class="d-flex gap-2 mt-6">
            <v-btn
                color="primary"
                variant="tonal"
                prepend-icon="mdi-account-edit"
                @click="openEditDialog"
            >
                {{ profile ? "Edit Profile" : "Create Profile" }}
            </v-btn>

            <v-spacer />

            <v-btn color="error" variant="tonal" prepend-icon="mdi-logout" @click="handleLogout">
                Logout
            </v-btn>
        </div>

        <BuildInfoFooter :show-git-hash="true" />
    </v-container>
</template>

<script setup lang="ts">
import { useAsyncState } from "@vueuse/core";
import { computed } from "vue";
import { useRouter } from "vue-router";

import BuildInfoFooter from "../components/BuildInfoFooter.vue";
import EditProfileForm from "../components/profile/EditProfileForm.vue";
import { globalDialog } from "../composables/useDialog";
import { logger } from "../logger/app-logger";
import { logoutUser } from "../services/auth";
import { getLatestWeight } from "../services/health-metrics";
import { useAuthStore } from "../stores/auth";
import { useGlobalStore } from "../stores/global";

const authStore = useAuthStore();
const globalStore = useGlobalStore();
const profile = computed(() => authStore.userProfile);
const router = useRouter();
const defaultAvatar = "https://placehold.co/150x150.png";

const { isLoading, state: latestWeight } = useAsyncState(
    () => getLatestWeight(authStore.nonNullableUser.uid),
    null,
    {
        onError(error) {
            globalStore.notifyError("Failed to load weight data");
            logger.error("Error fetching weight:", "PageProfile", error);
        },
    },
);

const bmi = computed(() => {
    if (profile.value?.height && latestWeight.value?.weight) {
        const heightInMeters = profile.value.height / 100;
        return latestWeight.value.weight / (heightInMeters * heightInMeters);
    }
    return null;
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

async function handleLogout(): Promise<void> {
    await logoutUser();
    await router.push("/auth");
}

function openEditDialog(): void {
    globalDialog.openDialog(
        EditProfileForm,
        {
            initialProfile: profile.value,
        },
        {
            title: profile.value ? "Edit Profile" : "Create Profile",
        },
    );
}
</script>
