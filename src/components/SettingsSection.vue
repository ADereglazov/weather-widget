<template>
  <section class="settigs-section">
    <h2 class="settigs-section__title">Settings</h2>

    <LocationInput
      class="settigs-section__location-input"
      @loading="onLoading"
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

<script lang="ts">
import { defineComponent, computed, toRefs } from "vue";
import Draggable from "vuedraggable";
import BurgerIcon from "@/components/icons/BurgerIcon.vue";
import DeleteButton from "@/components/DeleteButton.vue";
import LocationInput from "@/components/LocationInput.vue";
import { IWeatherLocationTimestamped } from "@/types/weatherLocation";

export default defineComponent({
  name: "SettingsSection",
  components: { Draggable, BurgerIcon, DeleteButton, LocationInput },
  emits: ["sorting-locations-list", "add-location", "delete", "loading"],
  props: {
    locationsList: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const dragOptions = {
      animation: 200,
      disabled: false,
      ghostClass: "ghost",
    };
    const { locationsList } = toRefs(props);

    const listModel = computed({
      get: () => [...locationsList.value],
      set: (val) => emit("sorting-locations-list", val),
    });
    function onAddLocation(location: IWeatherLocationTimestamped) {
      emit("add-location", location);
    }
    function onDelete(index: number) {
      emit("delete", index);
    }

    function onLoading(e: boolean) {
      emit("loading", e);
    }

    return {
      dragOptions,
      listModel,
      onAddLocation,
      onDelete,
      onLoading,
    };
  },
});
</script>
