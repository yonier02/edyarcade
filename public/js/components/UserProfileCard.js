export default {
  name: 'UserProfileCard',
  props: {
    user: {
      type: Object,
      default: null
    },
    showSwitcher: {
      type: Boolean,
      default: true
    }
  },
  emits: ['switchUser'],
  template: `
    <div class="sticker-card" style="padding: 24px; background: var(--bg-surface); margin-bottom: 24px;">
      <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px;">
        
        <div style="display: flex; align-items: center; gap: 16px;">
          <img 
            :src="user?.avatar || '/uploads/avatar-student.svg'" 
            :alt="user?.name || 'Usuario'"
            style="width: 72px; height: 72px; border-radius: 50%; border: 3px solid var(--border-main); background: #FFF; object-fit: cover; box-shadow: 2px 2px 0px var(--shadow-color);"
          />
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <h3 style="font-size: 1.35rem; font-weight: 900; color: var(--text-main);">
                {{ user?.name || 'Invitado' }}
              </h3>
              <span class="sticker-badge" :style="{
                background: user?.role === 'profesor' || user?.role === 'profesora' ? 'var(--accent-orange)' : 'var(--accent-mint)',
                color: user?.role === 'profesor' || user?.role === 'profesora' ? '#FFF' : '#0F172A',
                fontSize: '0.75rem'
              }">
                {{ user?.role ? (user.role.toUpperCase()) : 'ESTUDIANTE' }}
              </span>
            </div>
            <div style="font-size: 0.85rem; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 6px;">
              @{{ user?.username || 'invitado' }} · {{ user?.email || 'sin correo' }}
            </div>
            <p style="font-size: 0.88rem; color: var(--text-muted); max-width: 500px;">
              {{ user?.bio || 'Participando en la comunidad académica de Eduarcade.' }}
            </p>
          </div>
        </div>

        <div v-if="showSwitcher" style="display: flex; flex-direction: column; gap: 8px;">
          <div style="font-size: 0.75rem; font-weight: 800; color: var(--text-muted); text-align: right;">
            CAMBIAR ROL DEMO:
          </div>
          <div style="display: flex; gap: 8px;">
            <button 
              type="button" 
              @click="$emit('switchUser', 'sofia')" 
              class="sticker-btn"
              :class="user?.username === 'sofia_ciencias' ? 'btn-primary' : 'btn-neutral'"
              style="padding: 6px 12px; font-size: 0.82rem;"
            >
              👩‍🏫 Prof. Sofía
            </button>
            <button 
              type="button" 
              @click="$emit('switchUser', 'mateo')" 
              class="sticker-btn"
              :class="user?.username === 'mateo_dev' ? 'btn-primary' : 'btn-neutral'"
              style="padding: 6px 12px; font-size: 0.82rem;"
            >
              🎒 Mateo Gómez
            </button>
          </div>
        </div>

      </div>
    </div>
  `
};
