<template>
  <section class="settigs-section">
    <h2 class="settigs-section__title">Settings</h2>

    <Draggable
      v-model="locationsList"
      v-bind="dragOptions"
      item-key="id"
      handle=".handle"
      tag="ul"
      class="settigs-section__list"
    >
      <template #item="{ element, index }">
        <li class="settigs-section__list-item">
          <BurgerIcon class="settigs-section__list-item-icon--move handle" />
          <span class="settigs-section__list-item-text">{{
            element.location
          }}</span>
          <DeleteButton @delete="onDelete(index)" />
        </li>
      </template>
    </Draggable>

    <LocationInput
      :api-url="apiUrl"
      :api-key="apiKey"
      @add-location="onAddLocation"
    />
  </section>
</template>

<script>
import { ref } from "vue";
import Draggable from "vuedraggable";
import BurgerIcon from "@/assets/icons/burger.svg";
import DeleteButton from "@/components/DeleteButton.vue";
import LocationInput from "@/components/LocationInput.vue";

export default {
  name: "SettingsSection",
  components: { Draggable, BurgerIcon, DeleteButton, LocationInput },
  props: {
    apiUrl: {
      type: String,
    },
    apiKey: {
      type: String,
    },
  },
  setup() {
    const dragOptions = {
      animation: 200,
      disabled: false,
      ghostClass: "ghost",
    };
    const locationsList = ref([
      { id: 1, location: "Moscow, RU" },
      { id: 2, location: "London, UK" },
    ]);

    function onAddLocation(location) {
      const locationListLength = locationsList.value.length;
      locationsList.value.splice(locationListLength, 0, {
        id: location.id,
        location: location.name + ", " + location.sys.country,
      });
    }
    function onDelete(index) {
      locationsList.value.splice(index, 1);
    }

    return {
      dragOptions,
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
