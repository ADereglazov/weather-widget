<template>
  <form class="location-input" name="location-form" @submit.prevent="onSubmit">
    <label class="location-input__label" for="inputField">Add location</label>
    <div class="location-input__wrapper">
      <input
        id="inputField"
        ref="inputField"
        v-model="newLocationString"
        :class="{
          'location-input__input--error': errStatus,
        }"
        class="location-input__input"
        type="search"
        name="new-location-input"
        placeholder="Input location"
        :disabled="isLoading"
        @input="onInput"
      />
      <button
        v-show="newLocationString.length > 0 && !isLoading"
        type="button"
        name="clear"
        :disabled="newLocationString.length === 0"
        :style="{
          backgroundImage: `url(${require('@/assets/icons/close.svg')})`,
        }"
        aria-label="Clear location input"
        class="location-input__button-clear"
        @click="onClickClear"
      />
      <button
        class="location-input__button-submit"
        type="submit"
        name="enter"
        aria-label="Add new location"
        :disabled="isSubmitButtonDisabled"
        :style="{
          backgroundImage: `url(${require('@/assets/icons/enter.svg')})`,
        }"
      />
      <LoadingSpinner v-show="isLoading" class="location-input__spinner" />
    </div>
    <span class="location-input__status">{{ errStatus }}</span>
  </form>
</template>

<script setup lang="ts">
import { ref, watchEffect, computed, defineEmits, defineProps } from "vue";
import {
  getWeatherByCityName,
  IGetWeatherSucceed,
} from "@/services/fetchWeather";
import { TLanguage } from "@/types/languages";
import { TUnits } from "@/types/units";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const emit = defineEmits(["add-location", "loading"]);

const props = defineProps<{
  lang: TLanguage;
  units: TUnits;
  apiUrl: string;
  apiKey: string;
}>();

let newLocation: IGetWeatherSucceed | null = null;
const inputField = ref<HTMLInputElement | null>(null);
const isLoading = ref<boolean>(false);
const newLocationString = ref<string>("");
const errStatus = ref<string>("");

watchEffect(() => emit("loading", isLoading.value));

const isSubmitButtonDisabled = computed<boolean>(
  () => newLocationString.value.length === 0 || isLoading.value
);

function onInput() {
  errStatus.value = "";
}
async function onSubmit() {
  isLoading.value = true;
  newLocation = await getWeatherData(newLocationString.value);

  if (newLocation) {
    emit("add-location", newLocation);
    newLocationString.value = "";
  }
  inputField.value?.focus();
  isLoading.value = false;
}
async function getWeatherData(
  city: string
): Promise<IGetWeatherSucceed | null> {
  try {
    const result = await getWeatherByCityName({
      city,
      lang: props.lang,
      units: props.units,
      apiUrl: props.apiUrl,
      apiKey: props.apiKey,
    });

    if (result.status !== "succeed") {
      const message = `Oops... ${result.message}, try again`;
      errStatus.value = message;
      console.error(message);

      return null;
    }

    return result;
  } catch (e) {
    errStatus.value = "Oops... something went wrong, try to update page";
    inputField.value?.focus();
    console.error(e);

    return null;
  }
}
function onClickClear() {
  newLocationString.value = "";
  errStatus.value = "";
  inputField.value?.focus();
}
</script>
