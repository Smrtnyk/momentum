import { defineStore } from "pinia";

export interface NotificationState {
    color: string;
    message: string;
    show: boolean;
    timeout: number;
}

export const useGlobalStore = defineStore("global", {
    actions: {
        notify(message: string, color = "success", timeout = 3000) {
            this.notification.show = false;
            this.notification.message = message;
            this.notification.color = color;
            this.notification.timeout = timeout;
            setTimeout(() => {
                this.notification.show = true;
            }, 0);
        },
        notifyError(error: unknown, timeout = 3000) {
            let message: string;
            if (error instanceof Error) {
                message = error.message;
            } else if (typeof error === "string") {
                message = error;
            } else {
                message = "An unknown error occurred.";
            }
            this.notify(message, "error", timeout);
        },
        setLoading(isLoading: boolean) {
            this.globalLoading = isLoading;
        },
    },
    state: () => ({
        globalLoading: false,
        notification: {
            color: "success",
            message: "",
            show: false,
            timeout: 3000,
        } as NotificationState,
    }),
});
