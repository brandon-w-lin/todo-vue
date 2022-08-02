import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import TodosIndex from "../views/TodosIndex.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/todos",
    name: "todos-index",
    component: TodosIndex,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
