import { createRouter, createMemoryHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Home-view.vue"),
  },
  {
    path: "/about",
    name: "about",
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
