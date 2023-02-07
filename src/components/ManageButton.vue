<template>
  <button
    type="button"
    name="toggle"
    :aria-label="settingsOpened ? 'Settigs' : 'Close settigs'"
    class="settings-button"
    @click="onClick"
  >
    <CloseIcon v-if="settingsOpened" />
    <SettingsIcon v-else />
  </button>
</template>

<script>
import SettingsIcon from "@/assets/icons/settings.svg";
import CloseIcon from "@/assets/icons/close.svg";

export default {
  name: "SettingsButton",
  components: { SettingsIcon, CloseIcon },
  emits: ["button-click"],
  props: {
    settingsOpened: {
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
