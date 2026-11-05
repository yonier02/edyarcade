import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useUiStore } from '../stores/ui.js';

export default {
  name: 'FloatingGameWindow',
  setup() {
    const uiStore = useUiStore();

    const isWindowOpen = computed(() => uiStore.isWindowOpen);
    const isMinimized = computed(() => uiStore.isMinimized);
    const isMaximized = computed(() => uiStore.isMaximized);
    const activeGame = computed(() => uiStore.activeGame);
    const windowPos = computed(() => uiStore.windowPos);
    const windowSize = computed(() => uiStore.windowSize);

    // Dragging state
    const isDragging = ref(false);
    const dragOffset = ref({ x: 0, y: 0 });

    // Resizing state
    const isResizing = ref(false);
    const resizeStart = ref({ x: 0, y: 0, w: 0, h: 0 });

    const iframeRef = ref(null);

    const onHeaderMouseDown = (e) => {
      // Don't drag if clicking buttons
      if (e.target.closest('.win-btn') || isMaximized.value) return;
      isDragging.value = true;
      dragOffset.value = {
        x: e.clientX - windowPos.value.x,
        y: e.clientY - windowPos.value.y
      };
      e.preventDefault();
    };

    const onResizeMouseDown = (e) => {
      if (isMaximized.value) return;
      isResizing.value = true;
      resizeStart.value = {
        x: e.clientX,
        y: e.clientY,
        w: windowSize.value.w,
        h: windowSize.value.h
      };
      e.preventDefault();
      e.stopPropagation();
    };

    const onMouseMove = (e) => {
      if (isDragging.value) {
        const newX = e.clientX - dragOffset.value.x;
        const newY = e.clientY - dragOffset.value.y;
        uiStore.setWindowPos(newX, newY);
      } else if (isResizing.value) {
        const deltaX = e.clientX - resizeStart.value.x;
        const deltaY = e.clientY - resizeStart.value.y;
        uiStore.setWindowSize(resizeStart.value.w + deltaX, resizeStart.value.h + deltaY);
      }
    };

    const onMouseUp = () => {
      isDragging.value = false;
      isResizing.value = false;
    };

    const minimize = () => {
      uiStore.minimizeGame();
    };

    const restore = () => {
      uiStore.restoreGame();
    };

    const toggleMaximize = () => {
      uiStore.toggleMaximize();
    };

    const close = () => {
      uiStore.closeGame();
    };

    const toggleNativeFullscreen = () => {
      const container = document.getElementById('floatingGameContainer');
      if (!container) return;
      if (!document.fullscreenElement) {
        container.requestFullscreen?.().catch(() => {});
      } else {
        document.exitFullscreen?.().catch(() => {});
      }
    };

    onMounted(() => {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });

    onUnmounted(() => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    });

    return {
      isWindowOpen,
      isMinimized,
      isMaximized,
      activeGame,
      windowPos,
      windowSize,
      isDragging,
      isResizing,
      iframeRef,
      onHeaderMouseDown,
      onResizeMouseDown,
      minimize,
      restore,
      toggleMaximize,
      close,
      toggleNativeFullscreen
    };
  },
  template: `
    <div>
      <!-- Floating Window Container (when open and NOT minimized) -->
      <div 
        v-if="isWindowOpen && !isMinimized && activeGame"
        id="floatingGameContainer"
        class="floating-window"
        :class="{ maximized: isMaximized }"
        :style="isMaximized ? {} : {
          left: windowPos.x + 'px',
          top: windowPos.y + 'px',
          width: windowSize.w + 'px',
          height: windowSize.h + 'px'
        }"
      >
        <!-- Window Header Bar (Draggable handle) -->
        <div class="window-header" @mousedown="onHeaderMouseDown">
          <div class="window-title">
            <span style="font-size: 1.1rem;">🕹️</span>
            <span>{{ activeGame.title }}</span>
            <span class="sticker-badge" style="font-size: 0.7rem; padding: 2px 6px; background: #FFF;">
              {{ activeGame.category || 'Reto' }}
            </span>
          </div>

          <!-- Window Controls (Minimize, Maximize, Fullscreen, Close) -->
          <div class="window-controls">
            <!-- Fullscreen -->
            <button 
              @click="toggleNativeFullscreen" 
              class="win-btn" 
              title="Pantalla Completa Nativa"
            >
              ⛶
            </button>

            <!-- Minimize -->
            <button 
              @click="minimize" 
              class="win-btn" 
              title="Minimizar a barra inferior"
            >
              —
            </button>

            <!-- Maximize/Restore -->
            <button 
              @click="toggleMaximize" 
              class="win-btn" 
              :title="isMaximized ? 'Restaurar tamaño' : 'Maximizar ventana'"
            >
              {{ isMaximized ? '🗗' : '🗖' }}
            </button>

            <!-- Close -->
            <button 
              @click="close" 
              class="win-btn close" 
              title="Cerrar juego"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Window Body: Sandboxed Iframe with srcdoc -->
        <div class="window-body">
          <!-- Overlay blocker when dragging/resizing so iframe doesn't capture mouse events -->
          <div 
            v-if="isDragging || isResizing" 
            style="position: absolute; inset: 0; z-index: 100; cursor: move;"
          ></div>

          <iframe 
            ref="iframeRef"
            class="game-iframe"
            sandbox="allow-scripts allow-modals"
            :srcdoc="activeGame.code"
            title="Educational Game Sandbox"
          ></iframe>

          <!-- Resize Handle (bottom-right) -->
          <div 
            v-if="!isMaximized" 
            class="resize-handle" 
            @mousedown="onResizeMouseDown"
            title="Arrastrar para redimensionar"
          ></div>
        </div>
      </div>

      <!-- Minimized Dock Pill (Fixed at bottom right) -->
      <div v-if="isWindowOpen && isMinimized && activeGame" class="minimized-dock">
        <button @click="restore" class="dock-pill">
          <span style="font-size: 1.1rem;">🕹️</span>
          <span style="max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            {{ activeGame.title }}
          </span>
          <span style="background: #FFF; border-radius: 4px; padding: 1px 6px; font-size: 0.75rem; border: 1.5px solid #0F172A;">
            Restaurar ▲
          </span>
          <span @click.stop="close" style="font-weight: 900; margin-left: 4px;" title="Cerrar">✕</span>
        </button>
      </div>
    </div>
  `
};
