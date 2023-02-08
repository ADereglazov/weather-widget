<template>
  <section class="settigs-section">
    <h2 class="settigs-section__title">Settings</h2>

    <Draggable
      v-model="listModel"
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
            element.name + ", " + element.sys.country
          }}</span>
          <DeleteButton @delete="onDelete(index)" />
        </li>
      </template>
    </Draggable>

    <LocationInput
      class="settigs-section__location-input"
      :api-url="apiUrl"
      :api-key="apiKey"
      @add-location="onAddLocation"
    />
  </section>
</template>

<script>
import { computed } from "vue";
import Draggable from "vuedraggable";
import BurgerIcon from "@/assets/icons/burger.svg";
import DeleteButton from "@/components/DeleteButton.vue";
import LocationInput from "@/components/LocationInput.vue";

export default {
  name: "SettingsSection",
  components: { Draggable, BurgerIcon, DeleteButton, LocationInput },
  emits: ["add-location", "delete"],
  props: {
    locationsList: {
      type: Array,
    },
    apiUrl: {
      type: String,
    },
    apiKey: {
      type: String,
    },
  },
  setup(props, { emit }) {
    const dragOptions = {
      animation: 200,
      disabled: false,
      ghostClass: "ghost",
    };

    const listModel = computed({
      get: () => [...props.locationsList],
      set: (val) => emit("changeLocationsList", val),
    });

    function onAddLocation(location) {
      emit("add-location", location);
    }
    function onDelete(index) {
      emit("delete", index);
    }

    return {
      dragOptions,
      listModel,
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
