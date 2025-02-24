import { createRouter, createWebHistory } from "vue-router";

import { initializeFirebase } from "../firebase";
import { useAuthStore } from "../stores/auth";
import { useGlobalStore } from "../stores/global";

const { auth } = initializeFirebase();

const routes = [
    {
        component: () => import("../pages/PageAuth.vue"),
        meta: { guest: true },
        name: "Auth",
        path: "/auth",
    },
    {
        component: () => import("../pages/PageHome.vue"),
        meta: { requiresAuth: true },
        name: "Home",
        path: "/home",
    },
    {
        component: () => import("../pages/PageWorkoutDetail.vue"),
        meta: { requiresAuth: true },
        name: "WorkoutDetail",
        path: "/workout/:id",
    },
    {
        component: () => import("../pages/PageWorkoutLogger.vue"),
        meta: { requiresAuth: true },
        name: "WorkoutLogger",
        path: "/workout/new",
    },
    {
        component: () => import("../pages/PageWorkoutLogs.vue"),
        meta: { requiresAuth: true },
        name: "WorkoutLogs",
        path: "/workouts",
    },
    {
        component: () => import("../pages/PageWorkoutLogger.vue"),
        meta: { requiresAuth: true },
        name: "WorkoutEdit",
        path: "/workout/:id/edit",
    },
    {
        component: () => import("../pages/PageProfile.vue"),
        meta: { requiresAuth: true },
        name: "Profile",
        path: "/profile",
    },
    {
        path: "/",
        redirect: "/home",
    },
    {
        path: "/:catchAll(.*)",
        redirect: "/",
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return savedPosition ?? { top: 0 };
    },
});

router.beforeEach(async (to, from, next) => {
    const globalStore = useGlobalStore();
    const authStore = useAuthStore();
    globalStore.setLoading(true);

    if (!authStore.isReady) {
        await authStore.waitForAuthReady();
    }

    const currentUser = auth.currentUser;
    if (to.meta.requiresAuth && !currentUser) {
        next("/auth");
    } else if (to.meta.guest && currentUser) {
        next("/home");
    } else {
        next();
    }
});

router.afterEach(() => {
    const globalStore = useGlobalStore();
    globalStore.setLoading(false);
});

export default router;
