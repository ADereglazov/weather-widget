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

<script>
import { ref, computed, toRefs } from "vue";
import { getWeatherCity } from "@/services/fetchWeather";
import CloseIcon from "@/assets/icons/close.svg";
import EnterIcon from "@/assets/icons/enter.svg";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

export default {
  name: "LocationInput",
  components: { CloseIcon, EnterIcon, LoadingSpinner },
  emits: ["add-location"],
  props: {
    apiUrl: {
      type: String,
    },
    apiKey: {
      type: String,
    },
  },
  setup(props, { emit }) {
    let newLocationObj = null;

    const inputField = ref(null);
    const isLoading = ref(false);
    const newLocationString = ref("");
    const errStatus = ref("");
    const { apiUrl, apiKey } = toRefs(props);

    const isSubmitButtonDisabled = computed(
      () => newLocationString.value.length === 0 || isLoading.value
    );
    function onInput() {
      errStatus.value = "";
    }
    async function onSubmit() {
      newLocationObj = await getWeatherData(newLocationString.value);

      if (newLocationObj) {
        newLocationObj.lastUpdated = Date.now();
        emit("add-location", newLocationObj);
        newLocationString.value = "";
      }
      inputField.value.focus();
    }
    async function getWeatherData(value) {
      try {
        isLoading.value = true;
        return await getWeatherCity(value, apiUrl.value, apiKey.value);
      } catch (e) {
        errStatus.value = "Oops, " + e.message + ", try again";
        inputField.value.focus();
      } finally {
        isLoading.value = false;
      }
    }
    function onClickClear() {
      newLocationString.value = "";
      inputField.value.focus();
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
};
</script>
