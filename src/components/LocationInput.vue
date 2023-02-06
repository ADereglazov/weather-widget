<template>
  <form class="location-input" name="location-form" @submit.prevent="onSubmit">
    <label class="location-input__label" for="location"> Add location </label>
    <div class="location-input__wrapper">
      <input
        id="location"
        v-model="location"
        class="location-input__input"
        type="text"
        name="location"
        placeholder="Input location"
      />
      <button
        class="location-input__button"
        type="submit"
        name="enter"
        :disabled="location.length === 0"
      >
        <EnterIcon />
      </button>
    </div>
  </form>
</template>

<script>
import { ref } from "vue";
import EnterIcon from "@/assets/icons/enter.svg";

export default {
  name: "LocationInput",
  components: { EnterIcon },
  emits: ["add-location"],
  setup(props, { emit }) {
    const location = ref("");
    function onSubmit() {
      emit("add-location", location.value);
      location.value = "";
    }

    return {
      location,
      onSubmit,
    };
  },
};
</script>

<style lang="less" scoped>
.location-input {
  &__wrapper {
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
    padding: 5px;
    margin-right: 10px;
  }
}
</style>
