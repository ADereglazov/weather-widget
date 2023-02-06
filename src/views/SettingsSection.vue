<template>
  <section class="settigs-section">
    <h2 class="settigs-section__title">Settings</h2>

    <ul class="settigs-section__list">
      <li
        v-for="(location, index) in locationsList"
        :key="location + index"
        class="settigs-section__list-item"
      >
        <BurgerIcon class="settigs-section__list-item-icon--move" />
        <span class="settigs-section__list-item-text">{{ location }}</span>
        <DeleteButton @delete="onDelete(index)" />
      </li>
    </ul>

    <LocationInput @add-location="onAddLocation" />
  </section>
</template>

<script>
import { ref } from "vue";
import BurgerIcon from "@/assets/icons/burger.svg";
import DeleteButton from "@/components/DeleteButton.vue";
import LocationInput from "@/components/LocationInput.vue";

export default {
  name: "SettingsSection",
  components: { BurgerIcon, DeleteButton, LocationInput },
  setup() {
    const locationsList = ref(["Moscow, RU", "London, UK"]);

    function onAddLocation(e) {
      locationsList.value.push(e);
    }
    function onDelete(index) {
      locationsList.value.splice(index, 1);
    }

    return {
      locationsList,
      onAddLocation,
      onDelete,
    };
  },
};
</script>

<style lang="less" scoped>
.settigs-section {
  &__title {
    margin: 0;
    font-size: 15px;
    font-weight: bold;
  }

  &__list {
    padding: 0;
    margin: 20px 0 30px 0;
    list-style: none;
  }

  &__list-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 5px;

    background-color: @gray;
  }

  &__list-item + &__list-item {
    margin-top: 10px;
  }

  &__list-item-icon--move {
    &:hover {
      cursor: move;
    }

    &:active {
      opacity: 0.5;
    }
  }

  &__list-item-text {
    display: block;
    max-width: 80%;
    padding: 0 5px;
    margin-right: auto;

    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>
