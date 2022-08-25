<template>
  <draggable
    class="dragArea"
    tag="ul"
    :list="todos"
    :group="{ name: 'g1' }"
    item-key="description"
  >
    <template #item="{ element }">
      <li>
        <p>{{ element.description }}</p>
        <nested-draggable :todos="element.todos" />
      </li>
    </template>
  </draggable>
</template>
<script>
import draggable from "vuedraggable";
export default {
  props: {
    todos: {
      required: true,
      type: Array,
    },
  },
  components: {
    draggable,
  },
  name: "nested-draggable",
};
</script>
<style scoped>
.dragArea {
  min-height: 50px;
  outline: 1px dashed;
}
</style>
