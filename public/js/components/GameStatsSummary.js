export default {
  name: 'GameStatsSummary',
  props: {
    totalCreated: {
      type: Number,
      default: 0
    },
    totalPlays: {
      type: Number,
      default: 0
    },
    totalLikes: {
      type: Number,
      default: 0
    },
    creatorTier: {
      type: String,
      default: 'Creador Junior'
    }
  },
  template: `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; margin-bottom: 24px;">
      <div class="sticker-card" style="padding: 18px; background: var(--bg-surface);">
        <div style="font-size: 0.8rem; font-weight: 800; color: var(--text-muted); margin-bottom: 4px;">
          RETOS CREADOS
        </div>
        <div class="mono-stat" style="font-size: 1.8rem; color: var(--accent-orange);">
          {{ totalCreated }}
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
          en la biblioteca
        </div>
      </div>

      <div class="sticker-card" style="padding: 18px; background: var(--bg-surface);">
        <div style="font-size: 0.8rem; font-weight: 800; color: var(--text-muted); margin-bottom: 4px;">
          PARTIDAS TOTALES
        </div>
        <div class="mono-stat" style="font-size: 1.8rem; color: var(--accent-mint);">
          {{ totalPlays }}
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
          por otros estudiantes
        </div>
      </div>

      <div class="sticker-card" style="padding: 18px; background: var(--bg-surface);">
        <div style="font-size: 0.8rem; font-weight: 800; color: var(--text-muted); margin-bottom: 4px;">
          VALORACIONES
        </div>
        <div class="mono-stat" style="font-size: 1.8rem; color: #EF4444;">
          ❤️ {{ totalLikes }}
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
          me gusta recibidos
        </div>
      </div>

      <div class="sticker-card" style="padding: 18px; background: var(--bg-surface);">
        <div style="font-size: 0.8rem; font-weight: 800; color: var(--text-muted); margin-bottom: 4px;">
          RANGO DOCENTE
        </div>
        <div style="font-size: 1.15rem; font-weight: 900; color: var(--text-main); margin-top: 4px;">
          {{ creatorTier }}
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
          Basado en contribuciones
        </div>
      </div>
    </div>
  `
};
