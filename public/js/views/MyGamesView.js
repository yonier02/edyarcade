import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';
import { useGamesStore } from '../stores/games.js';
import { useUiStore } from '../stores/ui.js';
import GameManager from '../components/GameManager.js';
import UserProfileCard from '../components/UserProfileCard.js';
import GameStatsSummary from '../components/GameStatsSummary.js';

export default {
  name: 'MyGamesView',
  components: {
    GameManager,
    UserProfileCard,
    GameStatsSummary
  },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const gamesStore = useGamesStore();
    const uiStore = useUiStore();

    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const currentUser = computed(() => authStore.currentUser);

    const myGames = computed(() => {
      if (!authStore.userId) return [];
      return gamesStore.gamesByAuthor(authStore.userId);
    });

    const totalPlaysReceived = computed(() => {
      return myGames.value.reduce((acc, g) => acc + (g.playsCount || 0), 0);
    });

    const totalLikesReceived = computed(() => {
      return myGames.value.reduce((acc, g) => acc + (g.likesCount || 0), 0);
    });

    const creatorTier = computed(() => {
      if (currentUser.value?.role === 'profesor' || currentUser.value?.role === 'profesora') {
        return 'Docente Mentor ⭐';
      }
      return myGames.value.length >= 2 ? 'Estudiante Creador 🚀' : 'Estudiante Promesa 🎒';
    });

    const switchUser = async (userKey) => {
      if (userKey === 'sofia') {
        await authStore.login('sofia@eduarcade.com', 'password123');
        uiStore.notify('Has cambiado a Prof. Sofía Navarro (Docente / Química)', 'success');
      } else if (userKey === 'mateo') {
        await authStore.login('mateo@eduarcade.com', 'password123');
        uiStore.notify('Has cambiado a Mateo Gómez (Estudiante / Matemáticas)', 'success');
      }
    };

    return {
      isAuthenticated,
      currentUser,
      myGames,
      totalPlaysReceived,
      totalLikesReceived,
      creatorTier,
      switchUser
    };
  },
  template: `
    <div class="my-games-page">
      
      <!-- Component 1: UserProfileCard (con conmutador de cuentas demo) -->
      <user-profile-card 
        :user="currentUser" 
        :show-switcher="true"
        @switch-user="switchUser"
      />

      <!-- Component 2: GameStatsSummary (Tarjetas de métricas del creador) -->
      <game-stats-summary 
        v-if="isAuthenticated"
        :total-created="myGames.length"
        :total-plays="totalPlaysReceived"
        :total-likes="totalLikesReceived"
        :creator-tier="creatorTier"
      />

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

      <!-- Component 3: GameManager (Lista con edición, borrado y validación de autor) -->
      <game-manager v-else />

    </div>
  `
};
