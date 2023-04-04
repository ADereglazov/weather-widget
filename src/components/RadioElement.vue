<template>
  <div class="radio-element">
    <h3 class="radio-element__title">{{ title }}</h3>
    <div class="radio-element__wrapper">
      <template v-for="item in list" :key="item">
        <input
          :id="item"
          :checked="item === selected"
          :value="item"
          :name="name"
          :disabled="disabled"
          type="radio"
          class="radio-element__input visually-hidden"
          @change="onChange(item)"
        />
        <label :for="item" class="radio-element__label">
          <span class="radio-element__cut-name">{{ label[item] }}</span>
        </label>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from "vue";
import { TUnits, TPressureUnit } from "@/types";
import { TUnitsAll, TPressureUnits } from "@/locales/types";

type TSelected = TUnits | TPressureUnit;
type TLabel = TUnitsAll | TPressureUnits;

const emit = defineEmits(["change-radio"]);

defineProps<{
  title: string;
  list: string[];
  selected: TSelected;
  name: string;
  disabled: boolean;
  label: TLabel;
}>();

function onChange(value: string) {
  emit("change-radio", value);
}
</script>
