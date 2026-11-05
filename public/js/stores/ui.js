import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  state: () => ({
    activeGame: null,
    isWindowOpen: false,
    isMinimized: false,
    isMaximized: false,
    windowPos: { x: Math.max(20, Math.floor((window.innerWidth - 760) / 2)), y: 60 },
    windowSize: { w: 760, h: 560 },
    zIndex: 1000,
    toasts: []
  }),

  actions: {
    openGame(game) {
      this.activeGame = game;
      this.isWindowOpen = true;
      this.isMinimized = false;
      this.zIndex++;
      
      // Auto center if window offscreen
      if (this.windowPos.x > window.innerWidth - 200 || this.windowPos.y > window.innerHeight - 200) {
        this.windowPos = {
          x: Math.max(20, Math.floor((window.innerWidth - this.windowSize.w) / 2)),
          y: Math.max(20, Math.floor((window.innerHeight - this.windowSize.h) / 2))
        };
      }
    },

    closeGame() {
      this.isWindowOpen = false;
      this.isMinimized = false;
      this.activeGame = null;
    },

    minimizeGame() {
      this.isMinimized = true;
    },

    restoreGame() {
      this.isMinimized = false;
      this.isWindowOpen = true;
      this.zIndex++;
    },

    toggleMaximize() {
      this.isMaximized = !this.isMaximized;
    },

    setWindowPos(x, y) {
      // Clamp to viewport
      const clampedX = Math.max(10, Math.min(x, window.innerWidth - 100));
      const clampedY = Math.max(10, Math.min(y, window.innerHeight - 80));
      this.windowPos = { x: clampedX, y: clampedY };
    },

    setWindowSize(w, h) {
      const clampedW = Math.max(380, Math.min(w, window.innerWidth - 20));
      const clampedH = Math.max(320, Math.min(h, window.innerHeight - 40));
      this.windowSize = { w: clampedW, h: clampedH };
    },

    notify(message, type = 'info') {
      const id = Date.now() + Math.random().toString(36).substring(2, 7);
      this.toasts.push({ id, message, type });
      setTimeout(() => {
        this.removeToast(id);
      }, 3500);
    },

    removeToast(id) {
      this.toasts = this.toasts.filter(t => t.id !== id);
    }
  }
});
