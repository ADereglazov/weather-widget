<template>
  <button
    class="delete-button"
    type="button"
    name="delete"
    aria-label="Delete item"
    @click="onClick"
  >
    <DeleteIcon class="delete-button__icon" />
  </button>
</template>

<script setup lang="ts">
import { defineEmits } from "vue";
import DeleteIcon from "@/components/icons/DeleteIcon.vue";

const emit = defineEmits(["delete"]);
function onClick() {
  emit("delete");
}
</script>
