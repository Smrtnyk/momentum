<template>
  <div
    ref="textareaContainerRef"
    :class="
      cn(
        'group/input rounded-lg p-[2px] transition duration-300',
        props.containerClass,
      )
    "
    :style="{ background: containerBg }"
    @mouseenter="() => (visible = true)"
    @mouseleave="() => (visible = false)"
    @mousemove="handleMouseMove"
  >
    <textarea
      v-bind="$attrs"
      v-model="modelValue"
      :class="
        cn(
          'flex w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 transition duration-400 group-hover/input:shadow-none',
          props.class,
        )
      "
    />
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";

import { useVModel } from "@vueuse/core";
import { computed, ref } from "vue";

import { cn } from "../lib/utils";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  class?: HTMLAttributes["class"];
  containerClass?: HTMLAttributes["class"];
  defaultValue?: string;
  modelValue?: string;
}>();

const emits = defineEmits<(e: "update:modelValue", payload: string) => void>();

const modelValue = useVModel(props, "modelValue", emits, {
  defaultValue: props.defaultValue,
  passive: true,
});

const textareaContainerRef = ref<HTMLDivElement | null>(null);
const mouse = ref({ x: 0, y: 0 });
const radius = 100;
const visible = ref(false);

const containerBg = computed(() => {
  return `
    radial-gradient(
      ${visible.value ? `${radius}px` : "0px"} circle at ${mouse.value.x}px ${mouse.value.y}px,
      var(--blue-500),
      transparent 80%
    )
  `;
});

function handleMouseMove({ clientX, clientY }: MouseEvent): void {
  if (!textareaContainerRef.value) return;
  const { left, top } = textareaContainerRef.value.getBoundingClientRect();
  mouse.value = { x: clientX - left, y: clientY - top };
}
</script>

<style scoped>
textarea {
  box-shadow:
    0px 2px 3px -1px rgba(0, 0, 0, 0.1),
    0px 1px 0px 0px rgba(25, 28, 33, 0.02),
    0px 0px 0px 1px rgba(25, 28, 33, 0.08);
}
</style>
