import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from './views/HomeView.js';
import LibraryView from './views/LibraryView.js';
import UploadView from './views/UploadView.js';
import MyGamesView from './views/MyGamesView.js';
import SettingsView from './views/SettingsView.js';
import AuthView from './views/AuthView.js';
import { useAuthStore } from './stores/auth.js';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/library', name: 'library', component: LibraryView },
  { 
    path: '/upload', 
    name: 'upload', 
    component: UploadView,
    meta: { requiresAuth: false } // can view & test, asks to login to save
  },
  { 
    path: '/my-games', 
    name: 'my-games', 
    component: MyGamesView,
    meta: { requiresAuth: true }
  },
  { path: '/settings', name: 'settings', component: SettingsView },
  { path: '/login', name: 'login', component: AuthView }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});
