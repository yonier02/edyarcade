import { computed, ref } from 'vue';
import GameCard from './GameCard.js';

export default {
  name: 'GameLibrary',
  components: {
    GameCard
  },
  props: {
    games: {
      type: Array,
      required: true
    }
  },
  emits: ['play', 'tagClick'],
  setup(props, { emit }) {
    const collapsedCategories = ref({});

    const categoryIcons = {
      'Química': '🧪',
      'Matemáticas': '📐',
      'Geografía': '🌍',
      'Lengua y Literatura': '📝',
      'Ciencias Naturales': '🔬',
      'Historia': '🏛️',
      'Tecnología': '💻',
      'Física': '⚛️'
    };

    const groupedGames = computed(() => {
      const groups = {};
      props.games.forEach(game => {
        const cat = game.category || 'Otras materias';
        if (!groups[cat]) {
          groups[cat] = [];
        }
        groups[cat].push(game);
      });
      return Object.entries(groups).map(([category, items]) => ({
        category,
        items,
        icon: categoryIcons[category] || '📚'
      }));
    });

    const toggleCategory = (cat) => {
      collapsedCategories.value[cat] = !collapsedCategories.value[cat];
    };

    const onPlay = (game) => {
      emit('play', game);
    };

    const onTagClick = (tag) => {
      emit('tagClick', tag);
    };

    return {
      groupedGames,
      collapsedCategories,
      toggleCategory,
      onPlay,
      onTagClick
    };
  },
  template: `
    <div class="game-library-section">
      <!-- Empty state -->
      <div v-if="!groupedGames || groupedGames.length === 0" class="sticker-card" style="padding: 48px; text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 12px;">🕹️</div>
        <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 8px;">No se encontraron retos educativos</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem;">Prueba cambiando los términos de búsqueda o limpiando los filtros seleccionados.</p>
      </div>

      <!-- Categories rendered one by one -->
      <div v-else style="display: flex; flex-direction: column; gap: 36px;">
        <section 
          v-for="group in groupedGames" 
          :key="group.category" 
          class="category-group"
        >
          <!-- Category Header Bar -->
          <div 
            style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 12px; margin-bottom: 18px; border-bottom: var(--border-width) solid var(--border-main);"
          >
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.6rem;">{{ group.icon }}</span>
              <h2 style="font-size: 1.45rem; font-weight: 900; color: var(--text-main); letter-spacing: -0.3px;">
                {{ group.category }}
              </h2>
              <span class="sticker-badge" style="background-color: var(--accent-mint); color: #0F172A; font-weight: 800;">
                {{ group.items.length }} {{ group.items.length === 1 ? 'juego' : 'juegos' }}
              </span>
            </div>

            <button 
              @click="toggleCategory(group.category)" 
              class="sticker-btn btn-neutral" 
              style="padding: 4px 10px; font-size: 0.8rem;"
              :title="collapsedCategories[group.category] ? 'Expandir categoría' : 'Plegar categoría'"
            >
              {{ collapsedCategories[group.category] ? 'Mostrar ▼' : 'Plegar ▲' }}
            </button>
          </div>

          <!-- Cards Grid for Category -->
          <div 
            v-show="!collapsedCategories[group.category]" 
            style="display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 20px;"
          >
            <game-card 
              v-for="game in group.items" 
              :key="game.id" 
              :game="game" 
              @play="onPlay"
              @tag-click="onTagClick"
            />
          </div>
        </section>
      </div>
    </div>
  `
};
