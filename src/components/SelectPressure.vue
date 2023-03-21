<template>
  <div class="select-pressure">
    <h3 class="select-pressure__title">{{ dict.selectPressure }}</h3>
    <div class="select-pressure__wrapper">
      <template v-for="item in PRESSURE_UNITS" :key="item">
        <input
          v-model="pressureUnitModel"
          :id="item"
          :checked="item === pressureUnit"
          :value="item"
          :disabled="disabled"
          name="pressure-unit"
          type="radio"
          class="select-pressure__input visually-hidden"
          @change="onChange"
        />
        <label :for="item" class="select-pressure__label">
          <span class="select-pressure__cut-name">
            {{ dict.pressureUnits[item] }}
          </span>
        </label>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, onBeforeMount, ref } from "vue";
import { PRESSURE_UNITS, TPressureUnit } from "@/types";
import { IDictionary } from "@/locales/types";

const emit = defineEmits(["change-pressure-unit"]);

const props = defineProps<{
  pressureUnit: TPressureUnit;
  dict: IDictionary;
  disabled: boolean;
}>();

onBeforeMount(() => (pressureUnitModel.value = props.pressureUnit));

const pressureUnitModel = ref<TPressureUnit>("hPa");

function onChange() {
  emit("change-pressure-unit", pressureUnitModel.value);
}
</script>
