<template>
  <Navbar @logout="logout()" :is-logged-in="isLoggedIn" />
  <div class="container">
    <router-view :is-logged-in="isLoggedIn" class="mt-5" />
  </div>
</template>

<script>
import router from "./router";
import Navbar from "./components/NavBar.vue";
export default {
  components: {
    Navbar,
  },
  data() {
    return {
      isLoggedIn: false,
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("jwt");
      router.push({ path: "/login" });
    },
  },
  watch: {
    $route() {
      this.isLoggedIn = !!localStorage.jwt;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
