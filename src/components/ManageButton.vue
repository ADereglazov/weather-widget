<template>
  <button
    type="button"
    name="toggle"
    :aria-label="isSettingsOpened ? 'Settigs' : 'Close settigs'"
    class="settings-button"
    @click="onClick"
  >
    <CloseIcon v-if="isSettingsOpened" />
    <SettingsIcon v-else />
  </button>
</template>

<script>
import SettingsIcon from "@/assets/icons/settings.svg";
import CloseIcon from "@/assets/icons/close.svg";

export default {
  name: "ManageButton",
  components: { SettingsIcon, CloseIcon },
  emits: ["button-click"],
  props: {
    isSettingsOpened: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    function onClick() {
      emit("button-click");
    }

    return {
      onClick,
    };
  },
};
</script>
