<template>
  <ManageButton
    class="app-settings-button"
    :is-settings-opened="isSettingsOpened"
    @button-click="onManageButtonClick"
  />
  <SettingsSection
    v-if="isSettingsOpened"
    :api-url="apiUrl"
    :api-key="apiKey"
  />
  <WeatherPointSection v-else />
  <LoadingSpinner v-show="isShowSpinner" class="app-settings-spinner" />
</template>

<script setup>
import { ref, computed } from "vue";
import ManageButton from "@/components/ManageButton.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import WeatherPointSection from "@/views/WeatherPointSection.vue";
import SettingsSection from "@/views/SettingsSection.vue";

const API_URL = "http://api.openweathermap.org/data/2.5/weather";
const API_KEY = "b1d744fa9473793f09565e8124d3ba9c";

const isSettingsOpened = ref(false);
const isShowSpinner = ref(false);
const apiUrl = computed(() => API_URL);
const apiKey = computed(() => API_KEY);
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
