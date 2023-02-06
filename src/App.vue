<template>
  <SettingsButton
    class="app-settings-button"
    :settings-opened="settingsOpened"
    @button-click="onSettingsButtonClick"
  />
  <SettingsSection v-if="settingsOpened" />
  <WeatherPointSection v-else />
</template>

<script setup>
import { ref } from "vue";
import SettingsButton from "@/components/SettingsButton.vue";
import WeatherPointSection from "@/views/WeatherPointSection.vue";
import SettingsSection from "@/views/SettingsSection.vue";

const settingsOpened = ref(false);
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
</style>
