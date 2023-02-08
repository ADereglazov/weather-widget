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
    :locations-list="locationsList"
    @delete="onDelete"
    @add-location="onAddLocation"
    @change-locations-list="onChange"
  />
  <WeatherPointSection v-else :locations-list="locationsList" />
  <LoadingSpinner v-show="isShowSpinner" class="app-settings-spinner" />
</template>

<script setup>
import { ref, computed, onBeforeMount } from "vue";
import ManageButton from "@/components/ManageButton.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import WeatherPointSection from "@/views/WeatherPointSection.vue";
import SettingsSection from "@/views/SettingsSection.vue";

const locationsList = ref([]);
const isSettingsOpened = ref(false);
const isShowSpinner = ref(false);

const apiUrl = computed(() => import.meta.env.VITE_API_URL);
const apiKey = computed(() => import.meta.env.VITE_API_KEY);

let isLocalStorageAvailable = false;

onBeforeMount(() => {
  isLocalStorageAvailable = testLocalStorage();
  if (isLocalStorageAvailable) {
    locationsList.value = JSON.parse(localStorage.getItem("weatherLocations"));
  }
});
function testLocalStorage() {
  const test = "test";
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}
function onAddLocation(location) {
  const locationListLength = locationsList.value.length;
  locationsList.value.splice(locationListLength, 0, location);
  changeLocalStorageData();
}
function onChange(e) {
  locationsList.value = e;
  changeLocalStorageData();
}
function onDelete(index) {
  locationsList.value.splice(index, 1);
  changeLocalStorageData();
}
function changeLocalStorageData() {
  if (isLocalStorageAvailable) {
    localStorage.setItem(
      "weatherLocations",
      JSON.stringify(locationsList.value)
    );
  }
}
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
