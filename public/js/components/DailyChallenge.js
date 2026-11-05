import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'DailyChallenge',
  props: {
    challengeGame: {
      type: Object,
      default: null
    }
  },
  emits: ['play'],
  setup(props, { emit }) {
    const timeRemaining = ref('14:28:10');
    let timer = null;

    onMounted(() => {
      timer = setInterval(() => {
        const now = new Date();
        const tomorrow = new Date();
        tomorrow.setHours(24, 0, 0, 0);
        const diff = Math.max(0, tomorrow.getTime() - now.getTime());
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        timeRemaining.value = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
      }, 1000);
    });

    onUnmounted(() => {
      if (timer) clearInterval(timer);
    });

    const onPlay = () => {
      if (props.challengeGame) {
        emit('play', props.challengeGame);
      }
    };

    return {
      timeRemaining,
      onPlay
    };
  },
  template: `
    <div v-if="challengeGame" class="sticker-card" style="padding: 24px; background: linear-gradient(135deg, #FEF3C7 0%, #FFFDF7 100%); margin-bottom: 36px; border-color: var(--border-main);">
      <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 20px;">
        
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="width: 58px; height: 58px; background: var(--accent-orange); border: 2.5px solid var(--border-main); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 2rem; box-shadow: 3px 3px 0px var(--shadow-color);">
            ⚡
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span class="sticker-badge" style="background: var(--accent-orange); color: #FFF; font-weight: 800; font-size: 0.75rem;">
                RETO DEL DÍA
              </span>
              <span class="sticker-badge" style="background: #FFF; color: #0F172A; font-weight: 800; font-size: 0.75rem;">
                🔥 Bonus x2 XP
              </span>
            </div>
            <h3 style="font-size: 1.25rem; font-weight: 900; color: #0F172A; margin-bottom: 2px;">
              {{ challengeGame.title }}
            </h3>
            <p style="font-size: 0.88rem; color: #475569; max-width: 560px;">
              {{ challengeGame.description }}
            </p>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="text-align: right;">
            <div style="font-size: 0.75rem; font-weight: 800; color: #64748B;">EXPIRA EN:</div>
            <div class="mono-stat" style="font-size: 1.15rem; color: #0F172A; font-weight: 900;">
              ⏳ {{ timeRemaining }}
            </div>
          </div>
          <button @click="onPlay" class="sticker-btn btn-primary" style="padding: 10px 20px; font-size: 0.95rem;">
            ▶ Jugar Reto Diario
          </button>
        </div>

      </div>
    </div>
  `
};
