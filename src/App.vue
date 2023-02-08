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
    class="app-settings-section"
    @delete="onDelete"
    @add-location="addLocation"
    @change-locations-list="onChange"
  />
  <WeatherPointSection v-else :locations-list="locationsList" />
  <LoadingSpinner v-show="isLoading" class="app-settings-spinner" />
  <p
    :class="{ 'app-settings-error--hide': isSettingsOpened || !errStatus }"
    class="app-settings-error"
  >
    {{ errStatus }}
  </p>
</template>

<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { detectGeoLocalization } from "@/composables/geoLocalization";
import ManageButton from "@/components/ManageButton.vue";
import WeatherPointSection from "@/views/WeatherPointSection.vue";
import SettingsSection from "@/views/SettingsSection.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const locationsList = ref([]);
const isSettingsOpened = ref(false);
const isLoading = ref(false);
const errStatus = ref("");

const apiUrl = computed(() => API_URL);
const apiKey = computed(() => API_KEY);

let isLocalStorageAvailable = false;

onBeforeMount(() => {
  isLocalStorageAvailable = testLocalStorage();

  if (isLocalStorageAvailable) {
    locationsList.value =
      JSON.parse(localStorage.getItem("weatherLocations")) || [];
  }

  if (locationsList.value.length === 0) {
    detectGeoLocalization().then((res) => {
      if (res) getWeatherData(res);
    });
  }
});
async function getWeatherData({ lat, lon }) {
  try {
    isLoading.value = true;
    const response = await fetch(
      `${API_URL}?lat=${lat}&lon=${lon}&units=metric&APPID=${API_KEY}`
    );

    if (response.ok) {
      const location = await response.json();
      addLocation(location);
    } else {
      const err = await response.json();
      throw new Error(err.message);
    }
  } catch (e) {
    errStatus.value = "Ooops... " + e.message + ", try to update page";
  } finally {
    isLoading.value = false;
  }
}
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
function addLocation(location) {
  const locationListLength = locationsList.value.length;
  locationsList.value.splice(locationListLength, 0, location);
  changeLocalStorageData();
  errStatus.value = "";
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

.app-settings-error,
.app-settings-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.app-settings-error {
  width: 100%;
  padding: 0 30px;
  margin: 0;

  font-weight: bold;
  color: @red;

  &--hide {
    display: none;
  }
}
</style>
