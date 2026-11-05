import { ref } from 'vue';

export default {
  name: 'LearningTipsCard',
  setup() {
    const tips = [
      {
        icon: '💡',
        title: 'Práctica Espaciada',
        text: 'Jugar partidas cortas de 5 a 10 minutos cada día refuerza la memoria a largo plazo más que estudiar horas continuas.'
      },
      {
        icon: '🔬',
        title: 'Aprender del Error',
        text: 'En el método científico y en los videojuegos, cada fallo es simplemente un dato valioso para ajustar la hipótesis.'
      },
      {
        icon: '⚡',
        title: 'Gamificación Cognitiva',
        text: 'Resolver retos bajo presión de tiempo activa conexiones neuronales asociadas al cálculo mental rápido y la atención focal.'
      }
    ];

    const currentTipIdx = ref(0);
    const nextTip = () => {
      currentTipIdx.value = (currentTipIdx.value + 1) % tips.length;
    };

    return {
      tips,
      currentTipIdx,
      nextTip
    };
  },
  template: `
    <div class="sticker-card" style="padding: 22px; background: var(--bg-surface); border-color: var(--border-main);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span class="sticker-badge" style="background: var(--accent-mint); color: #0F172A; font-size: 0.75rem;">
          PÍLDORA PEDAGÓGICA
        </span>
        <button @click="nextTip" class="sticker-btn btn-neutral" style="padding: 3px 8px; font-size: 0.75rem;" title="Siguiente consejo">
          Siguiente ➔
        </button>
      </div>

      <div style="display: flex; gap: 12px; align-items: flex-start;">
        <div style="font-size: 1.8rem; line-height: 1;">
          {{ tips[currentTipIdx].icon }}
        </div>
        <div>
          <h4 style="font-weight: 900; font-size: 0.98rem; margin-bottom: 4px; color: var(--text-main);">
            {{ tips[currentTipIdx].title }}
          </h4>
          <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.45;">
            {{ tips[currentTipIdx].text }}
          </p>
        </div>
      </div>
    </div>
  `
};
