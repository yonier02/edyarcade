import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useGamesStore } from '../stores/games.js';
import { useUiStore } from '../stores/ui.js';
import GameCard from '../components/GameCard.js';

export default {
  name: 'HomeView',
  components: {
    GameCard
  },
  setup() {
    const router = useRouter();
    const gamesStore = useGamesStore();
    const uiStore = useUiStore();

    const games = computed(() => gamesStore.allGames);
    const topGames = computed(() => {
      return [...games.value].sort((a, b) => (b.playsCount || 0) - (a.playsCount || 0)).slice(0, 5);
    });

    const totalPlays = computed(() => {
      return games.value.reduce((acc, g) => acc + (g.playsCount || 0), 0);
    });

    const categoriesCount = computed(() => {
      return gamesStore.categories.length;
    });

    const goToCategory = (cat) => {
      gamesStore.setCategory(cat);
      router.push('/library');
    };

    const playFeatured = (game) => {
      gamesStore.recordPlay(game.id);
      uiStore.openGame(game);
    };

    return {
      topGames,
      totalPlays,
      categoriesCount,
      goToCategory,
      playFeatured
    };
  },
  template: `
    <div class="home-page">
      
      <!-- Academic Playground Hero Section -->
      <section class="sticker-card" style="padding: 40px; margin-bottom: 40px; background-color: var(--bg-surface); position: relative; overflow: hidden;">
        <!-- Decorative background shapes -->
        <div style="position: absolute; right: -20px; top: -20px; width: 140px; height: 140px; background: var(--accent-yellow); border-radius: 50%; opacity: 0.3; z-index: 0; pointer-events: none;"></div>
        <div style="position: absolute; right: 80px; bottom: -30px; width: 120px; height: 120px; background: var(--accent-mint); border-radius: 20px; opacity: 0.25; transform: rotate(15deg); z-index: 0; pointer-events: none;"></div>

        <div style="position: relative; z-index: 1; max-width: 780px;">
          <div style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 16px;">
            <span class="sticker-badge" style="background-color: var(--accent-orange); color: #FFF; font-size: 0.85rem;">
              🚀 AULA ARCADE PARA SECUNDARIA
            </span>
            <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted);">
              Retos de 12 a 16 años
            </span>
          </div>

          <h1 style="font-size: clamp(2rem, 4vw, 2.85rem); font-weight: 900; line-height: 1.2; margin-bottom: 16px; color: var(--text-main); text-wrap: balance;">
            Aprende jugando, crea tus propios retos y domina las ciencias en <span style="color: var(--accent-orange);">Eduarcade</span>.
          </h1>

          <p style="font-size: 1.1rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 28px;">
            Plataforma interactiva donde la curiosidad se convierte en juego: explora desafíos de química, agilidad matemática, geografía mundial, sintaxis y física con ejecución instantánea en ventana flotante.
          </p>

          <div style="display: flex; flex-wrap: wrap; gap: 14px; align-items: center;">
            <router-link to="/library" class="sticker-btn btn-primary" style="font-size: 1rem; padding: 12px 24px;">
              🔍 Explorar Retos de Secundaria
            </router-link>
            <router-link to="/upload" class="sticker-btn btn-mint" style="font-size: 1rem; padding: 12px 24px;">
              ➕ Subir Mi Videojuego
            </router-link>
          </div>
        </div>

        <!-- Academic Telemetry Strip -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; margin-top: 36px; padding-top: 24px; border-top: 2px dashed var(--border-main);">
          <div>
            <div class="mono-stat" style="font-size: 1.6rem; color: var(--accent-orange);">5</div>
            <div style="font-size: 0.85rem; font-weight: 800; color: var(--text-muted);">Juegos Predeterminados</div>
          </div>
          <div>
            <div class="mono-stat" style="font-size: 1.6rem; color: var(--accent-mint);">{{ categoriesCount }}</div>
            <div style="font-size: 0.85rem; font-weight: 800; color: var(--text-muted);">Materias Académicas</div>
          </div>
          <div>
            <div class="mono-stat" style="font-size: 1.6rem; color: var(--text-main);">{{ totalPlays }}+</div>
            <div style="font-size: 0.85rem; font-weight: 800; color: var(--text-muted);">Partidas Completadas</div>
          </div>
          <div>
            <div class="mono-stat" style="font-size: 1.6rem; color: #8B5CF6;">100%</div>
            <div style="font-size: 0.85rem; font-weight: 800; color: var(--text-muted);">Sandbox Seguro</div>
          </div>
        </div>
      </section>

      <!-- Featured Secondary School Games -->
      <section style="margin-bottom: 48px;">
        <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 24px;">
          <div>
            <span class="sticker-badge" style="background-color: var(--accent-yellow); color: #0F172A; margin-bottom: 8px;">
              DESTACADOS
            </span>
            <h2 style="font-size: 1.8rem; font-weight: 900; color: var(--text-main);">
              5 Retos Académicos Clave
            </h2>
            <p style="color: var(--text-muted); font-size: 0.95rem;">
              Ejecutables directamente en ventana flotante arrastrable y redimensionable.
            </p>
          </div>
          <router-link to="/library" class="sticker-btn btn-neutral" style="font-size: 0.9rem;">
            Ver todos los juegos ➔
          </router-link>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 20px;">
          <game-card 
            v-for="game in topGames" 
            :key="game.id" 
            :game="game"
            @play="playFeatured"
          />
        </div>
      </section>

      <!-- Subject Categories Section -->
      <section class="sticker-card" style="padding: 32px; background-color: var(--bg-surface-alt); margin-bottom: 48px;">
        <h2 style="font-size: 1.5rem; font-weight: 900; margin-bottom: 8px; color: var(--text-main);">
          Explora por Materias
        </h2>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 24px;">
          Diseñado para reforzar competencias curriculares de secundaria de forma dinámica.
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
          <div 
            @click="goToCategory('Química')"
            class="sticker-card sticker-card-interactive" 
            style="padding: 20px; cursor: pointer; text-align: center; background: #FFF;"
          >
            <div style="font-size: 2.2rem; margin-bottom: 8px;">🧪</div>
            <h3 style="font-weight: 800; font-size: 1.1rem; margin-bottom: 4px;">Química</h3>
            <p style="font-size: 0.8rem; color: var(--text-muted);">Elementos, fórmulas y enlaces</p>
          </div>

          <div 
            @click="goToCategory('Matemáticas')"
            class="sticker-card sticker-card-interactive" 
            style="padding: 20px; cursor: pointer; text-align: center; background: #FFF;"
          >
            <div style="font-size: 2.2rem; margin-bottom: 8px;">📐</div>
            <h3 style="font-weight: 800; font-size: 1.1rem; margin-bottom: 4px;">Matemáticas</h3>
            <p style="font-size: 0.8rem; color: var(--text-muted);">Cálculo mental y enteros</p>
          </div>

          <div 
            @click="goToCategory('Geografía')"
            class="sticker-card sticker-card-interactive" 
            style="padding: 20px; cursor: pointer; text-align: center; background: #FFF;"
          >
            <div style="font-size: 2.2rem; margin-bottom: 8px;">🌍</div>
            <h3 style="font-weight: 800; font-size: 1.1rem; margin-bottom: 4px;">Geografía</h3>
            <p style="font-size: 0.8rem; color: var(--text-muted);">Capitales y geopolítica mundial</p>
          </div>

          <div 
            @click="goToCategory('Lengua y Literatura')"
            class="sticker-card sticker-card-interactive" 
            style="padding: 20px; cursor: pointer; text-align: center; background: #FFF;"
          >
            <div style="font-size: 2.2rem; margin-bottom: 8px;">📝</div>
            <h3 style="font-weight: 800; font-size: 1.1rem; margin-bottom: 4px;">Lengua</h3>
            <p style="font-size: 0.8rem; color: var(--text-muted);">Sintaxis y coherencia discursiva</p>
          </div>

          <div 
            @click="goToCategory('Ciencias Naturales')"
            class="sticker-card sticker-card-interactive" 
            style="padding: 20px; cursor: pointer; text-align: center; background: #FFF;"
          >
            <div style="font-size: 2.2rem; margin-bottom: 8px;">🔬</div>
            <h3 style="font-weight: 800; font-size: 1.1rem; margin-bottom: 4px;">Ciencias</h3>
            <p style="font-size: 0.8rem; color: var(--text-muted);">Biología celular, física y cosmos</p>
          </div>
        </div>
      </section>

      <!-- How it works banner -->
      <section class="sticker-card" style="padding: 32px; background-color: var(--bg-surface); display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 20px;">
        <div style="max-width: 600px;">
          <h2 style="font-size: 1.4rem; font-weight: 900; margin-bottom: 8px;">
            ¿Eres docente o estudiante y programaste tu propio minijuego?
          </h2>
          <p style="color: var(--text-muted); font-size: 0.95rem;">
            Sube tus archivos HTML, CSS y JavaScript o pégalos directamente. Eduarcade los integra en un entorno seguro y los publica para toda la comunidad.
          </p>
        </div>
        <router-link to="/upload" class="sticker-btn btn-primary" style="font-size: 1rem; padding: 12px 22px;">
          Publicar Videojuego Educativo 🚀
        </router-link>
      </section>

    </div>
  `
};
