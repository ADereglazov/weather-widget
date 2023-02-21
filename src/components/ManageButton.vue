<template>
  <button
    type="button"
    name="toggle"
    :disabled="disabled"
    :aria-label="ariaLabel"
    class="settings-button"
    @click="onClick"
  >
    <CloseIcon v-if="isSettingsOpened" />
    <SettingsIcon v-else />
  </button>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, computed } from "vue";
import SettingsIcon from "@/components/icons/SettingsIcon.vue";
import CloseIcon from "@/components/icons/CloseIcon.vue";

const emit = defineEmits(["button-click"]);

const props = defineProps<{
  isSettingsOpened: boolean;
  disabled: boolean;
}>();

const ariaLabel = computed<string>(() =>
  props.isSettingsOpened ? "Close settings" : "Settings"
);
function onClick() {
  emit("button-click");
}
</script>
