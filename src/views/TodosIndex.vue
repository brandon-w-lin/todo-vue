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
    <DetectInactivity after="3000" @inactive="handleInactivity()" />
    <draggable
      v-model="todos"
      @start="onDragStart()"
      @end="onDragEnd()"
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
      needToSyncWithServer: false,
    };
  },
  methods: {
    handleInactivity() {
      console.log("User is inactive. Running inactivity handler");
      if (this.needToSyncWithServer) {
        this.needToSyncWithServer = false;
        this.syncOrder();
      }
    },
    syncOrder() {
      console.log("Client is out of sync with server, running sync service");
      const orderForm = this.createOrderForm();
      console.log(orderForm);
      axios
        .patch("http://localhost:3000/todos/batch", orderForm, this.config)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    createOrderForm() {
      // First get IDs in the array
      const possible_ids = this.todos.map((todo) => todo.id);

      // Sort them
      possible_ids.sort();

      // create batch order and return
      const orderForm = this.todos.map((todo) => ({
        id: todo.id,
        order: possible_ids.shift(),
      }));
      return orderForm;
    },

    // RELATING TO DRAGGABLE
    onDragStart() {
      // this.needToSyncWithServer = true;
    },
    onDragEnd() {
      this.needToSyncWithServer = true;
    },

    toggleEdit(todo) {
      todo.update = true;
    },
    handleEdit(todo) {
      todo.update = false;
      this.updateTodo(todo);
    },

    // REST ACTIONS
    getTodos() {
      axios.get("http://localhost:3000/todos", this.config).then((response) => {
        this.todos = response.data;
        this.todos.sort((a, b) => a.order - b.order);
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
    updateTodo(todo) {
      axios
        .patch("http://localhost:3000/todos/" + todo.id, todo, this.config)
        .then((response) => {
          console.log(response);
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
