<template>
  <div class="settings-options">
    <div class="settings-options__block settings-options__wrapper">
      <SelectElement
        id="language"
        :title="dict.selectLanguage"
        :default-value="lang"
        :disabled="isLoading"
        class="settings-options__block settings-options__language"
        @change-select="emit('change-settings', { lang: $event })"
      >
        <option v-for="item in LANGUAGES" :key="item" :value="item">
          {{ dict.languages[item] }}
        </option>
      </SelectElement>

      <SelectElement
        id="updatePeriod"
        :title="dict.updatePeriodTitle"
        :default-value="updatePeriod"
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

    <SelectUnits
      :units="units"
      :dict="dict"
      :disabled="isLoading"
      class="settings-options__block settings-options__units"
      @change-units="emit('change-settings', { units: $event })"
    />

    <hr class="settings-options__hr" />

    <SelectPressure
      :pressure-unit="pressureUnit"
      :dict="dict"
      :disabled="isLoading"
      class="settings-options__block settings-options__pressure"
      @change-pressure-unit="emit('change-settings', { pressureUnit: $event })"
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
} from "@/types";
import { IDictionary } from "@/locales/types";
import SelectUnits from "@/components/SelectUnits.vue";
import SelectPressure from "@/components/SelectPressure.vue";
import SelectElement from "@/components/SelectElement.vue";

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
