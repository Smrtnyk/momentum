import { ref, shallowRef } from "vue";

interface DialogContent {
    component: any;
    props?: Record<string, unknown>;
}

const isOpen = ref(false);
const dialogContent = shallowRef<DialogContent | null>(null);

export function useDialog() {
    function openDialog(component: any, props: Record<string, unknown> = {}): void {
        dialogContent.value = { component, props };
        isOpen.value = true;
    }

    function closeDialog(): void {
        isOpen.value = false;
        dialogContent.value = null;
    }

    return { closeDialog, dialogContent, isOpen, openDialog };
}
