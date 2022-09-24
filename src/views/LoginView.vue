<template>
  <div class="home">
    <div v-if="isLoggedIn">
      <div>You are logged in.</div>
      <router-link to="/">Home</router-link>
      |
      <router-link to="/">Your Todo List</router-link>
    </div>
    <div v-else>
      <form @submit.prevent="sendLoginRequest(username, password)">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" />
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" />
        <button>submit</button>
      </form>
      <button @click="sendLoginRequest('brandon', 'password')">
        Login as Brandon
      </button>
      <button @click="sendLoginRequest('lotte', 'password')">
        Login as Lotte
      </button>
      <button @click="sendLoginRequest('archer', 'password')">
        Login as Archer
      </button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";

export default {
  props: { isLoggedIn: Boolean },
  name: "LoginView",
  data() {
    return {
      username: null,
      password: null,
    };
  },
  methods: {
    sendLoginRequest(username, password) {
      axios
        .post("/login", {
          username: username,
          password: password,
        })
        .then((response) => {
          console.log(response.data);
          localStorage.setItem("jwt", response.data.accessToken);
          this.username = null;
          this.password = null;
          this.loggedIn = true;
          this.$router.push({ path: "/todos" });
        });
    },
  },
};
</script>
