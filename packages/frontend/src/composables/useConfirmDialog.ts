import { useConfirmDialog } from "@vueuse/core";
import { reactive } from "vue";

interface ConfirmOptions {
    message: string;
    title: string;
}

const confirmState = reactive({
    message: "",
    title: "",
});

const { cancel, confirm: vueUseConfirm, isRevealed, reveal } = useConfirmDialog();

export function useGlobalConfirm() {
    async function openConfirm(options: ConfirmOptions): Promise<boolean> {
        confirmState.title = options.title;
        confirmState.message = options.message;
        const { data, isCanceled } = await reveal();
        return !isCanceled && data === true;
    }

    return { cancel, confirm, confirmState, isRevealed, openConfirm };
}

function confirm(response: boolean): void {
    vueUseConfirm(response);
}
