<template>
  <div>
    <div>
      <form @submit="createTodo">
        <input
          type="text"
          placeholder="Enter new todos here..."
          v-model="newTodo"
        />
        <button>submit</button>
      </form>
    </div>
    <br />
    <!-- <ul id="todos">
      <li v-for="todo in todos" :key="todo.id" class="todos">
        <input type="checkbox" :checked="todo.completed === 1 ? true : false" />
        <div
          class="description"
          @click="toggleEdit(todo)"
          @focusout="handleEdit(todo)"
        >
          <span v-if="todo.update">
            <input type="text" v-model="todo.description" />
          </span>
          <span v-else>
            {{ todo.description }}
          </span>
        </div>
        <button @click="todo.update = !todo.update">update</button>
        <button @click="deleteTodo(todo)">delete</button>
      </li>
    </ul> -->
    <DetectInactivity after="3000" @inactive="handleInactivity()" />
    <draggable
      v-model="todos"
      @start="drag = true"
      @end="drag = false"
      item-key="id"
      ghost-class="ghost"
      class="list-group"
    >
      <!-- For some reason, this MUST be called element -->
      <template #item="{ element }">
        <div class="list-group-item">{{ element.description }}</div>
      </template>
    </draggable>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import draggable from "vuedraggable";
import DetectInactivity from "../components/detectInactivity.vue";

export default {
  name: "TodosIndex",
  components: { draggable, DetectInactivity },
  data() {
    return {
      drag: false,
      todos: [], // must be an array to work with Draggable
      oldIndex: "",
      newIndex: "",
      config: {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      },
      newTodo: null,
    };
  },
  methods: {
    handleInactivity() {
      // Check if items have been changed
      // If changed -> sync with server
      console.log("inactive user");
    },
    onEnd(event) {
      console.log(event);
      this.oldIndex = event.oldIndex;
      this.newIndex = event.newIndex;
    },

    toggleEdit(todo) {
      todo.update = true;
    },
    handleEdit(todo) {
      todo.update = false;
      this.updateTodo(todo);
    },
    getTodos() {
      axios.get("http://localhost:3000/todos", this.config).then((response) => {
        this.todos = response.data;
        // this.initSortable();
      });
    },
    updateTodo(todo) {
      axios
        .patch("http://localhost:3000/todos/" + todo.id, todo, this.config)
        .then((response) => {
          console.log(response);
        });
    },
    createTodo() {
      axios
        .post(
          "http://localhost:3000/todos/",
          { description: this.newTodo },
          this.config
        )
        .then((response) => {
          console.log(response);
          this.newTodo = null;
          this.getTodos();
        });
    },
    clearTodos() {
      console.log("clearing todos");
      this.todos.forEach((todo) => {
        if (todo.completed === 1) {
          todo.completed = 2;
        }
      });
    },
    deleteTodo(todo) {
      axios
        .delete("http://localhost:3000/todos/" + todo.id, this.config)
        .then((response) => {
          console.log(response);
          this.getTodos();
        });
    },
  },
  created() {
    this.getTodos();
  },
  watch: {
    todos: function (value) {
      console.log(value);
    },
  },
};
</script>

<style>
.ghost {
  opacity: 0.5;
  background: grey;
}

/* .todo {
  text-align: left;
  outline: solid;
  outline-width: thin;
  padding: 5px;
  margin: 10px;
} */

/* .description {
  width: 300px;
  display: inline-block;
} */

/* input[type="text"] {
  outline: none;
  border: none;
  font-family: inherit;
  font-size: inherit;
} */
</style>
