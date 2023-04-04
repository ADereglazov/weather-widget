<template>
  <div class="select-element">
    <label :for="id" class="select-element__label">
      {{ title }}
    </label>

    <select
      v-model="selectModel"
      :id="id"
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
import { defineEmits, defineProps, onBeforeMount, ref } from "vue";
import { TLanguage, TUpdatePeriod } from "@/types";

const emit = defineEmits(["change-select"]);

const props = defineProps<{
  id: string;
  title: string;
  defaultValue: TLanguage | TUpdatePeriod;
  disabled: boolean;
}>();

onBeforeMount(() => (selectModel.value = props.defaultValue));

const selectModel = ref();

function onChange() {
  emit("change-select", selectModel.value);
}
</script>
