<template>
  <div class="home">
    <div v-if="loggedIn">Logged in successfully</div>
    <div v-else>
      <form @submit.prevent="sendLoginRequest(username, password)">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" />
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" />
        <button>submit</button>
      </form>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";

export default {
  name: "LoginView",
  components: {},
  data() {
    return {
      username: null,
      password: null,
      loggedIn: false,
    };
  },
  methods: {
    sendLoginRequest(username, password) {
      axios
        .post("http://localhost:3000/login", {
          username: username,
          password: password,
        })
        .then((response) => {
          console.log(response.data);
          localStorage.setItem("jwt", response.data.accessToken);
          this.username = null;
          this.password = null;
          this.loggedIn = true;
        });
    },
  },
};
</script>
