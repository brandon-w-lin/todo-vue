<template>
  <draggable
    class="todo-list"
    :list="todos"
    :group="{ name: 'g1' }"
    item-key="description"
    @end="$emit('movedItem')"
    ghostClass="ghost"
    dragClass="drag"
  >
    <template #item="{ element }">
      <div>
        <div class="todo-list-item grabbable">
          <!-- The text-input-container, invisible items, and text-input classes are needed to disallow text selection from outside of the text area. See https://stackoverflow.com/questions/34354085/clicking-outside-a-contenteditable-div-stills-give-focus-to-it-->
          <div class="text-input-container">
            <span class="invisible">&#8203;</span>
            <div class="text-input">
              <div
                contenteditable="true"
                @blur="onInput(element)"
                :id="`todo-nested-${element.id}`"
              >
                {{ element.description }}
              </div>
            </div>
            <span class="invisible">&#8203;</span>
          </div>
        </div>
        <nested-draggable
          class="todo-list-sub-item"
          :todos="element.todos"
          @movedItem="$emit('movedItem')"
        />
      </div>
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
  emits: ["movedItem", "onInput"],
  components: {
    draggable,
  },
  name: "nested-draggable",
  methods: {
    onInput(element) {
      let text = document.getElementById("todo-nested-" + element.id).innerText;
      this.$emit("onInput", element, text);
    },
  },
};
</script>
<style scoped>
/* Pertaining to sortable/draggable */
.drag {
  background-color: white;
}

.ghost {
  opacity: 0.5;
  background-color: grey;
}

.todo-list {
  /*  */
}

.todo-list-item {
  border: solid thin;
  border-color: rgb(183, 183, 183);
  padding: 0.5rem;
  border-radius: 3px;
}

.todo-list-sub-item {
  margin: 0 0 0 1rem; /* adds indentation at each sub-level */
}

/* text-input-container, invisible, and text-input are needed to keep text targeting limited to the text area, prevent selection from outside box */
div.text-input-container {
  -webkit-user-select: none;
}
.invisible {
  visibility: hidden;
}
div.text-input {
  display: inline-block;
  cursor: text;
}

/* Other */
div.text-input:focus-within {
  background-color: cornsilk;
}

.grabbable {
  cursor: move;
  cursor: grab;
}
.grabbable:active {
  cursor: grabbing;
}
</style>
