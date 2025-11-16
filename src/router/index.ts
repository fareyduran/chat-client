import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import AuthPage from '@/pages/Auth/AuthPage.vue';
import HomePage from '@/pages/Home/HomePage.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { useUserStore } from '@/stores/user.store';

const routes: RouteRecordRaw[] = [
  { path: '/auth', name: 'auth', component: AuthPage },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: HomePage,
        meta: { requiresAuth: true }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth && !userStore.user) {
    next("/auth");
  } else {
    next();
  }
});

export default router;