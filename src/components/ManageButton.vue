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

<script lang="ts">
import { defineComponent, computed } from "vue";
import SettingsIcon from "@/components/icons/SettingsIcon.vue";
import CloseIcon from "@/components/icons/CloseIcon.vue";

export default defineComponent({
  name: "ManageButton",
  components: { SettingsIcon, CloseIcon },
  emits: ["button-click"],
  props: {
    isSettingsOpened: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const ariaLabel = computed(() =>
      props.isSettingsOpened ? "Close settigs" : "Settigs"
    );
    function onClick() {
      emit("button-click");
    }

    return {
      ariaLabel,
      onClick,
    };
  },
});
</script>
