<template>
  <div class="select-units">
    <h3 class="select-units__title">{{ dict.selectUnits }}</h3>
    <div class="select-units__wrapper">
      <template v-for="item in unitsData" :key="item">
        <input
          v-model="unitsModel"
          :id="item"
          :checked="item === props.units"
          :value="item"
          name="units"
          type="radio"
          class="select-units__input visually-hidden"
          @change="onChange"
        />
        <label :for="item" class="select-units__label">
          <span class="select-units__cut-name">{{ dict.units[item] }}</span>
        </label>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, onBeforeMount, ref } from "vue";
import { TUnits } from "@/types";
import { IDictionary } from "@/locales/types";

const emit = defineEmits(["change-units"]);

const props = defineProps<{
  units: TUnits;
  dict: IDictionary;
}>();

onBeforeMount(() => (unitsModel.value = props.units));

const unitsModel = ref<TUnits>("metric");
const unitsData: TUnits[] = ["standard", "metric", "imperial"];

function onChange() {
  emit("change-units", unitsModel.value);
}
</script>
