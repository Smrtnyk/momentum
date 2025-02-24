import type { User } from "firebase/auth";

import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { auth } from "../firebase";

export const useAuthStore = defineStore("auth", () => {
    const currentUser = ref<null | User>(null);
    let unsubscribe: () => void;

    const nonNullableUser = computed(() => {
        if (!currentUser.value) {
            throw new Error("Current user is not defined");
        }
        return currentUser.value;
    });

    function initializeAuthListener() {
        unsubscribe = auth.onAuthStateChanged((user) => {
            currentUser.value = user;
        });

        return function () {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }

    const isReady = ref(false);
    async function waitForAuthReady(): Promise<void> {
        if (isReady.value) {
            return;
        }
        await auth.authStateReady();
        isReady.value = true;
    }

    return {
        currentUser,
        initializeAuthListener,
        isReady: computed(() => isReady.value),
        nonNullableUser,
        waitForAuthReady,
    };
});
