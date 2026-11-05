export default {
  name: 'SearchBar',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    categories: {
      type: Array,
      default: () => []
    },
    selectedCategory: {
      type: String,
      default: 'all'
    },
    tags: {
      type: Array,
      default: () => []
    },
    selectedTag: {
      type: String,
      default: null
    }
  },
  emits: ['update:modelValue', 'update:selectedCategory', 'update:selectedTag', 'clear'],
  setup(props, { emit }) {
    const onInput = (event) => {
      emit('update:modelValue', event.target.value);
    };

    const setCategory = (cat) => {
      emit('update:selectedCategory', cat);
    };

    const toggleTag = (tag) => {
      const next = props.selectedTag === tag ? null : tag;
      emit('update:selectedTag', next);
    };

    const clearAll = () => {
      emit('update:modelValue', '');
      emit('update:selectedCategory', 'all');
      emit('update:selectedTag', null);
      emit('clear');
    };

    return {
      onInput,
      setCategory,
      toggleTag,
      clearAll
    };
  },
  template: `
    <div class="search-bar-container sticker-card" style="padding: 20px; margin-bottom: 24px;">
      <!-- Main Search Input -->
      <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 16px;">
        <div style="position: relative; flex: 1;">
          <input 
            type="text" 
            class="sticker-input" 
            :value="modelValue" 
            @input="onInput" 
            placeholder="🔍 Buscar retos por título, concepto, etiqueta o materia..."
            style="padding-left: 44px; font-size: 1.05rem;"
          />
          <span style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 1.1rem; pointer-events: none;">
            🔎
          </span>
          <button 
            v-if="modelValue" 
            @click="emit('update:modelValue', '')" 
            style="position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 1.1rem; cursor: pointer; color: var(--text-muted);"
            title="Borrar texto"
          >
            ✕
          </button>
        </div>
        <button 
          v-if="modelValue || selectedCategory !== 'all' || selectedTag" 
          @click="clearAll" 
          class="sticker-btn btn-neutral" 
          style="padding: 10px 14px; font-size: 0.85rem;"
          title="Restablecer todos los filtros"
        >
          Limpiar filtros
        </button>
      </div>

      <!-- Categories Segmented Tabs -->
      <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 12px;">
        <span style="font-weight: 800; font-size: 0.85rem; color: var(--text-muted); margin-right: 4px;">Materia:</span>
        <button 
          @click="setCategory('all')" 
          class="sticker-btn" 
          :class="selectedCategory === 'all' ? 'btn-primary' : 'btn-neutral'"
          style="padding: 6px 14px; font-size: 0.85rem;"
        >
          Todas
        </button>
        <button 
          v-for="cat in categories" 
          :key="cat.name" 
          @click="setCategory(cat.name)" 
          class="sticker-btn" 
          :class="selectedCategory.toLowerCase() === cat.name.toLowerCase() ? 'btn-primary' : 'btn-neutral'"
          style="padding: 6px 14px; font-size: 0.85rem;"
        >
          {{ cat.name }} ({{ cat.count }})
        </button>
      </div>

      <!-- Tags Pills Filter -->
      <div v-if="tags && tags.length > 0" style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center; border-top: 1.5px dashed var(--border-main); padding-top: 12px;">
        <span style="font-weight: 700; font-size: 0.8rem; color: var(--text-muted); margin-right: 4px;">Etiquetas:</span>
        <button 
          v-for="tag in tags" 
          :key="tag" 
          @click="toggleTag(tag)" 
          class="sticker-badge" 
          :style="{
            cursor: 'pointer',
            backgroundColor: selectedTag === tag ? 'var(--accent-yellow)' : 'var(--bg-surface-alt)',
            color: '#0F172A',
            borderColor: selectedTag === tag ? 'var(--accent-orange)' : 'var(--border-main)',
            transform: selectedTag === tag ? 'scale(1.05)' : 'none'
          }"
        >
          #{{ tag }}
        </button>
      </div>
    </div>
  `
};
