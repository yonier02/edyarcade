import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';
import { useSettingsStore } from '../stores/settings.js';

export default {
  name: 'Navbar',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const authStore = useAuthStore();
    const settingsStore = useSettingsStore();

    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const currentUser = computed(() => authStore.currentUser);
    const isDark = computed(() => settingsStore.isDark);

    const toggleTheme = () => {
      settingsStore.toggleTheme();
    };

    const logout = () => {
      authStore.logout();
      router.push('/');
    };

    const isCurrentRoute = (path) => {
      return route.path === path;
    };

    return {
      isAuthenticated,
      currentUser,
      isDark,
      toggleTheme,
      logout,
      isCurrentRoute
    };
  },
  template: `
    <header style="background-color: var(--bg-surface); border-bottom: var(--border-width) solid var(--border-main); position: sticky; top: 0; z-index: 50;">
      <div style="max-width: 1280px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; gap: 24px;">
        
        <!-- Zone 1: Brand Wordmark -->
        <router-link to="/" style="text-decoration: none; display: flex; align-items: center; gap: 10px; shrink-0: 0;">
          <div style="width: 38px; height: 38px; background-color: var(--accent-orange); border: 2.5px solid var(--border-main); border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 2px 2px 0px var(--shadow-color); font-size: 1.25rem;">
            🕹️
          </div>
          <span style="font-size: 1.35rem; font-weight: 900; color: var(--text-main); letter-spacing: -0.5px; white-space: nowrap;">
            Edu<span style="color: var(--accent-orange);">arcade</span>
          </span>
        </router-link>

        <!-- Zone 2: Navigation Links -->
        <nav style="display: flex; align-items: center; gap: 18px; overflow-x: auto; padding: 4px 0;">
          <router-link 
            to="/" 
            class="nav-link"
            :style="{
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '0.95rem',
              whiteSpace: 'nowrap',
              color: isCurrentRoute('/') ? 'var(--accent-orange)' : 'var(--text-main)',
              borderBottom: isCurrentRoute('/') ? '2.5px solid var(--accent-orange)' : '2.5px solid transparent',
              paddingBottom: '2px',
              transition: 'color 0.15s'
            }"
          >
            Inicio
          </router-link>

          <router-link 
            to="/library" 
            class="nav-link"
            :style="{
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '0.95rem',
              whiteSpace: 'nowrap',
              color: isCurrentRoute('/library') ? 'var(--accent-orange)' : 'var(--text-main)',
              borderBottom: isCurrentRoute('/library') ? '2.5px solid var(--accent-orange)' : '2.5px solid transparent',
              paddingBottom: '2px',
              transition: 'color 0.15s'
            }"
          >
            Biblioteca
          </router-link>

          <router-link 
            to="/upload" 
            class="nav-link"
            :style="{
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '0.95rem',
              whiteSpace: 'nowrap',
              color: isCurrentRoute('/upload') ? 'var(--accent-orange)' : 'var(--text-main)',
              borderBottom: isCurrentRoute('/upload') ? '2.5px solid var(--accent-orange)' : '2.5px solid transparent',
              paddingBottom: '2px',
              transition: 'color 0.15s'
            }"
          >
            Subir Juego
          </router-link>

          <router-link 
            to="/my-games" 
            class="nav-link"
            :style="{
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '0.95rem',
              whiteSpace: 'nowrap',
              color: isCurrentRoute('/my-games') ? 'var(--accent-orange)' : 'var(--text-main)',
              borderBottom: isCurrentRoute('/my-games') ? '2.5px solid var(--accent-orange)' : '2.5px solid transparent',
              paddingBottom: '2px',
              transition: 'color 0.15s'
            }"
          >
            Mis Juegos
          </router-link>

          <router-link 
            to="/settings" 
            class="nav-link"
            :style="{
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '0.95rem',
              whiteSpace: 'nowrap',
              color: isCurrentRoute('/settings') ? 'var(--accent-orange)' : 'var(--text-main)',
              borderBottom: isCurrentRoute('/settings') ? '2.5px solid var(--accent-orange)' : '2.5px solid transparent',
              paddingBottom: '2px',
              transition: 'color 0.15s'
            }"
          >
            Configuración
          </router-link>
        </nav>

        <!-- Zone 3: Actions & Auth Profile -->
        <div style="display: flex; align-items: center; gap: 12px; shrink-0: 0;">
          <!-- Theme toggle -->
          <button 
            @click="toggleTheme" 
            class="sticker-btn btn-neutral" 
            style="padding: 7px 11px; font-size: 1rem;" 
            :title="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
          >
            {{ isDark ? '☀️' : '🌙' }}
          </button>

          <!-- Authenticated State -->
          <div v-if="isAuthenticated" style="display: flex; align-items: center; gap: 10px;">
            <router-link to="/settings" style="text-decoration: none; display: flex; align-items: center; gap: 8px;">
              <img 
                :src="currentUser.avatar || '/uploads/avatar-student.svg'" 
                :alt="currentUser.name" 
                style="width: 36px; height: 36px; border-radius: 50%; border: 2px solid var(--border-main); background: #FFF; object-fit: cover;"
              />
              <span style="font-weight: 800; font-size: 0.9rem; color: var(--text-main); display: none; @media (min-width: 900px) { display: inline; }">
                {{ currentUser.username }}
              </span>
            </router-link>
            <button 
              @click="logout" 
              class="sticker-btn btn-neutral" 
              style="padding: 7px 12px; font-size: 0.85rem;"
              title="Cerrar sesión"
            >
              Salir
            </button>
          </div>

          <!-- Unauthenticated State -->
          <router-link 
            v-else 
            to="/login" 
            class="sticker-btn btn-primary" 
            style="padding: 8px 16px; font-size: 0.9rem;"
          >
            Ingresar
          </router-link>

        </div>
      </div>
    </header>
  `
};
