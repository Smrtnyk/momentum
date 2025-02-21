import { createRouter, createWebHistory } from "vue-router";

import { initializeFirebase } from "../firebase";
import PageAuth from "../pages/PageAuth.vue";
import PageHome from "../pages/PageHome.vue";
import PageProfile from "../pages/PageProfile.vue";
import PageWorkoutDetail from "../pages/PageWorkoutDetail.vue";
import PageWorkoutLogger from "../pages/PageWorkoutLogger.vue";
import { useGlobalStore } from "../stores/global";

const { auth } = initializeFirebase();

const routes = [
    {
        component: PageAuth,
        meta: { guest: true },
        name: "Auth",
        path: "/auth",
    },
    {
        component: PageHome,
        meta: { requiresAuth: true },
        name: "Home",
        path: "/home",
    },
    {
        component: PageWorkoutDetail,
        meta: { requiresAuth: true },
        name: "WorkoutDetail",
        path: "/workout/:id",
    },
    {
        component: PageWorkoutLogger,
        meta: { requiresAuth: true },
        name: "WorkoutLogger",
        path: "/workout/new",
    },
    {
        component: PageWorkoutLogger,
        meta: { requiresAuth: true },
        name: "WorkoutEdit",
        path: "/workout/:id/edit",
    },
    {
        component: PageProfile,
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
});

router.beforeEach(async (to, from, next) => {
    const globalStore = useGlobalStore();
    globalStore.setLoading(true);

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
