import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
  state: () => {
    let savedTheme = 'light';
    let savedLang = 'es';
    let savedSound = true;
    try {
      savedTheme = localStorage.getItem('eduarcade_theme') || 'light';
      savedLang = localStorage.getItem('eduarcade_lang') || 'es';
      savedSound = localStorage.getItem('eduarcade_sound') !== 'false';
    } catch (e) {
      console.warn('Error reading settings', e);
    }

    return {
      theme: savedTheme,
      language: savedLang,
      soundEffects: savedSound
    };
  },

  getters: {
    isDark: (state) => state.theme === 'dark'
  },

  actions: {
    initSettings() {
      this.applyTheme(this.theme);
    },

    toggleTheme() {
      const next = this.theme === 'light' ? 'dark' : 'light';
      this.setTheme(next);
    },

    setTheme(theme) {
      this.theme = theme;
      try {
        localStorage.setItem('eduarcade_theme', theme);
      } catch (e) {}
      this.applyTheme(theme);
    },

    applyTheme(theme) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },

    setLanguage(lang) {
      this.language = lang;
      try {
        localStorage.setItem('eduarcade_lang', lang);
      } catch (e) {}
    },

    setSoundEffects(enabled) {
      this.soundEffects = enabled;
      try {
        localStorage.setItem('eduarcade_sound', String(enabled));
      } catch (e) {}
    }
  }
});
