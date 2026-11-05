import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useGamesStore } from '../stores/games.js';
import { useUiStore } from '../stores/ui.js';
import HeroBanner from '../components/HeroBanner.js';
import DailyChallenge from '../components/DailyChallenge.js';
import CategoryGrid from '../components/CategoryGrid.js';
import GameCard from '../components/GameCard.js';
import LeaderboardWidget from '../components/LeaderboardWidget.js';
import LearningTipsCard from '../components/LearningTipsCard.js';

export default {
  name: 'HomeView',
  components: {
    HeroBanner,
    DailyChallenge,
    CategoryGrid,
    GameCard,
    LeaderboardWidget,
    LearningTipsCard
  },
  setup() {
    const router = useRouter();
    const gamesStore = useGamesStore();
    const uiStore = useUiStore();

    const games = computed(() => gamesStore.allGames);
    const topGames = computed(() => {
      return [...games.value].sort((a, b) => (b.playsCount || 0) - (a.playsCount || 0)).slice(0, 5);
    });

    const dailyGame = computed(() => {
      return games.value.find(g => g.id === 'game-2') || games.value[0] || null;
    });

    const totalPlays = computed(() => {
      return games.value.reduce((acc, g) => acc + (g.playsCount || 0), 0);
    });

    const categoriesCount = computed(() => {
      return gamesStore.categories.length;
    });

    const onExplore = () => {
      router.push('/library');
    };

    const onUpload = () => {
      router.push('/upload');
    };

    const onSelectCategory = (cat) => {
      gamesStore.setCategory(cat);
      router.push('/library');
    };

    const playFeatured = (game) => {
      gamesStore.recordPlay(game.id);
      uiStore.openGame(game);
    };

    return {
      games,
      topGames,
      dailyGame,
      totalPlays,
      categoriesCount,
      onExplore,
      onUpload,
      onSelectCategory,
      playFeatured
    };
  },
  template: `
    <div class="home-page">
      
      <!-- Component 1: HeroBanner -->
      <hero-banner 
        :total-games="games.length" 
        :total-plays="totalPlays"
        :categories-count="categoriesCount"
        @explore="onExplore"
        @upload="onUpload"
      />

      <!-- Component 2: DailyChallenge (Reto del Día con Timer) -->
      <daily-challenge 
        :challenge-game="dailyGame"
        @play="playFeatured"
      />

      <!-- Component 3: CategoryGrid (Explorador de Asignaturas) -->
      <category-grid 
        :categories="gamesStore.categories"
        @select-category="onSelectCategory"
      />

      <!-- Main Showcase Grid with Side Column -->
      <div style="display: grid; grid-template-columns: 1fr; gap: 32px; margin-bottom: 40px;">
        
        <!-- Featured Games Grid -->
        <section>
          <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 20px;">
            <div>
              <span class="sticker-badge" style="background-color: var(--accent-yellow); color: #0F172A; margin-bottom: 6px;">
                5 RETOS FUNDAMENTALES
              </span>
              <h2 style="font-size: 1.7rem; font-weight: 900; color: var(--text-main);">
                Videojuegos Clave para Secundaria
              </h2>
            </div>
            <router-link to="/library" class="sticker-btn btn-neutral" style="font-size: 0.85rem;">
              Ver catálogo completo ➔
            </router-link>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 20px; margin-bottom: 36px;">
            <!-- Component 4: GameCard (5 predeterminados) -->
            <game-card 
              v-for="game in topGames" 
              :key="game.id" 
              :game="game"
              @play="playFeatured"
            />
          </div>
        </section>

        <!-- Two-column Widgets Row: Leaderboard + Learning Tips -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-bottom: 36px;">
          <!-- Component 5: LeaderboardWidget -->
          <leaderboard-widget />

          <!-- Component 6: LearningTipsCard -->
          <learning-tips-card />
        </div>

      </div>

    </div>
  `
};
