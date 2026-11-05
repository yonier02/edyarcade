import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth.js';
import { useGamesStore } from '../stores/games.js';
import { useUiStore } from '../stores/ui.js';
import GameCard from './GameCard.js';

export default {
  name: 'GameManager',
  components: {
    GameCard
  },
  setup() {
    const authStore = useAuthStore();
    const gamesStore = useGamesStore();
    const uiStore = useUiStore();

    const currentUserId = computed(() => authStore.userId);
    const currentUser = computed(() => authStore.currentUser);
    const myGames = computed(() => {
      if (!currentUserId.value) return [];
      return gamesStore.gamesByAuthor(currentUserId.value);
    });

    // Edit modal state
    const isEditModalOpen = ref(false);
    const editingGame = ref(null);
    const editForm = ref({
      title: '',
      description: '',
      category: '',
      difficulty: 'Intermedio',
      tagsString: '',
      cover: '',
      code: ''
    });

    const isUploadingCover = ref(false);
    const coverFile = ref(null);

    // Delete confirmation state
    const isDeleteModalOpen = ref(false);
    const deletingGameId = ref(null);
    const deletingGameTitle = ref('');

    const openPlay = (game) => {
      gamesStore.recordPlay(game.id);
      uiStore.openGame(game);
    };

    const startEdit = (game) => {
      if (game.authorId !== currentUserId.value) {
        uiStore.notify('Solo el autor puede editar este juego', 'error');
        return;
      }
      editingGame.value = game;
      editForm.value = {
        title: game.title,
        description: game.description,
        category: game.category,
        difficulty: game.difficulty || 'Intermedio',
        tagsString: Array.isArray(game.tags) ? game.tags.join(', ') : '',
        cover: game.cover || '',
        code: game.code || ''
      };
      isEditModalOpen.value = true;
    };

    const handleCoverUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      isUploadingCover.value = true;
      try {
        const formData = new FormData();
        formData.append('cover', file);
        const res = await fetch('/api/upload-cover', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success && data.url) {
          editForm.value.cover = data.url;
          uiStore.notify('Portada cargada con éxito', 'success');
        } else {
          uiStore.notify('Error al subir la portada', 'error');
        }
      } catch (err) {
        uiStore.notify('Fallo de conexión al subir imagen', 'error');
      } finally {
        isUploadingCover.value = false;
      }
    };

    const saveEdit = async () => {
      if (!editingGame.value) return;
      
      const tags = editForm.value.tagsString
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(t => t.length > 0);

      const updates = {
        title: editForm.value.title.trim(),
        description: editForm.value.description.trim(),
        category: editForm.value.category.trim(),
        difficulty: editForm.value.difficulty,
        tags,
        cover: editForm.value.cover,
        code: editForm.value.code
      };

      const result = await gamesStore.updateGame(editingGame.value.id, updates, currentUserId.value);
      if (result.success) {
        uiStore.notify(`Juego "${updates.title}" actualizado con éxito`, 'success');
        isEditModalOpen.value = false;
        editingGame.value = null;
      } else {
        uiStore.notify(result.error || 'Error al actualizar', 'error');
      }
    };

    const cancelEdit = () => {
      isEditModalOpen.value = false;
      editingGame.value = null;
    };

    const startDelete = (game) => {
      if (game.authorId !== currentUserId.value) {
        uiStore.notify('Solo el autor puede eliminar este juego', 'error');
        return;
      }
      deletingGameId.value = game.id;
      deletingGameTitle.value = game.title;
      isDeleteModalOpen.value = true;
    };

    const confirmDelete = async () => {
      if (!deletingGameId.value) return;
      const res = await gamesStore.deleteGame(deletingGameId.value, currentUserId.value);
      if (res.success) {
        uiStore.notify('Juego eliminado de tu biblioteca', 'info');
      } else {
        uiStore.notify(res.error || 'Error al eliminar', 'error');
      }
      isDeleteModalOpen.value = false;
      deletingGameId.value = null;
    };

    const cancelDelete = () => {
      isDeleteModalOpen.value = false;
      deletingGameId.value = null;
    };

    return {
      currentUserId,
      currentUser,
      myGames,
      isEditModalOpen,
      editForm,
      isUploadingCover,
      isDeleteModalOpen,
      deletingGameTitle,
      openPlay,
      startEdit,
      handleCoverUpload,
      saveEdit,
      cancelEdit,
      startDelete,
      confirmDelete,
      cancelDelete
    };
  },
  template: `
    <div class="game-manager-container">
      
      <!-- User Summary Header -->
      <div class="sticker-card" style="padding: 24px; margin-bottom: 28px; background-color: var(--bg-surface);">
        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <img 
              :src="currentUser?.avatar || '/uploads/avatar-student.svg'" 
              :alt="currentUser?.name"
              style="width: 64px; height: 64px; border-radius: 50%; border: 3px solid var(--border-main); background: #FFF; object-fit: cover;"
            />
            <div>
              <h2 style="font-size: 1.4rem; font-weight: 900; color: var(--text-main);">
                Panel de Creador · {{ currentUser?.name }}
              </h2>
              <p style="color: var(--text-muted); font-size: 0.9rem;">
                Administra tus propios videojuegos educativos. Solo tú tienes permiso de edición y eliminación sobre tus creaciones.
              </p>
            </div>
          </div>

          <router-link to="/upload" class="sticker-btn btn-primary">
            ➕ Crear y Subir Nuevo Reto
          </router-link>
        </div>
      </div>

      <!-- Games list / Grid -->
      <div v-if="myGames.length === 0" class="sticker-card" style="padding: 48px; text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 12px;">🎨</div>
        <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 8px;">Aún no has creado ningún videojuego</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 20px;">
          Combina archivos HTML, CSS y JavaScript para publicar tu primer juego interactivo en la plataforma.
        </p>
        <router-link to="/upload" class="sticker-btn btn-mint">
          ¡Crear mi primer juego!
        </router-link>
      </div>

      <div v-else>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
          <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--text-main);">
            Tus Creaciones Publicadas ({{ myGames.length }})
          </h3>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 20px;">
          <game-card 
            v-for="game in myGames" 
            :key="game.id" 
            :game="game"
            :show-author-controls="true"
            @play="openPlay"
            @edit="startEdit"
            @delete="startDelete"
          />
        </div>
      </div>

      <!-- Edit Game Modal -->
      <div v-if="isEditModalOpen" style="position: fixed; inset: 0; background: rgba(15,23,42,0.6); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; overflow-y: auto;">
        <div class="sticker-card" style="max-width: 680px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 28px; background-color: var(--bg-surface);">
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid var(--border-main); padding-bottom: 12px;">
            <h3 style="font-size: 1.3rem; font-weight: 900;">✏️ Editar Videojuego</h3>
            <button @click="cancelEdit" class="sticker-btn btn-neutral" style="padding: 4px 8px;">✕</button>
          </div>

          <form @submit.prevent="saveEdit" style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <label style="display: block; font-weight: 800; font-size: 0.88rem; margin-bottom: 6px;">Título del Juego</label>
              <input v-model="editForm.title" required class="sticker-input" />
            </div>

            <div>
              <label style="display: block; font-weight: 800; font-size: 0.88rem; margin-bottom: 6px;">Descripción Educativa</label>
              <textarea v-model="editForm.description" rows="3" required class="sticker-input" style="resize: vertical;"></textarea>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label style="display: block; font-weight: 800; font-size: 0.88rem; margin-bottom: 6px;">Materia / Categoría</label>
                <input v-model="editForm.category" required class="sticker-input" />
              </div>
              <div>
                <label style="display: block; font-weight: 800; font-size: 0.88rem; margin-bottom: 6px;">Dificultad</label>
                <select v-model="editForm.difficulty" class="sticker-input">
                  <option value="Básico">Básico</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
              </div>
            </div>

            <div>
              <label style="display: block; font-weight: 800; font-size: 0.88rem; margin-bottom: 6px;">Etiquetas (separadas por comas)</label>
              <input v-model="editForm.tagsString" placeholder="ej: ciencias, química, fórmulas" class="sticker-input" />
            </div>

            <div>
              <label style="display: block; font-weight: 800; font-size: 0.88rem; margin-bottom: 6px;">Portada del Juego</label>
              <div style="display: flex; gap: 12px; align-items: center;">
                <input type="file" @change="handleCoverUpload" accept="image/*" class="sticker-input" style="flex: 1;" />
                <span v-if="isUploadingCover">Subiendo...</span>
              </div>
              <div v-if="editForm.cover" style="margin-top: 8px;">
                <img :src="editForm.cover" alt="Vista previa" style="height: 60px; border-radius: 6px; border: 2px solid var(--border-main);" />
              </div>
            </div>

            <div>
              <label style="display: block; font-weight: 800; font-size: 0.88rem; margin-bottom: 6px;">Código Consolidado (HTML/JS/CSS)</label>
              <textarea v-model="editForm.code" rows="8" required class="sticker-input" style="font-family: var(--font-mono); font-size: 0.85rem; resize: vertical;"></textarea>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; border-top: 2px solid var(--border-main); padding-top: 16px;">
              <button type="button" @click="cancelEdit" class="sticker-btn btn-neutral">Cancelar</button>
              <button type="submit" class="sticker-btn btn-primary">Guardar Cambios</button>
            </div>
          </form>

        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="isDeleteModalOpen" style="position: fixed; inset: 0; background: rgba(15,23,42,0.6); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px;">
        <div class="sticker-card" style="max-width: 440px; width: 100%; padding: 24px; text-align: center; background-color: var(--bg-surface);">
          <div style="font-size: 2.5rem; margin-bottom: 8px;">⚠️</div>
          <h3 style="font-size: 1.2rem; font-weight: 900; margin-bottom: 8px;">¿Eliminar este juego?</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">
            Estás a punto de borrar definitivamente <strong>"{{ deletingGameTitle }}"</strong>. Esta acción no se puede deshacer.
          </p>
          <div style="display: flex; justify-content: center; gap: 12px;">
            <button @click="cancelDelete" class="sticker-btn btn-neutral">Cancelar</button>
            <button @click="confirmDelete" class="sticker-btn btn-danger">Sí, Eliminar</button>
          </div>
        </div>
      </div>

    </div>
  `
};
