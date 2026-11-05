export default {
  name: 'ThemeSoundWidget',
  props: {
    theme: {
      type: String,
      default: 'light'
    },
    language: {
      type: String,
      default: 'es'
    },
    soundEffects: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:theme', 'update:language', 'update:soundEffects'],
  setup(props, { emit }) {
    const playSoundTest = () => {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
      } catch (e) {
        console.warn('AudioContext not supported or allowed', e);
      }
    };

    const setTheme = (t) => {
      emit('update:theme', t);
      if (props.soundEffects) playSoundTest();
    };

    const toggleSound = (e) => {
      emit('update:soundEffects', e.target.checked);
      if (e.target.checked) playSoundTest();
    };

    return {
      playSoundTest,
      setTheme,
      toggleSound
    };
  },
  template: `
    <div class="sticker-card" style="padding: 24px; background: var(--bg-surface); margin-bottom: 24px;">
      <h3 style="font-size: 1.2rem; font-weight: 900; margin-bottom: 16px; border-bottom: 2px solid var(--border-main); padding-bottom: 8px;">
        ⚙️ Controles Rápidos de Interfaz
      </h3>

      <div style="display: flex; flex-direction: column; gap: 18px;">
        <!-- Theme buttons -->
        <div>
          <label style="display: block; font-weight: 800; font-size: 0.88rem; margin-bottom: 8px;">
            Ambiente Visual:
          </label>
          <div style="display: flex; gap: 10px;">
            <button 
              type="button" 
              @click="setTheme('light')" 
              class="sticker-btn"
              :class="theme === 'light' ? 'btn-primary' : 'btn-neutral'"
              style="flex: 1; padding: 10px;"
            >
              ☀️ Claro (Papel Escolar)
            </button>
            <button 
              type="button" 
              @click="setTheme('dark')" 
              class="sticker-btn"
              :class="theme === 'dark' ? 'btn-primary' : 'btn-neutral'"
              style="flex: 1; padding: 10px;"
            >
              🌙 Oscuro (Pizarrón Azul)
            </button>
          </div>
        </div>

        <!-- Sound toggle + test button -->
        <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1.5px dashed var(--border-main); padding-top: 14px;">
          <div>
            <div style="font-weight: 800; font-size: 0.9rem;">Efectos de Audio de Videojuegos</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">
              Sintetizador Web Audio API en aciertos y botones
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <button 
              type="button" 
              @click="playSoundTest" 
              class="sticker-btn btn-neutral" 
              style="padding: 5px 10px; font-size: 0.8rem;"
              title="Probar sonido"
            >
              🔊 Probar
            </button>
            <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-weight: 800; font-size: 0.85rem;">
              <input 
                type="checkbox" 
                :checked="soundEffects" 
                @change="toggleSound" 
                style="width: 18px; height: 18px; accent-color: var(--accent-orange);"
              />
              <span>{{ soundEffects ? 'ON' : 'OFF' }}</span>
            </label>
          </div>
        </div>

      </div>
    </div>
  `
};
