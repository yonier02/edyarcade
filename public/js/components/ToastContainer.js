import { computed } from 'vue';
import { useUiStore } from '../stores/ui.js';

export default {
  name: 'ToastContainer',
  setup() {
    const uiStore = useUiStore();
    const toasts = computed(() => uiStore.toasts);

    const remove = (id) => {
      uiStore.removeToast(id);
    };

    return {
      toasts,
      remove
    };
  },
  template: `
    <div class="toast-container">
      <div 
        v-for="toast in toasts" 
        :key="toast.id" 
        class="toast-item"
        :class="toast.type"
        @click="remove(toast.id)"
      >
        <span>
          {{ toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️' }}
        </span>
        <span>{{ toast.message }}</span>
      </div>
    </div>
  `
};
