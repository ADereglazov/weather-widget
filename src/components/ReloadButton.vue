<template>
  <button
    :disabled="disabled"
    :aria-label="dict.reload"
    :style="{
      backgroundImage: `url(${require('@/assets/icons/reload.svg')})`,
    }"
    type="button"
    class="reload-button"
    @click="emit('reload')"
  />
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from "vue";
import { IDictionary } from "@/locales/types";

const emit = defineEmits(["reload"]);

defineProps<{
  disabled?: boolean;
  dict: IDictionary;
}>();
</script>
