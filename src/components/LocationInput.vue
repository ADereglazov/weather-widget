<template>
  <form class="location-input" name="location-form" @submit.prevent="onSubmit">
    <label class="location-input__label" for="inputField">Add location</label>
    <div class="location-input__wrapper">
      <input
        id="inputField"
        ref="inputField"
        v-model="newLocation"
        class="location-input__input"
        type="text"
        name="new-location-input"
        placeholder="Input location"
      />
      <button
        class="location-input__button-submit"
        type="submit"
        name="enter"
        aria-label="Add new location"
        :disabled="newLocation.length === 0 || isLoading"
      >
        <EnterIcon />
      </button>
      <button
        v-show="!isLoading"
        type="button"
        :disabled="newLocation.length === 0"
        aria-label="Clear location input"
        class="location-input__button-clear"
        @click="onClickClear"
      >
        <CloseIcon />
      </button>
      <LoadingSpinner v-show="isLoading" class="location-input__spinner" />
    </div>
  </form>
</template>

<script>
import { ref } from "vue";
import CloseIcon from "@/assets/icons/close.svg";
import EnterIcon from "@/assets/icons/enter.svg";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

export default {
  name: "LocationInput",
  components: { CloseIcon, EnterIcon, LoadingSpinner },
  emits: ["add-location"],
  setup(props, { emit }) {
    const inputField = ref(null);
    const newLocation = ref("");
    const isLoading = ref(false);
    function onClickClear() {
      newLocation.value = "";
      inputField.value.focus();
    }
    function onSubmit() {
      emit("add-location", newLocation.value);
      newLocation.value = "";
    }

    return {
      newLocation,
      inputField,
      isLoading,
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
  }

  &__label {
    font-size: 15px;
    font-weight: bold;
  }

  &__input {
    width: 100%;
    padding: 5px 25px 5px 5px;
    margin-right: 10px;
  }

  &__button-clear {
    position: absolute;
    top: 50%;
    right: 32px;
    transform: translateY(-50%);

    display: block;
    width: 25px;
    height: 25px;
  }

  &__spinner {
    position: absolute;
    top: 50%;
    right: 5px;
    transform: translateY(-50%) scale(30%);
  }
}
</style>
