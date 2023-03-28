<template>
  <div class="settings-options">
    <div class="settings-options__block settings-options__wrapper">
      <SelectLanguage
        :lang="lang"
        :dict="dict"
        :disabled="isLoading"
        class="settings-options__block settings-options__language"
        @change-language="emit('change-settings', { lang: $event })"
      />
      <SelectUpdatePeriod
        :updatePeriod="updatePeriod"
        :dict="dict"
        :disabled="isLoading"
        class="settings-options__update-period"
        @change-update-period="
          emit('change-settings', { updatePeriod: $event })
        "
      />
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
import { TLanguage, TUnits, TPressureUnit, TUpdatePeriod } from "@/types";
import { IDictionary } from "@/locales/types";
import SelectLanguage from "@/components/SelectLanguage.vue";
import SelectUnits from "@/components/SelectUnits.vue";
import SelectPressure from "@/components/SelectPressure.vue";
import SelectUpdatePeriod from "@/components/SelectUpdatePeriod.vue";

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
