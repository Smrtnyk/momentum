import { defineStore } from "pinia";
import { ref } from "vue";

export interface NotificationState {
    color: string;
    message: string;
    show: boolean;
    timeout: number;
}

export const useGlobalStore = defineStore("global", () => {
    const globalLoading = ref(false);
    const notification = ref<NotificationState>({
        color: "success",
        message: "",
        show: false,
        timeout: 3000,
    });

    function notify(message: string, color = "success", timeout = 3000): void {
        notification.value.show = false;
        notification.value.message = message;
        notification.value.color = color;
        notification.value.timeout = timeout;
        // Small delay to allow the transition to restart
        setTimeout(() => {
            notification.value.show = true;
        }, 0);
    }

    function notifyError(error: unknown, timeout = 3000): void {
        let msg: string;
        if (error instanceof Error) {
            msg = error.message;
        } else if (typeof error === "string") {
            msg = error;
        } else {
            msg = "An unknown error occurred.";
        }
        notify(msg, "error", timeout);
    }

    function setLoading(isLoading: boolean): void {
        globalLoading.value = isLoading;
    }

    return {
        globalLoading,
        notification,
        notify,
        notifyError,
        setLoading,
    };
});
