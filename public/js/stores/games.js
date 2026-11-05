import { defineStore } from 'pinia';

const API_BASE = '/api/db';

export const useGamesStore = defineStore('games', {
  state: () => ({
    games: [],
    isLoading: false,
    error: null,
    searchQuery: '',
    selectedCategory: 'all',
    selectedTag: null,
    sortBy: 'popular' // 'popular', 'newest', 'title'
  }),

  getters: {
    allGames: (state) => state.games,
    
    categories: (state) => {
      const counts = {};
      state.games.forEach(g => {
        if (g.category) {
          counts[g.category] = (counts[g.category] || 0) + 1;
        }
      });
      return Object.entries(counts).map(([name, count]) => ({ name, count }));
    },

    allTags: (state) => {
      const tagSet = new Set();
      state.games.forEach(g => {
        if (Array.isArray(g.tags)) {
          g.tags.forEach(t => tagSet.add(t.toLowerCase().trim()));
        }
      });
      return Array.from(tagSet);
    },

    filteredGames: (state) => {
      let result = [...state.games];

      // Filter by category
      if (state.selectedCategory && state.selectedCategory !== 'all') {
        result = result.filter(g => 
          g.category && g.category.toLowerCase() === state.selectedCategory.toLowerCase()
        );
      }

      // Filter by tag
      if (state.selectedTag) {
        result = result.filter(g => 
          Array.isArray(g.tags) && g.tags.some(t => t.toLowerCase() === state.selectedTag.toLowerCase())
        );
      }

      // Filter by search query (title, description, tags, category)
      if (state.searchQuery && state.searchQuery.trim() !== '') {
        const q = state.searchQuery.toLowerCase().trim();
        result = result.filter(g => {
          const inTitle = g.title?.toLowerCase().includes(q);
          const inDesc = g.description?.toLowerCase().includes(q);
          const inCat = g.category?.toLowerCase().includes(q);
          const inAuthor = g.authorName?.toLowerCase().includes(q);
          const inTags = Array.isArray(g.tags) && g.tags.some(t => t.toLowerCase().includes(q));
          return inTitle || inDesc || inCat || inAuthor || inTags;
        });
      }

      // Sort
      if (state.sortBy === 'popular') {
        result.sort((a, b) => (b.playsCount || 0) - (a.playsCount || 0));
      } else if (state.sortBy === 'likes') {
        result.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
      } else if (state.sortBy === 'newest') {
        result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      } else if (state.sortBy === 'title') {
        result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      }

      return result;
    },

    gamesByAuthor: (state) => (authorId) => {
      if (!authorId) return [];
      return state.games.filter(g => g.authorId === authorId);
    },

    gameById: (state) => (id) => {
      return state.games.find(g => g.id === id);
    }
  },

  actions: {
    async fetchGames() {
      this.isLoading = true;
      this.error = null;
      try {
        const res = await fetch(`${API_BASE}/games`);
        if (!res.ok) throw new Error('Error al cargar juegos desde la base de datos');
        const data = await res.json();
        this.games = Array.isArray(data) ? data : [];
      } catch (err) {
        this.error = err.message;
        console.error('Error fetching games:', err);
      } finally {
        this.isLoading = false;
      }
    },

    async createGame(newGame) {
      this.isLoading = true;
      try {
        const gamePayload = {
          ...newGame,
          id: 'game-' + Date.now(),
          playsCount: 0,
          likesCount: 0,
          createdAt: new Date().toISOString()
        };

        const res = await fetch(`${API_BASE}/games`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(gamePayload)
        });

        if (!res.ok) throw new Error('Error al guardar el juego en el servidor');
        const created = await res.json();
        this.games.unshift(created);
        return { success: true, game: created };
      } catch (err) {
        return { success: false, error: err.message };
      } finally {
        this.isLoading = false;
      }
    },

    async updateGame(id, updates, currentUserId) {
      const existing = this.games.find(g => g.id === id);
      if (!existing) return { success: false, error: 'Juego no encontrado' };

      // Check author permission
      if (existing.authorId !== currentUserId) {
        return { success: false, error: 'No tienes permisos para modificar este juego (solo el autor puede editarlo).' };
      }

      this.isLoading = true;
      try {
        const payload = { ...existing, ...updates, updatedAt: new Date().toISOString() };
        const res = await fetch(`${API_BASE}/games/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Error al actualizar el juego en el servidor');
        const updated = await res.json();
        
        const idx = this.games.findIndex(g => g.id === id);
        if (idx !== -1) this.games[idx] = updated;

        return { success: true, game: updated };
      } catch (err) {
        return { success: false, error: err.message };
      } finally {
        this.isLoading = false;
      }
    },

    async deleteGame(id, currentUserId) {
      const existing = this.games.find(g => g.id === id);
      if (!existing) return { success: false, error: 'Juego no encontrado' };

      // Check author permission
      if (existing.authorId !== currentUserId) {
        return { success: false, error: 'No tienes permisos para eliminar este juego (solo el autor puede eliminarlo).' };
      }

      this.isLoading = true;
      try {
        const res = await fetch(`${API_BASE}/games/${id}`, {
          method: 'DELETE'
        });

        if (!res.ok) throw new Error('Error al eliminar el juego');
        this.games = this.games.filter(g => g.id !== id);
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message };
      } finally {
        this.isLoading = false;
      }
    },

    async recordPlay(id) {
      const game = this.games.find(g => g.id === id);
      if (!game) return;
      game.playsCount = (game.playsCount || 0) + 1;
      try {
        await fetch(`${API_BASE}/games/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playsCount: game.playsCount })
        });
      } catch (e) {
        console.warn('Error recording play', e);
      }
    },

    async toggleLike(id) {
      const game = this.games.find(g => g.id === id);
      if (!game) return;
      game.likesCount = (game.likesCount || 0) + 1;
      try {
        await fetch(`${API_BASE}/games/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ likesCount: game.likesCount })
        });
      } catch (e) {
        console.warn('Error saving like', e);
      }
    },

    setSearchQuery(q) {
      this.searchQuery = q;
    },

    setCategory(cat) {
      this.selectedCategory = cat;
    },

    setTag(tag) {
      this.selectedTag = this.selectedTag === tag ? null : tag;
    },

    setSortBy(sort) {
      this.sortBy = sort;
    }
  }
});
