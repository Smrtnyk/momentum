import type { User } from "firebase/auth";

import { defineStore } from "pinia";
import { computed, ref } from "vue";

import type { UserProfile } from "../types/user-profile";

import { auth } from "../firebase";
import { getUserProfile, updateUserProfile } from "../services/user";
import { useGlobalStore } from "./global";

export const useAuthStore = defineStore("auth", () => {
    const currentUser = ref<null | User>(null);
    const userProfile = ref<null | UserProfile>(null);
    let unsubscribe: () => void;

    const nonNullableUser = computed(() => {
        if (!currentUser.value) {
            throw new Error("Current user is not defined");
        }
        return currentUser.value;
    });

    const defaultCalorieGoal = computed(() => {
        return userProfile.value?.defaultCalorieGoal ?? 2000;
    });

    function initializeAuthListener() {
        unsubscribe = auth.onAuthStateChanged((user) => {
            currentUser.value = user;
            if (!user) {
                userProfile.value = null;
            }
        });

        return function () {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }

    const isReady = computed(() => Boolean(userProfile.value));
    async function waitForAuthReady(): Promise<void> {
        if (isReady.value) {
            return;
        }

        const globalStore = useGlobalStore();
        globalStore.setLoading(true);

        try {
            await auth.authStateReady();
            if (auth.currentUser) {
                await fetchUserProfile();
            }
        } finally {
            globalStore.setLoading(false);
        }
    }

    async function fetchUserProfile(): Promise<void> {
        if (!currentUser.value) return;

        const globalStore = useGlobalStore();
        const shouldManageGlobalLoading = !isReady.value;

        if (shouldManageGlobalLoading) {
            globalStore.setLoading(true);
        }

        try {
            userProfile.value = await getUserProfile(currentUser.value.uid);
        } catch (error) {
            userProfile.value = null;

            // Only show notification for actual profile errors
            // Skip for new users that don't have a profile yet
            if (error instanceof Error && !error.message.includes("User not found")) {
                globalStore.notifyError(error);
            }
        } finally {
            if (shouldManageGlobalLoading) {
                globalStore.setLoading(false);
            }
        }
    }

    async function updateProfile(profileData: Partial<UserProfile>): Promise<void> {
        const globalStore = useGlobalStore();
        globalStore.setLoading(true);

        try {
            await updateUserProfile(nonNullableUser.value.uid, profileData);

            if (userProfile.value) {
                userProfile.value = {
                    ...userProfile.value,
                    ...profileData,
                };
            } else {
                await fetchUserProfile();
            }
        } finally {
            globalStore.setLoading(false);
        }
    }

    return {
        currentUser,
        defaultCalorieGoal,
        initializeAuthListener,
        isReady,
        nonNullableUser,
        updateProfile,
        userProfile: computed(() => userProfile.value),
        waitForAuthReady,
    };
});
