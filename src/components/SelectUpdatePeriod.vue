<template>
  <div class="select-update-period">
    <label for="select-update-period" class="select-update-period__label">
      {{ dict.updatePeriodTitle }}
    </label>

    <select
      v-model="periodModel"
      id="select-update-period"
      name="update-period"
      :disabled="disabled"
      :style="{
        backgroundImage: `url(${require('@/assets/icons/triangle.svg')})`,
      }"
      class="select-update-period__select"
      @change="onChange"
    >
      <option v-for="item in UPDATE_PERIODS" :key="item" :value="item">
        {{ item }}
        {{ pluralize(item, dict.oneHour, dict.twoHours, dict.fiveHours) }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, onBeforeMount, ref } from "vue";
import { pluralize } from "@/utils";
import { TUpdatePeriod, UPDATE_PERIODS } from "@/types";
import { IDictionary } from "@/locales/types";

const emit = defineEmits(["change-update-period"]);

const props = defineProps<{
  updatePeriod: TUpdatePeriod;
  dict: IDictionary;
  disabled: boolean;
}>();

onBeforeMount(() => (periodModel.value = props.updatePeriod));

const periodModel = ref<TUpdatePeriod>(2);

function onChange() {
  emit("change-update-period", periodModel.value);
}
</script>
