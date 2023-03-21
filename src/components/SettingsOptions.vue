<template>
  <div class="settings-options">
    <SelectLanguage
      :lang="lang"
      :dict="dict"
      :disabled="isLoading"
      class="settings-options__block settings-options__language"
      @change-language="emit('change-language', $event)"
    />
    <hr class="settings-options__hr" />
    <SelectUnits
      :units="units"
      :dict="dict"
      :disabled="isLoading"
      class="settings-options__block settings-options__units"
      @change-units="emit('change-units', $event)"
    />
    <hr class="settings-options__hr" />
    <SelectPressure
      :pressure-unit="pressureUnit"
      :dict="dict"
      :disabled="isLoading"
      class="settings-options__block settings-options__pressure"
      @change-pressure-unit="emit('change-pressure-unit', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from "vue";
import { TLanguage, TUnits, TPressureUnit } from "@/types";
import { IDictionary } from "@/locales/types";
import SelectLanguage from "@/components/SelectLanguage.vue";
import SelectUnits from "@/components/SelectUnits.vue";
import SelectPressure from "@/components/SelectPressure.vue";

const emit = defineEmits([
  "change-language",
  "change-units",
  "change-pressure-unit",
]);

defineProps<{
  lang: TLanguage;
  units: TUnits;
  pressureUnit: TPressureUnit;
  dict: IDictionary;
  isLoading: boolean;
}>();
</script>
