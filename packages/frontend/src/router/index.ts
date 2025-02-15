import { createRouter, createWebHistory } from "vue-router";

import AuthForm from "../components/AuthForm.vue";
import WorkoutLogger from "../components/WorkoutLogger.vue";
import { auth } from "../firebase";

const routes = [
  {
    component: AuthForm,
    meta: { guest: true },
    name: "Auth",
    path: "/auth",
  },
  {
    component: WorkoutLogger,
    meta: { requiresAuth: true },
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to enforce authentication
router.beforeEach((to, from, next) => {
  const currentUser = auth.currentUser;
  if (to.meta.requiresAuth && !currentUser) {
    next("/auth");
  } else if (to.meta.guest && currentUser) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
