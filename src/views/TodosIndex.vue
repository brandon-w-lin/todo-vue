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
    <div v-for="todo in todos" :key="todo.id" class="todos">
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
    </div>
    <button @click="refreshTodosList">Clear completed entries</button>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";

export default {
  name: "TodosIndex",
  components: {},
  data() {
    return {
      todos: {},
      config: {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      },
      newTodo: null,
    };
  },
  methods: {
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
    // refreshTodosList() {
    //   todos.forEach((todo) => {
    //     if todo.completed === 1
    //   })
    // }
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
.todos {
  text-align: left;
  margin-left: 40%;
}

.description {
  width: 300px;
  display: inline-block;
}
</style>
