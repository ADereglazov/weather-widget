<template>
  <section class="settings-section">
    <h2 class="settings-section__title">Settings</h2>

    <LocationInput
      class="settings-section__location-input"
      :lang="lang"
      :units="units"
      :apiUrl="apiUrl"
      :apiKey="apiKey"
      @loading="onLoading"
      @add-location="onAddLocation"
    />

    <DraggableList
      :locations-list="locationsList"
      class="settings-section__draggable-list"
      @sorting-locations-list="onSorting"
      @delete="onDelete"
    />
  </section>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from "vue";
import { IWeatherLocationTimestamped, TLanguage, TUnits } from "@/types";
import LocationInput from "@/components/LocationInput.vue";
import DraggableList from "@/components/DraggableList.vue";

const emit = defineEmits([
  "sorting-locations-list",
  "add-location",
  "delete",
  "loading",
]);

defineProps<{
  locationsList: IWeatherLocationTimestamped[];
  lang: TLanguage;
  units: TUnits;
  apiUrl: string;
  apiKey: string;
}>();

function onAddLocation(location: IWeatherLocationTimestamped) {
  emit("add-location", location);
}
function onSorting(value: IWeatherLocationTimestamped[]) {
  emit("sorting-locations-list", value);
}
function onDelete(index: number) {
  emit("delete", index);
}
function onLoading(e: boolean) {
  emit("loading", e);
}
</script>
