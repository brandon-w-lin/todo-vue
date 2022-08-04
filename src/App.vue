<template>
  <div class="container">
    <nav>
      <span v-if="isLoggedIn">
        <router-link to="/users/me">My account</router-link>
      </span>
      <span v-else>
        <router-link to="/login">Login</router-link>
        |
        <router-link to="/signup">Signup</router-link>
      </span>
      |
      <router-link to="/todos">My Todo List</router-link>
    </nav>
    <router-view :is-logged-in="isLoggedIn" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false,
    };
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
