import { ref, shallowRef } from "vue";

interface DialogContent {
    component: any;
    props?: Record<string, unknown>;
    title?: string;
}

interface TopProps {
    componentProps: Record<string, unknown>;
    title?: string;
}

const isOpen = ref(false);
const dialogContent = shallowRef<DialogContent | null>(null);

export function useDialog() {
    function openDialog(component: any, topProps: TopProps): void {
        dialogContent.value = { component, props: topProps.componentProps, title: topProps.title };
        isOpen.value = true;
    }

    function closeDialog(): void {
        isOpen.value = false;
        // Give the dialog time to animate out before clearing content
        setTimeout(() => {
            dialogContent.value = null;
        }, 300);
    }

    return { closeDialog, dialogContent, isOpen, openDialog };
}
