<template>
  <section class="settings-section">
    <header class="settings-section__header">
      <h2 class="settings-section__title">{{ dict.settings }}</h2>
    </header>

    <SettingsOptions
      v-if="additionalSettingsOpened"
      :lang="mainProps.lang"
      :updatePeriod="mainProps.updatePeriod"
      :units="mainProps.units"
      :pressure-unit="mainProps.pressureUnit"
      :dict="dict"
      :is-loading="isLoading"
      class="settings-section__options"
      @change-settings="emit('change-settings', $event)"
    />

    <template v-else>
      <LocationInput
        class="settings-section__location-input"
        :lang="mainProps.lang"
        :units="mainProps.units"
        :apiUrl="mainProps.apiUrl"
        :apiKey="mainProps.apiKey"
        :dict="dict"
        @loading="onLoading"
        @suggestion-opened="isOpacity = $event"
        @add-location="onAddLocation"
      />

      <DraggableList
        :locations-list="locationsList"
        :dict="dict"
        :class="{
          'settings-section__draggable-list--opacity': isOpacity,
        }"
        class="settings-section__draggable-list"
        @sorting-locations-list="onSorting"
        @delete="onDelete"
      />
    </template>

    <SettingsSectionFooter
      :model="additionalSettingsOpened"
      :dict="dict"
      @toggle-settings="additionalSettingsOpened = $event"
    />
  </section>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref } from "vue";
import { IWeatherLocationTimestamped, IProps } from "@/types";
import { IDictionary } from "@/locales/types";
import LocationInput from "@/components/LocationInput.vue";
import DraggableList from "@/components/DraggableList.vue";
import SettingsOptions from "@/components/SettingsOptions.vue";
import SettingsSectionFooter from "@/components/SettingsSectionFooter.vue";

const emit = defineEmits([
  "sorting-locations-list",
  "add-location",
  "delete",
  "loading",
  "change-settings",
]);

defineProps<{
  locationsList: IWeatherLocationTimestamped[];
  mainProps: IProps;
  dict: IDictionary;
  isLoading: boolean;
}>();

const additionalSettingsOpened = ref(false);
const isOpacity = ref(false);

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
