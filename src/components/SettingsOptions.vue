<template>
  <div class="settings-options">
    <div class="settings-options__block settings-options__wrapper">
      <SelectElement
        id="language"
        :title="dict.selectLanguage"
        :selected="lang"
        :disabled="isLoading"
        class="settings-options__block settings-options__language"
        @change-select="emit('change-settings', { lang: $event })"
      >
        <option v-for="item in LANGUAGES" :key="item" :value="item">
          {{ dict.languages[item] }}
        </option>
      </SelectElement>

      <SelectElement
        id="update-period"
        :title="dict.updatePeriodTitle"
        :selected="updatePeriod"
        :disabled="isLoading"
        class="settings-options__update-period"
        @change-select="emit('change-settings', { updatePeriod: $event })"
      >
        <option v-for="item in UPDATE_PERIODS" :key="item" :value="item">
          {{ item }}
          {{ pluralize(item, dict.oneHour, dict.twoHours, dict.fiveHours) }}
        </option>
      </SelectElement>
    </div>

    <hr class="settings-options__hr" />

    <RadioElement
      :title="dict.selectUnits"
      :list="UNITS"
      :selected="units"
      :label="dict.units"
      :disabled="isLoading"
      name="units"
      class="settings-options__block settings-options__units"
      @change-radio="emit('change-settings', { units: $event })"
    />

    <hr class="settings-options__hr" />

    <RadioElement
      :title="dict.selectPressure"
      :list="PRESSURE_UNITS"
      :selected="pressureUnit"
      :label="dict.pressureUnits"
      :disabled="isLoading"
      name="pressure-unit"
      class="settings-options__block settings-options__pressure"
      @change-radio="emit('change-settings', { pressureUnit: $event })"
    />
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from "vue";
import { pluralize } from "@/utils";
import {
  TLanguage,
  TUnits,
  TPressureUnit,
  TUpdatePeriod,
  LANGUAGES,
  UPDATE_PERIODS,
  UNITS,
  PRESSURE_UNITS,
} from "@/types";
import { IDictionary } from "@/locales/types";
import SelectElement from "@/components/SelectElement.vue";
import RadioElement from "@/components/RadioElement.vue";

const emit = defineEmits(["change-settings"]);

defineProps<{
  lang: TLanguage;
  updatePeriod: TUpdatePeriod;
  units: TUnits;
  pressureUnit: TPressureUnit;
  dict: IDictionary;
  isLoading: boolean;
}>();
</script>
