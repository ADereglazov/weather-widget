<template>
  <Draggable
    v-model="listModel"
    v-bind="dragOptions"
    item-key="id + lastUpdated"
    handle=".handle"
    tag="ul"
    class="draggable-list"
  >
    <template #item="{ element, index }">
      <li
        :ref="setListItemRef"
        :tabindex="locationsListLength > 1 ? 0 : -1"
        :class="{
          'draggable-list__item--top': index === 0,
          'draggable-list__item--bottom': index === locationsListLength - 1,
        }"
        class="draggable-list__item"
        @keydown.down.prevent="moveItem(true, index)"
        @keydown.up.prevent="moveItem(false, index)"
      >
        <div
          :style="{
            backgroundImage: `url(${require('@/assets/icons/burger.svg')})`,
          }"
          class="draggable-list__item-icon-move handle"
        />
        <span class="draggable-list__item-text">{{
          element.name + ", " + element.sys.country
        }}</span>

        <button
          class="draggable-list__item-delete-button"
          type="button"
          name="delete"
          :aria-label="dict.deleteItem"
          :style="{
            backgroundImage: `url(${require('@/assets/icons/delete.svg')})`,
          }"
          @click="onDelete(index)"
        />
      </li>
    </template>
  </Draggable>
</template>

<script setup lang="ts">
import {
  defineProps,
  defineEmits,
  computed,
  onBeforeUpdate,
  nextTick,
} from "vue";
import Draggable from "vuedraggable";
import { IWeatherLocationTimestamped } from "@/types";
import { IDictionary } from "@/locales/types";

const props = defineProps<{
  locationsList: IWeatherLocationTimestamped[];
  dict: IDictionary;
}>();

const emit = defineEmits(["sorting-locations-list", "delete"]);

const dragOptions = {
  animation: 200,
  disabled: false,
  ghostClass: "ghost",
};

let listItemsRefs: HTMLLIElement[] = [];
const setListItemRef = (el: HTMLLIElement) => {
  if (el) listItemsRefs.push(el);
};

onBeforeUpdate(() => {
  listItemsRefs = [];
});

const listModel = computed<IWeatherLocationTimestamped[]>({
  get: () => [...props.locationsList],
  set: (value) => emit("sorting-locations-list", value),
});
const locationsListLength = computed<number>(() => props.locationsList.length);

function moveItem(isMoveDown: boolean, index: number) {
  const hoverIndex = isMoveDown ? index + 1 : index - 1;
  if (hoverIndex < 0 || hoverIndex >= locationsListLength.value) {
    return;
  }

  const locationListCopy: IWeatherLocationTimestamped[] = JSON.parse(
    JSON.stringify(props.locationsList)
  );
  const draggedItem = locationListCopy[index];

  locationListCopy.splice(index, 1);
  locationListCopy.splice(hoverIndex, 0, draggedItem);

  emit("sorting-locations-list", locationListCopy);
  nextTick(() => listItemsRefs[hoverIndex].focus());
}
function onDelete(index: number) {
  emit("delete", index);
}
</script>
