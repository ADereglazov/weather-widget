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
import { ref, computed } from "vue";
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

    const isSubmitButtonDisabled = computed(
      () => newLocationString.value.length === 0 || isLoading.value
    );
    function onInput() {
      errStatus.value = "";
    }
    async function onSubmit() {
      newLocationObj = await getWeatherData(newLocationString.value);

      if (newLocationObj) {
        emit("add-location", newLocationObj);
        newLocationString.value = "";
      }
      inputField.value.focus();
    }
    async function getWeatherData(value) {
      try {
        isLoading.value = true;
        const response = await fetch(
          `${props.apiUrl}?q=${value}&units=metric&APPID=${props.apiKey}`
        );

        if (response.ok) {
          return await response.json();
        } else {
          const err = await response.json();
          throw new Error(err.message);
        }
      } catch (e) {
        errStatus.value = "Ooops, " + e.message + ", try again";
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

<style lang="less" scoped>
.location-input {
  &__wrapper {
    position: relative;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 5px;
  }

  &__label {
    display: inline-block;
    margin-bottom: 5px;

    font-size: 15px;
    font-weight: bold;
  }

  &__input {
    width: 100%;
    padding: 5px 25px 5px 5px;
    margin-right: 10px;

    outline: 2px solid @gray-dark;
    border: none;
    border-radius: 2px;

    &&--error {
      outline-color: @red;

      &:focus,
      &:focus-visible {
        outline-color: @red;
      }
    }

    &:focus,
    &:focus-visible {
      outline-color: @blue;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      -webkit-background-clip: text;
      transition: background-color 5000s ease-in-out 0s;
    }
    // delete cross inside input with type "search"
    &[type="search"]::-webkit-search-decoration,
    &[type="search"]::-webkit-search-cancel-button,
    &[type="search"]::-webkit-search-results-button,
    &[type="search"]::-webkit-search-results-decoration {
      display: none;
    }
  }

  &__button-clear {
    position: absolute;
    top: 50%;
    right: 32px;
    transform: translateY(-50%);

    width: 25px;
    height: 25px;
  }

  &__status {
    display: inline-block;

    font-size: inherit;
    color: @red;
  }

  &__spinner {
    position: absolute;
    top: 50%;
    right: 5px;
    transform: translateY(-50%) scale(30%);
  }
}
</style>
