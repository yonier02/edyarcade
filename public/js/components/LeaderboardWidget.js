export default {
  name: 'LeaderboardWidget',
  setup() {
    const topRankers = [
      { rank: 1, name: 'Prof. Sofía Navarro', role: 'Docente · Ciencias', score: '3.420 pts', badge: '🥇 Oro', avatar: '/uploads/avatar-teacher.svg' },
      { rank: 2, name: 'Mateo Gómez', role: 'Estudiante · 4º ESO', score: '2.890 pts', badge: '🥈 Plata', avatar: '/uploads/avatar-student.svg' },
      { rank: 3, name: 'Lucía Fernández', role: 'Estudiante · 3º ESO', score: '2.450 pts', badge: '🥉 Bronce', avatar: '/uploads/avatar-student.svg' },
      { rank: 4, name: 'Álvaro Torres', role: 'Estudiante · 2º ESO', score: '1.980 pts', badge: '⭐ Top 5', avatar: '/uploads/avatar-student.svg' },
      { rank: 5, name: 'Elena Ramos', role: 'Docente · Matemáticas', score: '1.740 pts', badge: '⭐ Top 5', avatar: '/uploads/avatar-teacher.svg' }
    ];

    return {
      topRankers
    };
  },
  template: `
    <div class="sticker-card" style="padding: 24px; background-color: var(--bg-surface);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 2px solid var(--border-main); padding-bottom: 10px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 1.3rem;">🏆</span>
          <h3 style="font-size: 1.15rem; font-weight: 900; color: var(--text-main);">
            Cuadro de Honor Académico
          </h3>
        </div>
        <span class="sticker-badge" style="background: var(--accent-yellow); color: #0F172A; font-size: 0.75rem;">
          Esta semana
        </span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        <div 
          v-for="user in topRankers" 
          :key="user.name"
          style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: var(--bg-surface-alt); border: 1.8px solid var(--border-main); border-radius: 8px;"
        >
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="mono-stat" style="font-size: 1rem; width: 20px; text-align: center; color: var(--text-muted);">
              #{{ user.rank }}
            </span>
            <img 
              :src="user.avatar" 
              :alt="user.name"
              style="width: 34px; height: 34px; border-radius: 50%; border: 1.5px solid var(--border-main); background: #FFF;"
            />
            <div>
              <div style="font-weight: 800; font-size: 0.88rem; color: var(--text-main);">
                {{ user.name }}
              </div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">
                {{ user.role }}
              </div>
            </div>
          </div>

          <div style="text-align: right;">
            <div class="mono-stat" style="font-weight: 800; font-size: 0.9rem; color: var(--accent-orange);">
              {{ user.score }}
            </div>
            <span style="font-size: 0.72rem; font-weight: 800; color: var(--text-muted);">
              {{ user.badge }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `
};
