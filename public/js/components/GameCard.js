import { computed } from 'vue';
import { useAuthStore } from '../stores/auth.js';
import { useGamesStore } from '../stores/games.js';
import { useUiStore } from '../stores/ui.js';

export default {
  name: 'GameCard',
  props: {
    game: {
      type: Object,
      required: true
    },
    showAuthorControls: {
      type: Boolean,
      default: false
    }
  },
  emits: ['play', 'edit', 'delete', 'tagClick'],
  setup(props, { emit }) {
    const authStore = useAuthStore();
    const gamesStore = useGamesStore();
    const uiStore = useUiStore();

    const isAuthor = computed(() => {
      return authStore.isAuthenticated && authStore.userId === props.game.authorId;
    });

    const handlePlay = () => {
      gamesStore.recordPlay(props.game.id);
      uiStore.openGame(props.game);
      emit('play', props.game);
    };

    const handleLike = () => {
      gamesStore.toggleLike(props.game.id);
      uiStore.notify(`¡Te ha gustado "${props.game.title}"! ❤️`, 'success');
    };

    const handleTag = (tag) => {
      emit('tagClick', tag);
    };

    const onImageError = (e) => {
      e.target.src = '/uploads/cover-science.svg';
    };

    return {
      isAuthor,
      handlePlay,
      handleLike,
      handleTag,
      onImageError
    };
  },
  template: `
    <article class="sticker-card sticker-card-interactive" style="display: flex; flex-direction: column; overflow: hidden; height: 100%;">
      <!-- Cover Image Slot -->
      <div style="position: relative; height: 170px; background-color: var(--bg-surface-alt); border-bottom: var(--border-width) solid var(--border-main); overflow: hidden;">
        <img 
          :src="game.cover || '/uploads/cover-science.svg'" 
          :alt="game.title" 
          @error="onImageError"
          style="width: 100%; height: 100%; object-fit: cover;"
        />
        
        <!-- Category Badge on Top-Left -->
        <div style="position: absolute; top: 12px; left: 12px;">
          <span class="sticker-badge" style="background-color: var(--accent-yellow); color: #0F172A; font-weight: 800; font-size: 0.75rem;">
            {{ game.category || 'General' }}
          </span>
        </div>

        <!-- Play overlay button -->
        <button 
          @click="handlePlay" 
          style="position: absolute; inset: 0; background: rgba(15, 23, 42, 0.2); opacity: 0; transition: opacity 0.2s; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer;"
          onmouseenter="this.style.opacity = '1'"
          onmouseleave="this.style.opacity = '0'"
          title="Jugar reto"
        >
          <div style="width: 52px; height: 52px; background: var(--accent-orange); border: 2.5px solid #0F172A; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 3px 3px 0px #0F172A; font-size: 1.5rem; color: #FFF;">
            ▶
          </div>
        </button>
      </div>

      <!-- Card Body -->
      <div style="padding: 18px; flex: 1; display: flex; flex-direction: column;">
        
        <!-- Unboxed Metadata: Difficulty and Author -->
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 6px;">
          <span>Por {{ game.authorName || 'Educador anónimo' }}</span>
          <span>·</span>
          <span style="font-weight: 700;">{{ game.difficulty || 'Secundaria' }}</span>
        </div>

        <!-- Title -->
        <h3 style="font-size: 1.15rem; font-weight: 800; line-height: 1.35; margin-bottom: 8px; color: var(--text-main);">
          {{ game.title }}
        </h3>

        <!-- Description -->
        <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.45; margin-bottom: 14px; flex: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
          {{ game.description }}
        </p>

        <!-- Tags -->
        <div v-if="game.tags && game.tags.length > 0" style="display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 16px;">
          <span 
            v-for="tag in game.tags.slice(0, 3)" 
            :key="tag" 
            @click="handleTag(tag)"
            style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); cursor: pointer; text-decoration: underline;"
          >
            #{{ tag }}
          </span>
        </div>

        <!-- Footer Strip: Telemetry & Actions -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1.5px dashed var(--border-main); gap: 10px;">
          <!-- Telemetry -->
          <div style="display: flex; align-items: center; gap: 12px; font-size: 0.82rem; font-family: var(--font-mono); font-weight: 700; color: var(--text-muted);">
            <span title="Veces jugado">🕹️ {{ game.playsCount || 0 }}</span>
            <button 
              @click.stop="handleLike" 
              style="background: none; border: none; cursor: pointer; font-size: 0.82rem; font-family: var(--font-mono); font-weight: 700; color: var(--text-muted); display: inline-flex; align-items: center; gap: 3px;"
              title="Me gusta"
            >
              ❤️ {{ game.likesCount || 0 }}
            </button>
          </div>

          <!-- Actions -->
          <div style="display: flex; align-items: center; gap: 6px;">
            <!-- If author and author controls enabled -->
            <template v-if="isAuthor && showAuthorControls">
              <button 
                @click.stop="$emit('edit', game)" 
                class="sticker-btn btn-neutral" 
                style="padding: 6px 10px; font-size: 0.8rem;" 
                title="Editar juego"
              >
                ✏️
              </button>
              <button 
                @click.stop="$emit('delete', game)" 
                class="sticker-btn btn-danger" 
                style="padding: 6px 10px; font-size: 0.8rem;" 
                title="Eliminar juego"
              >
                🗑️
              </button>
            </template>

            <!-- Main Play Button -->
            <button 
              @click="handlePlay" 
              class="sticker-btn btn-primary" 
              style="padding: 6px 14px; font-size: 0.85rem;"
            >
              ▶ Jugar
            </button>
          </div>

        </div>

      </div>
    </article>
  `
};
