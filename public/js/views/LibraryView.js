import { computed } from 'vue';
import { useGamesStore } from '../stores/games.js';
import { useUiStore } from '../stores/ui.js';
import SearchBar from '../components/SearchBar.js';
import GameLibrary from '../components/GameLibrary.js';

export default {
  name: 'LibraryView',
  components: {
    SearchBar,
    GameLibrary
  },
  setup() {
    const gamesStore = useGamesStore();
    const uiStore = useUiStore();

    const searchQuery = computed({
      get: () => gamesStore.searchQuery,
      set: (val) => gamesStore.setSearchQuery(val)
    });

    const selectedCategory = computed({
      get: () => gamesStore.selectedCategory,
      set: (val) => gamesStore.setCategory(val)
    });

    const selectedTag = computed({
      get: () => gamesStore.selectedTag,
      set: (val) => gamesStore.setTag(val)
    });

    const categories = computed(() => gamesStore.categories);
    const tags = computed(() => gamesStore.allTags);
    const filteredGames = computed(() => gamesStore.filteredGames);
    const sortBy = computed({
      get: () => gamesStore.sortBy,
      set: (val) => gamesStore.setSortBy(val)
    });

    const onPlay = (game) => {
      gamesStore.recordPlay(game.id);
      uiStore.openGame(game);
    };

    const onTagClick = (tag) => {
      gamesStore.setTag(tag);
    };

    const clearFilters = () => {
      gamesStore.setSearchQuery('');
      gamesStore.setCategory('all');
      gamesStore.setTag(null);
    };

    return {
      searchQuery,
      selectedCategory,
      selectedTag,
      categories,
      tags,
      filteredGames,
      sortBy,
      onPlay,
      onTagClick,
      clearFilters
    };
  },
  template: `
    <div class="library-page">
      <!-- Title Header -->
      <div style="margin-bottom: 24px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 16px;">
        <div>
          <h1 style="font-size: 2rem; font-weight: 900; color: var(--text-main); margin-bottom: 6px;">
            Biblioteca de Retos Educativos
          </h1>
          <p style="color: var(--text-muted); font-size: 0.95rem;">
            Explora y filtra videojuegos por materia curricular, conceptos clave o palabras de búsqueda.
          </p>
        </div>

        <!-- Sorting selector -->
        <div style="display: flex; align-items: center; gap: 8px;">
          <label style="font-weight: 800; font-size: 0.85rem; color: var(--text-muted);">Ordenar por:</label>
          <select v-model="sortBy" class="sticker-input" style="padding: 6px 12px; font-size: 0.85rem; width: auto;">
            <option value="popular">Más jugados 🔥</option>
            <option value="likes">Más votados ❤️</option>
            <option value="newest">Más recientes ✨</option>
            <option value="title">Título (A-Z) 🔤</option>
          </select>
        </div>
      </div>

      <!-- Functional Real-time SearchBar with custom v-model -->
      <search-bar 
        v-model="searchQuery" 
        v-model:selected-category="selectedCategory"
        v-model:selected-tag="selectedTag"
        :categories="categories"
        :tags="tags"
        @clear="clearFilters"
      />

      <!-- Library of Games organized by category one by one -->
      <game-library 
        :games="filteredGames" 
        @play="onPlay" 
        @tag-click="onTagClick" 
      />
    </div>
  `
};
