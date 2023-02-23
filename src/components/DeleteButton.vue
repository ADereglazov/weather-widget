<template>
  <button
    class="delete-button"
    type="button"
    name="delete"
    aria-label="Delete item"
    :style="{
      backgroundImage: `url(${require('@/assets/icons/delete.svg')})`,
    }"
    @click="onClick"
  />
</template>

<script setup lang="ts">
import { defineEmits } from "vue";

const emit = defineEmits(["delete"]);

function onClick() {
  emit("delete");
}
</script>
