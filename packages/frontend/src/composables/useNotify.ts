import { reactive } from "vue";

export interface NotificationState {
  color: string;
  message: string;
  show: boolean;
  timeout: number;
}

export const notificationState = reactive<NotificationState>({
  color: "success",
  message: "",
  show: false,
  timeout: 3000,
});

/**
 * Show a global notification
 *
 * @param message  The text to display in the snackbar
 * @param color    The Vuetify color (e.g., "success", "error", "info", etc.)
 * @param timeout  How long the snackbar remains visible (in ms)
 */
export function notify(
  message: string,
  color = "success",
  timeout = 3000,
): void {
  // reset in case it was already open
  notificationState.show = false;
  notificationState.message = message;
  notificationState.color = color;
  notificationState.timeout = timeout;

  // Use a small delay so the show transition restarts if it was already open
  setTimeout(() => {
    notificationState.show = true;
  }, 0);
}
