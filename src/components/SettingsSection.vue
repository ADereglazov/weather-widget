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

    <Draggable
      v-model="listModel"
      v-bind="dragOptions"
      item-key="id + lastUpdated"
      handle=".handle"
      tag="ul"
      class="settings-section__list"
    >
      <template #item="{ element, index }">
        <li class="settings-section__list-item">
          <div
            :style="{
              backgroundImage: `url(${require('@/assets/icons/burger.svg')})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }"
            class="settings-section__list-item-icon--move handle"
          />
          <span class="settings-section__list-item-text">{{
            element.name + ", " + element.sys.country
          }}</span>

          <button
            class="settings-section__delete-button"
            type="button"
            name="delete"
            aria-label="Delete item"
            :style="{
              backgroundImage: `url(${require('@/assets/icons/delete.svg')})`,
            }"
            @click="onClickDelete(index)"
          />
        </li>
      </template>
    </Draggable>
  </section>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps } from "vue";
import { IWeatherLocationTimestamped } from "@/types/weatherLocation";
import { TLanguage } from "@/types/languages";
import { TUnits } from "@/types/units";
import Draggable from "vuedraggable";
import LocationInput from "@/components/LocationInput.vue";

const emit = defineEmits([
  "sorting-locations-list",
  "add-location",
  "delete",
  "loading",
]);

const props = defineProps<{
  locationsList: IWeatherLocationTimestamped[];
  lang: TLanguage;
  units: TUnits;
  apiUrl: string;
  apiKey: string;
}>();

const dragOptions = {
  animation: 200,
  disabled: false,
  ghostClass: "ghost",
};

const listModel = computed<IWeatherLocationTimestamped[]>({
  get: () => [...props.locationsList],
  set: (value) => emit("sorting-locations-list", value),
});

function onAddLocation(location: IWeatherLocationTimestamped) {
  emit("add-location", location);
}
function onClickDelete(index: number) {
  emit("delete", index);
}
function onLoading(e: boolean) {
  emit("loading", e);
}
</script>
