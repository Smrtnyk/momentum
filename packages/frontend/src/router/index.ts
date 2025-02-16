import { createRouter, createWebHistory } from "vue-router";

import { initializeFirebase } from "../firebase";
import PageAuth from "../pages/PageAuth.vue";
import PageDashboard from "../pages/PageDashboard.vue";

const { auth } = initializeFirebase();

const routes = [
    {
        component: PageAuth,
        meta: { guest: true },
        name: "Auth",
        path: "/auth",
    },
    {
        component: PageDashboard,
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
