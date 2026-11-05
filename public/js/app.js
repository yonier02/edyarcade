import { onMounted } from 'vue';
import Navbar from './components/Navbar.js';
import FloatingGameWindow from './components/FloatingGameWindow.js';
import ToastContainer from './components/ToastContainer.js';
import { useGamesStore } from './stores/games.js';
import { useSettingsStore } from './stores/settings.js';

export default {
  name: 'App',
  components: {
    Navbar,
    FloatingGameWindow,
    ToastContainer
  },
  setup() {
    const gamesStore = useGamesStore();
    const settingsStore = useSettingsStore();

    onMounted(async () => {
      settingsStore.initSettings();
      await gamesStore.fetchGames();
    });

    return {};
  },
  template: `
    <div class="app-container">
      <!-- Universal Top Bar Navigation -->
      <Navbar />

      <!-- Main Router Content -->
      <main class="main-content">
        <router-view />
      </main>

      <!-- Persistent Floating Game Window (draggable, resizable sandbox) -->
      <FloatingGameWindow />

      <!-- Toast Feedback System -->
      <ToastContainer />

      <!-- Quiet Editorial Footer -->
      <footer style="background-color: var(--bg-surface); border-top: var(--border-width) solid var(--border-main); padding: 24px; text-align: center; margin-top: auto;">
        <div style="max-width: 1280px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; font-size: 0.88rem; color: var(--text-muted);">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-weight: 900; color: var(--text-main);">Eduarcade</span>
            <span>·</span>
            <span>Aula Arcade & Laboratorio Educativo de Secundaria</span>
          </div>
          <div>
            <span>Vue 3 Composition API · Express Multer · JSON Server</span>
          </div>
        </div>
      </footer>
    </div>
  `
};
