import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';
import { useUiStore } from '../stores/ui.js';
import GameManager from '../components/GameManager.js';

export default {
  name: 'MyGamesView',
  components: {
    GameManager
  },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const uiStore = useUiStore();

    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const currentUser = computed(() => authStore.currentUser);

    // Switch between default demo users to easily test author permissions
    const switchUser = async (userKey) => {
      if (userKey === 'sofia') {
        await authStore.login('sofia@eduarcade.com', 'password123');
        uiStore.notify('Has cambiado de usuario a Prof. Sofía Navarro (Docente)', 'success');
      } else if (userKey === 'mateo') {
        await authStore.login('mateo@eduarcade.com', 'password123');
        uiStore.notify('Has cambiado de usuario a Mateo Gómez (Estudiante)', 'success');
      }
    };

    return {
      isAuthenticated,
      currentUser,
      switchUser
    };
  },
  template: `
    <div class="my-games-page">
      
      <!-- Top switcher bar for testing multi-user author permissions easily -->
      <div class="sticker-card" style="padding: 14px 20px; margin-bottom: 24px; background: var(--bg-surface-alt); display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 1.1rem;">👥</span>
          <span style="font-weight: 800; font-size: 0.88rem;">Verificación de Permisos Multi-Usuario:</span>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <button 
            @click="switchUser('sofia')" 
            class="sticker-btn"
            :class="currentUser?.username === 'sofia_ciencias' ? 'btn-primary' : 'btn-neutral'"
            style="padding: 6px 12px; font-size: 0.82rem;"
          >
            Probar como Prof. Sofía
          </button>
          <button 
            @click="switchUser('mateo')" 
            class="sticker-btn"
            :class="currentUser?.username === 'mateo_dev' ? 'btn-primary' : 'btn-neutral'"
            style="padding: 6px 12px; font-size: 0.82rem;"
          >
            Probar como Mateo Gómez
          </button>
        </div>
      </div>

      <!-- If not authenticated -->
      <div v-if="!isAuthenticated" class="sticker-card" style="padding: 48px; text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 12px;">🔒</div>
        <h2 style="font-size: 1.5rem; font-weight: 900; margin-bottom: 8px;">Área Privada de Creador</h2>
        <p style="color: var(--text-muted); font-size: 1rem; margin-bottom: 24px;">
          Inicia sesión para gestionar, editar y eliminar tus propios videojuegos educativos.
        </p>
        <router-link to="/login" class="sticker-btn btn-primary" style="padding: 12px 24px;">
          Iniciar Sesión o Registrarse
        </router-link>
      </div>

      <!-- Embedded GameManager Component -->
      <game-manager v-else />

    </div>
  `
};
