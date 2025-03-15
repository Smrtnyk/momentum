import type { RouteLocationNormalized } from "vue-router";

import { createRouter, createWebHistory } from "vue-router";

import { auth } from "../firebase";
import { logger } from "../logger/app-logger";
import { clearAppState, loadAppState, saveAppState } from "../services/state-persistence";
import { useAuthStore } from "../stores/auth";
import { useGlobalStore } from "../stores/global";

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
        component: () => import("../pages/PageWorkoutPlans.vue"),
        meta: { requiresAuth: true },
        name: "WorkoutPlans",
        path: "/workout-plans",
    },
    {
        component: () => import("../pages/PageWorkoutLogs.vue"),
        meta: { requiresAuth: true },
        name: "WorkoutLogs",
        path: "/workouts",
    },
    {
        component: () => import("../pages/PageProfile.vue"),
        meta: { requiresAuth: true },
        name: "Profile",
        path: "/profile",
    },
    {
        component: () => import("../pages/PageCalories.vue"),
        meta: { requiresAuth: true },
        name: "Calories",
        path: "/calories",
    },
    {
        component: () => import("../pages/PageCustomFood.vue"),
        meta: {
            requiresAuth: true,
        },
        name: "CustomFood",
        path: "/custom-food",
    },
    {
        component: () => import("../pages/PageRecentFood.vue"),
        meta: {
            requiresAuth: true,
        },
        name: "RecentFood",
        path: "/recent-food",
    },
    {
        path: "/",
        redirect: "/home",
    },
    {
        component: () => import("../pages/PageRecipes.vue"),
        meta: { requiresAuth: true },
        name: "Recipes",
        path: "/recipes",
    },
    {
        component: () => import("../pages/PageRecipe.vue"),
        meta: { requiresAuth: true },
        name: "RecipeDetail",
        path: "/recipes/:id",
    },
    {
        component: () => import("../pages/PageAnalytics.vue"),
        meta: { requiresAuth: true },
        name: "Analytics",
        path: "/analytics",
    },
    {
        component: () => import("../pages/PageCustomWorkout.vue"),
        meta: {
            requiresAuth: true,
        },
        name: "CustomWorkout",
        path: "/custom-workout/:id?",
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
        if (savedPosition) {
            return savedPosition;
        }

        // For new navigation after app updates, try to use our persisted position
        const savedState = loadAppState();
        if (savedState?.scrollPosition && savedState?.route?.path === to.path) {
            const position = {
                left: savedState.scrollPosition.x,
                top: savedState.scrollPosition.y,
            };
            clearAppState();
            return position;
        }

        // For regular navigation between routes, always scroll to top
        return { left: 0, top: 0 };
    },
});

let isInitialLoad = true;

router.beforeEach(async (to, from, next) => {
    const globalStore = useGlobalStore();
    const authStore = useAuthStore();
    globalStore.setLoading(true);

    if (!authStore.isReady) {
        await authStore.waitForAuthReady();
    }

    // On initial app load, check for saved route from a previous session
    // to recover state after an app update
    if (isInitialLoad && to.path === "/home" && auth.currentUser) {
        isInitialLoad = false;
        const savedState = loadAppState();

        if (
            savedState?.route &&
            savedState.route.path !== "/" &&
            savedState.route.path !== "/home"
        ) {
            logger.info("Restoring saved route:", savedState.route.path);
            clearAppState();

            return next({
                path: savedState.route.path,
                query: savedState.route.query,
                replace: true,
            });
        }
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

router.afterEach((to: RouteLocationNormalized) => {
    const globalStore = useGlobalStore();
    globalStore.setLoading(false);

    if (isInitialLoad || to.name === "Auth") {
        return;
    }

    saveAppState({
        route: {
            params: { ...to.params },
            path: to.path,
            query: { ...to.query },
        },
    });
});

router.onError((error) => {
    logger.error("Router error:", error);

    if (
        error.message.includes("Failed to fetch dynamically imported module") ||
        error.message.includes("Loading chunk") ||
        error.message.includes("ChunkLoadError")
    ) {
        const globalStore = useGlobalStore();
        globalStore.notifyError("Reloading page to fetch new version.");
        setTimeout(function () {
            globalThis.location.reload();
        }, 1000);
    }
});

export default router;
