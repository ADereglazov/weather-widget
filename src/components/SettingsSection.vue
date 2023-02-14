<template>
  <section class="settigs-section">
    <h2 class="settigs-section__title">Settings</h2>

    <LocationInput
      class="settigs-section__location-input"
      :api-url="apiUrl"
      :api-key="apiKey"
      @add-location="onAddLocation"
    />

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
  emits: ["sorting-locations-list", "add-location", "delete"],
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
      set: (val) => emit("sorting-locations-list", val),
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
