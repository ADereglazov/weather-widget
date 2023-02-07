<template>
  <ManageButton
    class="app-settings-button"
    :is-settings-opened="isSettingsOpened"
    @button-click="onManageButtonClick"
  />
  <SettingsSection v-if="isSettingsOpened" />
  <WeatherPointSection v-else />
  <LoadingSpinner v-show="isShowSpinner" class="app-settings-spinner" />
</template>

<script setup>
import { ref } from "vue";
import ManageButton from "@/components/ManageButton.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import WeatherPointSection from "@/views/WeatherPointSection.vue";
import SettingsSection from "@/views/SettingsSection.vue";

const isSettingsOpened = ref(false);
const isShowSpinner = ref(false);
function onManageButtonClick() {
  isSettingsOpened.value = !isSettingsOpened.value;
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
