<template>
  <div class="settings-options">
    <SelectUnits
      :units="units"
      :dict="dict"
      class="settings-options__block settings-options__units"
      @change-units="emit('change-units', $event)"
    />

    <SelectLanguage
      :lang="lang"
      :dict="dict"
      class="settings-options__block settings-options__language"
      @change-language="emit('change-language', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from "vue";
import { TLanguage, TUnits } from "@/types";
import { IDictionary } from "@/locales/types";
import SelectLanguage from "@/components/SelectLanguage.vue";
import SelectUnits from "@/components/SelectUnits.vue";

const emit = defineEmits(["change-language", "change-units"]);

defineProps<{
  lang: TLanguage;
  units: TUnits;
  dict: IDictionary;
}>();
</script>
