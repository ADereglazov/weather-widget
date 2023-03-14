<template>
  <section class="settings-section">
    <h2 class="settings-section__title">{{ dict.settings }}</h2>

    <SettingsOptions
      v-if="additionalSettingsModel"
      :lang="lang"
      :units="units"
      :dict="dict"
      class="settings-section__options"
      @change-language="emit('change-settings', { lang: $event, units })"
      @change-units="emit('change-settings', { lang, units: $event })"
    />

    <template v-else>
      <LocationInput
        class="settings-section__location-input"
        :lang="lang"
        :units="units"
        :apiUrl="apiUrl"
        :apiKey="apiKey"
        :dict="dict"
        @loading="onLoading"
        @add-location="onAddLocation"
      />

      <DraggableList
        :locations-list="locationsList"
        :dict="dict"
        class="settings-section__draggable-list"
        @sorting-locations-list="onSorting"
        @delete="onDelete"
      />
    </template>

    <label
      class="settings-section__additional-settings-label"
      :style="
        additionalSettingsModel ? labelStyles.base : labelStyles.additional
      "
    >
      <input
        v-model="additionalSettingsModel"
        type="checkbox"
        name="additional-settings"
        class="settings-section__additional-settings-input visually-hidden"
      />
      {{
        additionalSettingsModel ? dict.baseSettings : dict.additionalSettings
      }}
    </label>
  </section>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref } from "vue";
import { IWeatherLocationTimestamped, TLanguage, TUnits } from "@/types";
import { IDictionary } from "@/locales/types";
import LocationInput from "@/components/LocationInput.vue";
import DraggableList from "@/components/DraggableList.vue";
import SettingsOptions from "@/components/SettingsOptions.vue";

const emit = defineEmits([
  "sorting-locations-list",
  "add-location",
  "delete",
  "loading",
  "change-settings",
]);

defineProps<{
  locationsList: IWeatherLocationTimestamped[];
  lang: TLanguage;
  units: TUnits;
  apiUrl: string;
  apiKey: string;
  dict: IDictionary;
}>();

const additionalSettingsModel = ref(false);
const labelStyles = {
  base: {
    backgroundImage: `url(${require("@/assets/icons/left.svg")})`,
    backgroundPosition: "left",
    padding: "0 0 0 20px",
  },
  additional: {
    backgroundImage: `url(${require("@/assets/icons/right.svg")})`,
    backgroundPosition: "right",
    padding: "0 20px 0 0",
  },
};

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
