<template>
  <button
    type="button"
    name="toggle"
    :disabled="disabled"
    :aria-label="ariaLabel"
    :style="{
      backgroundImage: isSettingsOpened
        ? `url(${require('@/assets/icons/close.svg')})`
        : `url(${require('@/assets/icons/settings.svg')})`,
    }"
    class="settings-button"
    @click="onClick"
  />
</template>

<script setup lang="ts">
import { defineEmits, defineProps, computed } from "vue";
import { IDictionary } from "@/locales/types";

const emit = defineEmits(["button-click"]);

const props = defineProps<{
  isSettingsOpened: boolean;
  disabled: boolean;
  dict: IDictionary;
}>();

const ariaLabel = computed<string>(() =>
  props.isSettingsOpened ? props.dict.closeSettings : props.dict.settings
);
function onClick() {
  emit("button-click");
}
</script>
