<template>
  <SettingsButton
    class="app-settings-button"
    :settings-opened="settingsOpened"
    @button-click="onSettingsButtonClick"
  />
  <SettingsSection v-if="settingsOpened" />
  <WeatherPointSection v-else />
  <LoadingSpinner v-show="isShowSpinner" class="app-settings-spinner" />
</template>

<script setup>
import { ref } from "vue";
import SettingsButton from "@/components/ManageButton.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import WeatherPointSection from "@/views/WeatherPointSection.vue";
import SettingsSection from "@/views/SettingsSection.vue";

const settingsOpened = ref(false);
const isShowSpinner = ref(false);
function onSettingsButtonClick() {
  settingsOpened.value = !settingsOpened.value;
}
</script>

<style lang="less" scoped>
.app-settings-button {
  position: absolute;
  top: 10px;
  right: 10px;
}

.app-settings-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
