export default {
  name: 'HeroBanner',
  props: {
    totalGames: {
      type: Number,
      default: 5
    },
    totalPlays: {
      type: Number,
      default: 0
    },
    categoriesCount: {
      type: Number,
      default: 5
    }
  },
  emits: ['explore', 'upload'],
  template: `
    <section class="sticker-card" style="padding: 36px 32px; margin-bottom: 36px; background-color: var(--bg-surface); position: relative; overflow: hidden;">
      <!-- Decorative academic stickers -->
      <div style="position: absolute; right: -15px; top: -15px; width: 130px; height: 130px; background: var(--accent-yellow); border-radius: 50%; opacity: 0.25; z-index: 0; pointer-events: none;"></div>
      <div style="position: absolute; right: 90px; bottom: -20px; width: 110px; height: 110px; background: var(--accent-mint); border-radius: 16px; opacity: 0.2; transform: rotate(12deg); z-index: 0; pointer-events: none;"></div>

      <div style="position: relative; z-index: 1; max-width: 820px;">
        <div style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 14px;">
          <span class="sticker-badge" style="background-color: var(--accent-orange); color: #FFF; font-size: 0.82rem;">
            🕹️ AULA ARCADE SECUNDARIA
          </span>
          <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted);">
            Desafíos interactivos de 12 a 16 años
          </span>
        </div>

        <h1 style="font-size: clamp(1.9rem, 3.8vw, 2.7rem); font-weight: 900; line-height: 1.22; margin-bottom: 14px; color: var(--text-main); text-wrap: balance;">
          Aprende jugando, crea tus propios minijuegos y domina las ciencias en <span style="color: var(--accent-orange);">Eduarcade</span>.
        </h1>

        <p style="font-size: 1.05rem; color: var(--text-muted); line-height: 1.55; margin-bottom: 24px;">
          Explora retos de química, cálculo veloz, geografía, sintaxis y física con ejecución en ventana flotante sandbox arrastrable y redimensionable.
        </p>

        <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
          <button @click="$emit('explore')" class="sticker-btn btn-primary" style="font-size: 0.95rem; padding: 11px 22px;">
            🔍 Explorar Todos los Retos
          </button>
          <button @click="$emit('upload')" class="sticker-btn btn-mint" style="font-size: 0.95rem; padding: 11px 22px;">
            ➕ Subir Nuevo Videojuego
          </button>
        </div>
      </div>

      <!-- Live Counters Strip -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 14px; margin-top: 32px; padding-top: 20px; border-top: 2px dashed var(--border-main);">
        <div>
          <div class="mono-stat" style="font-size: 1.6rem; color: var(--accent-orange);">{{ totalGames }}</div>
          <div style="font-size: 0.82rem; font-weight: 800; color: var(--text-muted);">Retos Disponibles</div>
        </div>
        <div>
          <div class="mono-stat" style="font-size: 1.6rem; color: var(--accent-mint);">{{ categoriesCount }}</div>
          <div style="font-size: 0.82rem; font-weight: 800; color: var(--text-muted);">Materias Curriculares</div>
        </div>
        <div>
          <div class="mono-stat" style="font-size: 1.6rem; color: var(--text-main);">{{ totalPlays }}+</div>
          <div style="font-size: 0.82rem; font-weight: 800; color: var(--text-muted);">Partidas Jugadas</div>
        </div>
        <div>
          <div class="mono-stat" style="font-size: 1.6rem; color: #8B5CF6;">100%</div>
          <div style="font-size: 0.82rem; font-weight: 800; color: var(--text-muted);">Sandbox Seguro</div>
        </div>
      </div>
    </section>
  `
};
