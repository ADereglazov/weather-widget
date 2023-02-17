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
        class="location-input__button-submit"
        type="submit"
        name="enter"
        aria-label="Add new location"
        :disabled="isSubmitButtonDisabled"
      >
        <EnterIcon />
      </button>
      <button
        v-show="newLocationString.length > 0 && !isLoading"
        type="button"
        name="clear"
        :disabled="newLocationString.length === 0"
        aria-label="Clear location input"
        class="location-input__button-clear"
        @click="onClickClear"
      >
        <CloseIcon />
      </button>
      <LoadingSpinner v-show="isLoading" class="location-input__spinner" />
    </div>
    <span class="location-input__status">{{ errStatus }}</span>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect, computed } from "vue";
import {
  getWeatherByCityName,
  IGetWeatherSucceed,
} from "@/services/fetchWeather";
import { TLanguage } from "@/types/languages";
import { TUnits } from "@/types/units";
import CloseIcon from "@/components/icons/CloseIcon.vue";
import EnterIcon from "@/components/icons/EnterIcon.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

export default defineComponent({
  name: "LocationInput",
  components: { CloseIcon, EnterIcon, LoadingSpinner },
  emits: ["add-location", "loading"],
  setup(props, { emit }) {
    let newLocation: IGetWeatherSucceed | null = null;

    const LANG: TLanguage = process.env.VUE_APP_LANG || "en";
    const UNITS: TUnits = process.env.VUE_APP_UNITS || "metric";
    const API_URL: string = process.env.VUE_APP_API_URL || "";
    const API_KEY: string = process.env.VUE_APP_API_KEY || "";

    const inputField = ref<HTMLInputElement>();
    const isLoading = ref<boolean>(false);
    const newLocationString = ref<string>("");
    const errStatus = ref<string>("");

    watchEffect(() => emit("loading", isLoading.value));

    const isSubmitButtonDisabled = computed(
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
      if (inputField.value) inputField.value.focus();
      isLoading.value = false;
    }
    async function getWeatherData(
      city: string
    ): Promise<IGetWeatherSucceed | null> {
      try {
        const result = await getWeatherByCityName({
          city,
          lang: LANG,
          units: UNITS,
          apiUrl: API_URL,
          apiKey: API_KEY,
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
        if (inputField.value) inputField.value.focus();
        console.error(e);

        return null;
      }
    }
    function onClickClear() {
      newLocationString.value = "";
      errStatus.value = "";
      if (inputField.value) inputField.value.focus();
    }

    return {
      newLocationString,
      errStatus,
      inputField,
      isLoading,
      isSubmitButtonDisabled,
      onInput,
      onClickClear,
      onSubmit,
    };
  },
});
</script>
