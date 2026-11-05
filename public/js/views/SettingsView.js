import { ref, computed, watch } from 'vue';
import { useAuthStore } from '../stores/auth.js';
import { useSettingsStore } from '../stores/settings.js';
import { useUiStore } from '../stores/ui.js';

export default {
  name: 'SettingsView',
  setup() {
    const authStore = useAuthStore();
    const settingsStore = useSettingsStore();
    const uiStore = useUiStore();

    const currentUser = computed(() => authStore.currentUser);
    const isAuthenticated = computed(() => authStore.isAuthenticated);

    // Profile form
    const name = ref(currentUser.value?.name || '');
    const username = ref(currentUser.value?.username || '');
    const bio = ref(currentUser.value?.bio || '');
    const avatar = ref(currentUser.value?.avatar || '/uploads/avatar-student.svg');
    const isUploadingAvatar = ref(false);

    watch(currentUser, (u) => {
      if (u) {
        name.value = u.name || '';
        username.value = u.username || '';
        bio.value = u.bio || '';
        avatar.value = u.avatar || '/uploads/avatar-student.svg';
      }
    });

    // Theme & Preferences
    const currentTheme = computed({
      get: () => settingsStore.theme,
      set: (val) => settingsStore.setTheme(val)
    });

    const currentLang = computed({
      get: () => settingsStore.language,
      set: (val) => settingsStore.setLanguage(val)
    });

    const soundEffects = computed({
      get: () => settingsStore.soundEffects,
      set: (val) => settingsStore.setSoundEffects(val)
    });

    const handleAvatarUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      isUploadingAvatar.value = true;
      try {
        const formData = new FormData();
        formData.append('avatar', file);
        const res = await fetch('/api/upload-avatar', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success && data.url) {
          avatar.value = data.url;
          uiStore.notify('Nuevo avatar cargado con éxito', 'success');
        } else {
          uiStore.notify('Error al subir avatar', 'error');
        }
      } catch (err) {
        uiStore.notify('Error de conexión al subir avatar', 'error');
      } finally {
        isUploadingAvatar.value = false;
      }
    };

    const saveProfile = async () => {
      if (!isAuthenticated.value) {
        uiStore.notify('Inicia sesión para guardar tu perfil en el servidor', 'error');
        return;
      }

      const updates = {
        name: name.value.trim(),
        username: username.value.trim().toLowerCase(),
        bio: bio.value.trim(),
        avatar: avatar.value
      };

      const res = await authStore.updateProfile(updates);
      if (res.success) {
        uiStore.notify('Perfil de usuario actualizado exitosamente', 'success');
      } else {
        uiStore.notify(res.error || 'Error al actualizar perfil', 'error');
      }
    };

    return {
      isAuthenticated,
      currentUser,
      name,
      username,
      bio,
      avatar,
      isUploadingAvatar,
      currentTheme,
      currentLang,
      soundEffects,
      handleAvatarUpload,
      saveProfile
    };
  },
  template: `
    <div class="settings-page" style="max-width: 800px; margin: 0 auto;">
      
      <div style="margin-bottom: 28px;">
        <span class="sticker-badge" style="background-color: var(--accent-yellow); color: #0F172A; margin-bottom: 8px;">
          PREFERENCIAS DEL SISTEMA
        </span>
        <h1 style="font-size: 2.2rem; font-weight: 900; color: var(--text-main); margin-bottom: 8px;">
          Configuración y Perfil
        </h1>
        <p style="color: var(--text-muted); font-size: 1rem;">
          Personaliza tu identidad en la plataforma, modo visual claro/oscuro e idioma.
        </p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 28px;">
        
        <!-- Profile Customization Section -->
        <section class="sticker-card" style="padding: 28px; background-color: var(--bg-surface);">
          <h2 style="font-size: 1.3rem; font-weight: 900; margin-bottom: 18px; border-bottom: 2px solid var(--border-main); padding-bottom: 8px;">
            👤 Perfil de Usuario
          </h2>

          <div v-if="!isAuthenticated" style="text-align: center; padding: 20px;">
            <p style="color: var(--text-muted); margin-bottom: 16px;">
              Inicia sesión o regístrate para personalizar tu avatar, nombre y biografía.
            </p>
            <router-link to="/login" class="sticker-btn btn-primary">
              Iniciar Sesión
            </router-link>
          </div>

          <form v-else @submit.prevent="saveProfile" style="display: flex; flex-direction: column; gap: 18px;">
            <!-- Avatar photo upload with multer -->
            <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
              <div style="position: relative;">
                <img 
                  :src="avatar" 
                  alt="Avatar" 
                  style="width: 84px; height: 84px; border-radius: 50%; border: 3px solid var(--border-main); object-fit: cover; background: #FFF; box-shadow: 3px 3px 0px var(--shadow-color);"
                />
              </div>
              <div style="flex: 1; min-width: 220px;">
                <label style="display: block; font-weight: 800; font-size: 0.88rem; margin-bottom: 6px;">
                  Foto o Avatar de Perfil (Multer /uploads)
                </label>
                <input 
                  type="file" 
                  accept="image/*" 
                  @change="handleAvatarUpload" 
                  class="sticker-input"
                />
                <span v-if="isUploadingAvatar" style="font-size: 0.8rem; font-weight: 700; color: var(--accent-orange); margin-top: 4px; display: inline-block;">
                  Subiendo avatar al servidor...
                </span>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
              <div>
                <label style="display: block; font-weight: 800; font-size: 0.88rem; margin-bottom: 6px;">
                  Nombre Completo
                </label>
                <input v-model="name" required class="sticker-input" />
              </div>
              <div>
                <label style="display: block; font-weight: 800; font-size: 0.88rem; margin-bottom: 6px;">
                  Nombre de Usuario (@)
                </label>
                <input v-model="username" required class="sticker-input" />
              </div>
            </div>

            <div>
              <label style="display: block; font-weight: 800; font-size: 0.88rem; margin-bottom: 6px;">
                Biografía o Especialidad
              </label>
              <textarea 
                v-model="bio" 
                rows="3" 
                class="sticker-input" 
                placeholder="Cuéntale a la comunidad sobre tus materias favoritas o experiencia..."
                style="resize: vertical;"
              ></textarea>
            </div>

            <div style="display: flex; justify-content: flex-end;">
              <button type="submit" class="sticker-btn btn-primary" style="padding: 10px 24px;">
                Guardar Perfil
              </button>
            </div>
          </form>
        </section>

        <!-- Appearance & Theme Section -->
        <section class="sticker-card" style="padding: 28px; background-color: var(--bg-surface);">
          <h2 style="font-size: 1.3rem; font-weight: 900; margin-bottom: 18px; border-bottom: 2px solid var(--border-main); padding-bottom: 8px;">
            🎨 Tema y Aspecto Visual
          </h2>

          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div>
              <label style="display: block; font-weight: 800; font-size: 0.9rem; margin-bottom: 8px;">
                Esquema de Color:
              </label>
              <div style="display: flex; gap: 14px;">
                <button 
                  type="button" 
                  @click="currentTheme = 'light'" 
                  class="sticker-btn"
                  :class="currentTheme === 'light' ? 'btn-primary' : 'btn-neutral'"
                  style="flex: 1; padding: 14px;"
                >
                  ☀️ Modo Claro (Papel Escolar)
                </button>
                <button 
                  type="button" 
                  @click="currentTheme = 'dark'" 
                  class="sticker-btn"
                  :class="currentTheme === 'dark' ? 'btn-primary' : 'btn-neutral'"
                  style="flex: 1; padding: 14px;"
                >
                  🌙 Modo Oscuro (Pizarrón Nocturno)
                </button>
              </div>
            </div>

            <!-- Language selector -->
            <div>
              <label style="display: block; font-weight: 800; font-size: 0.9rem; margin-bottom: 8px;">
                Idioma de la Plataforma:
              </label>
              <select v-model="currentLang" class="sticker-input" style="max-width: 320px;">
                <option value="es">🇪🇸 Español (Castellano)</option>
                <option value="en">🇬🇧 English (Global)</option>
              </select>
            </div>

            <!-- Sound effects toggle -->
            <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1.5px dashed var(--border-main); padding-top: 16px;">
              <div>
                <div style="font-weight: 800; font-size: 0.95rem;">Efectos de Sonido Lúdicos</div>
                <div style="font-size: 0.85rem; color: var(--text-muted);">
                  Sonidos retro sintetizados en las respuestas de los juegos
                </div>
              </div>
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 800;">
                <input 
                  type="checkbox" 
                  v-model="soundEffects" 
                  style="width: 20px; height: 20px; accent-color: var(--accent-orange);"
                />
                <span>{{ soundEffects ? 'Activados' : 'Desactivados' }}</span>
              </label>
            </div>

          </div>
        </section>

      </div>

    </div>
  `
};
