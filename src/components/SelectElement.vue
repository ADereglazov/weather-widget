<template>
  <div class="select-element">
    <label :for="id" class="select-element__label">
      {{ title }}
    </label>

    <select
      v-model="selectModel"
      :id="id"
      :name="id"
      :disabled="disabled"
      :style="{
        backgroundImage: `url(${require('@/assets/icons/triangle.svg')})`,
      }"
      class="select-element__select"
      @change="onChange"
    >
      <slot />
    </select>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, onBeforeMount } from "vue";
import { TLanguage, TUpdatePeriod } from "@/types";

type TSelected = TLanguage | TUpdatePeriod;

const emit = defineEmits(["change-select"]);

const props = defineProps<{
  id: string;
  title: string;
  selected: TSelected;
  disabled: boolean;
}>();

onBeforeMount(() => (selectModel = props.selected));

let selectModel: TSelected;

function onChange() {
  emit("change-select", selectModel);
}
</script>
