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
          <span class="completed-box">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              :class="completed(element)"
              @click="setComplete(element)"
            >
              <path class="circle" />
              <path class="check" />
            </svg>
          </span>
          <!-- The text-input-container, invisible items, and text-input classes are needed to disallow text selection from outside of the text area. See https://stackoverflow.com/questions/34354085/clicking-outside-a-contenteditable-div-stills-give-focus-to-it-->
          <span class="text-input-container">
            <span class="invisible">&#8203;</span>
            <div
              class="text-input"
              contenteditable="true"
              @blur="onInput(element)"
              :id="`todo-nested-${element.id}`"
            >
              <!-- <div
                contenteditable="true"
                @blur="onInput(element)"
                :id="`todo-nested-${element.id}`"
              > -->
              {{ element.description }}
              <!-- </div> -->
            </div>
            <span class="invisible">&#8203;</span>
          </span>
          <span class="delete" @click="onDelete(element)"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-x-lg"
              viewBox="0 0 16 16"
            >
              <path
                d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"
              />
            </svg>
          </span>
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
  emits: ["movedItem", "onInput", "onDelete"],
  components: {
    draggable,
  },
  name: "nested-draggable",
  methods: {
    onInput(element) {
      let text = document.getElementById("todo-nested-" + element.id).innerText;
      this.$emit("onInput", element, text);
    },
    completed(todo) {
      switch (todo.completed) {
        case 0:
          // console.log("incomplete");
          return "unchecked";
        case 1:
          // console.log("completed");
          return "checked";
        case 2:
          // console.log("moved to completed section");
          return "checked";
      }
    },
    setComplete(todo) {
      todo.completed = todo.completed == 0 ? 1 : 0;
    },
    onDelete(todo) {
      this.$emit("onDelete", todo);
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
  display: flex;
  align-items: center;
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

div.text-input[contenteditable]:empty::before {
  content: "What do we need to do today?";
  color: grey;
}

/* Formatting for checkbox */
.completed-box {
  cursor: pointer;
  display: flex;
  margin: 5px;
}

.unchecked .circle {
  d: path(
    "M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
  );
}

.unchecked:hover .check {
  d: path(
    "M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"
  );
}

.checked .circle {
  d: path(
    "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"
  );
}

.delete {
  cursor: pointer;
  display: flex;
  margin: 5px;
  margin-left: auto;
  align-self: end;
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
