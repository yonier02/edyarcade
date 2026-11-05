export default {
  name: 'CategoryGrid',
  props: {
    categories: {
      type: Array,
      default: () => []
    }
  },
  emits: ['selectCategory'],
  setup(props, { emit }) {
    const defaultSubjects = [
      { name: 'Química', icon: '🧪', desc: 'Fórmulas moleculares, elementos y enlaces', color: '#E0F2FE' },
      { name: 'Matemáticas', icon: '📐', desc: 'Cálculo mental, enteros y álgebra', color: '#FEF3C7' },
      { name: 'Geografía', icon: '🌍', desc: 'Capitales mundiales y mapas geopolíticos', color: '#CCFBF1' },
      { name: 'Lengua y Literatura', icon: '📝', desc: 'Sintaxis, oraciones complejas y gramática', color: '#FCE7F3' },
      { name: 'Ciencias Naturales', icon: '🔬', desc: 'Biología celular, física elemental y cosmos', color: '#E2E8F0' }
    ];

    const getCount = (name) => {
      const found = props.categories.find(c => c.name.toLowerCase() === name.toLowerCase());
      return found ? found.count : 1;
    };

    const choose = (name) => {
      emit('selectCategory', name);
    };

    return {
      defaultSubjects,
      getCount,
      choose
    };
  },
  template: `
    <section class="sticker-card" style="padding: 30px; background-color: var(--bg-surface-alt); margin-bottom: 36px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px;">
        <div>
          <span class="sticker-badge" style="background-color: var(--accent-mint); color: #0F172A; margin-bottom: 6px;">
            MATERIAS DE SECUNDARIA
          </span>
          <h2 style="font-size: 1.5rem; font-weight: 900; color: var(--text-main);">
            Explorador por Asignaturas
          </h2>
        </div>
        <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 700;">
          Haz clic en cualquier materia para filtrar
        </span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 16px;">
        <div 
          v-for="sub in defaultSubjects" 
          :key="sub.name"
          @click="choose(sub.name)"
          class="sticker-card sticker-card-interactive" 
          style="padding: 18px; cursor: pointer; text-align: center; background-color: #FFF; display: flex; flex-direction: column; align-items: center;"
        >
          <div style="width: 52px; height: 52px; border-radius: 12px; border: 2px solid var(--border-main); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 10px;" :style="{ backgroundColor: sub.color }">
            {{ sub.icon }}
          </div>
          <h3 style="font-weight: 800; font-size: 1.05rem; margin-bottom: 4px; color: #0F172A;">
            {{ sub.name }}
          </h3>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px; flex: 1;">
            {{ sub.desc }}
          </p>
          <span class="sticker-badge" style="background-color: var(--bg-surface-alt); font-size: 0.75rem;">
            {{ getCount(sub.name) }} {{ getCount(sub.name) === 1 ? 'reto activo' : 'retos activos' }}
          </span>
        </div>
      </div>
    </section>
  `
};
