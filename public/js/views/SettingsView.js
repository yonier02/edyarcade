import { ref, computed, watch } from 'vue';
import { useAuthStore } from '../stores/auth.js';
import { useSettingsStore } from '../stores/settings.js';
import { useUiStore } from '../stores/ui.js';
import UserProfileCard from '../components/UserProfileCard.js';
import ThemeSoundWidget from '../components/ThemeSoundWidget.js';

export default {
  name: 'SettingsView',
  components: {
    UserProfileCard,
    ThemeSoundWidget
  },
  setup() {
    const authStore = useAuthStore();
    const settingsStore = useSettingsStore();
    const uiStore = useUiStore();

    const currentUser = computed(() => authStore.currentUser);
    const isAuthenticated = computed(() => authStore.isAuthenticated);

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

    const switchUser = async (userKey) => {
      if (userKey === 'sofia') {
        await authStore.login('sofia@eduarcade.com', 'password123');
        uiStore.notify('Sesión cambiada a Prof. Sofía', 'success');
      } else if (userKey === 'mateo') {
        await authStore.login('mateo@eduarcade.com', 'password123');
        uiStore.notify('Sesión cambiada a Mateo Gómez', 'success');
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
      saveProfile,
      switchUser
    };
  },
  template: `
    <div class="settings-page" style="max-width: 820px; margin: 0 auto;">
      
      <div style="margin-bottom: 24px;">
        <span class="sticker-badge" style="background-color: var(--accent-yellow); color: #0F172A; margin-bottom: 8px;">
          PREFERENCIAS DEL SISTEMA
        </span>
        <h1 style="font-size: 2.2rem; font-weight: 900; color: var(--text-main); margin-bottom: 6px;">
          Configuración y Perfil
        </h1>
        <p style="color: var(--text-muted); font-size: 0.95rem;">
          Personaliza tu perfil, avatar con Multer, esquema de color y sonidos de la plataforma.
        </p>
      </div>

      <!-- Component 1: UserProfileCard -->
      <user-profile-card 
        :user="currentUser" 
        :show-switcher="true"
        @switch-user="switchUser"
      />

      <!-- Component 2: ThemeSoundWidget (Controles de tema claro/oscuro y audio) -->
      <theme-sound-widget 
        :theme="currentTheme"
        :language="currentLang"
        :sound-effects="soundEffects"
        @update:theme="val => currentTheme = val"
        @update:language="val => currentLang = val"
        @update:sound-effects="val => soundEffects = val"
      />

      <!-- Component 3: Profile Form -->
      <section v-if="isAuthenticated" class="sticker-card" style="padding: 28px; background-color: var(--bg-surface);">
        <h3 style="font-size: 1.25rem; font-weight: 900; margin-bottom: 16px; border-bottom: 2px solid var(--border-main); padding-bottom: 8px;">
          📝 Datos de Identidad
        </h3>

        <form @submit.prevent="saveProfile" style="display: flex; flex-direction: column; gap: 18px;">
          <!-- Avatar photo upload with multer -->
          <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
            <div>
              <img 
                :src="avatar" 
                alt="Avatar" 
                style="width: 76px; height: 76px; border-radius: 50%; border: 3px solid var(--border-main); object-fit: cover; background: #FFF; box-shadow: 2px 2px 0px var(--shadow-color);"
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
              Guardar Cambios
            </button>
          </div>
        </form>
      </section>

    </div>
  `
};
