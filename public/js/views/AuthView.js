import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';
import { useUiStore } from '../stores/ui.js';

export default {
  name: 'AuthView',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const uiStore = useUiStore();

    const mode = ref('login'); // 'login' | 'register'
    const isLoading = computed(() => authStore.isLoading);
    const authError = computed(() => authStore.authError);

    // Login fields
    const loginEmail = ref('');
    const loginPassword = ref('');

    // Register fields
    const regName = ref('');
    const regUsername = ref('');
    const regEmail = ref('');
    const regPassword = ref('');
    const regRole = ref('estudiante');
    const regBio = ref('');
    const regAvatar = ref('/uploads/avatar-student.svg');

    const handleLogin = async () => {
      if (!loginEmail.value || !loginPassword.value) {
        uiStore.notify('Por favor completa todos los campos de acceso', 'error');
        return;
      }
      const res = await authStore.login(loginEmail.value, loginPassword.value);
      if (res.success) {
        uiStore.notify(`¡Bienvenido de nuevo, ${res.user.name}! 👋`, 'success');
        router.push('/library');
      } else {
        uiStore.notify(res.error || 'Credenciales inválidas', 'error');
      }
    };

    const handleRegister = async () => {
      if (!regName.value || !regUsername.value || !regEmail.value || !regPassword.value) {
        uiStore.notify('Completa todos los campos obligatorios para registrarte', 'error');
        return;
      }

      if (regPassword.value.length < 6) {
        uiStore.notify('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
      }

      const res = await authStore.register({
        name: regName.value,
        username: regUsername.value,
        email: regEmail.value,
        password: regPassword.value,
        role: regRole.value,
        bio: regBio.value,
        avatar: regAvatar.value
      });

      if (res.success) {
        uiStore.notify(`¡Registro exitoso! Cuenta creada para ${res.user.name} 🎓`, 'success');
        router.push('/library');
      } else {
        uiStore.notify(res.error || 'Error al registrar usuario', 'error');
      }
    };

    // Quick demo login helper
    const quickLogin = async (email, password) => {
      loginEmail.value = email;
      loginPassword.value = password;
      await handleLogin();
    };

    return {
      mode,
      isLoading,
      authError,
      loginEmail,
      loginPassword,
      regName,
      regUsername,
      regEmail,
      regPassword,
      regRole,
      regBio,
      regAvatar,
      handleLogin,
      handleRegister,
      quickLogin
    };
  },
  template: `
    <div class="auth-page" style="max-width: 520px; margin: 30px auto;">
      
      <!-- Card Container -->
      <div class="sticker-card" style="padding: 32px; background-color: var(--bg-surface);">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="font-size: 2.5rem; margin-bottom: 6px;">🕹️</div>
          <h1 style="font-size: 1.8rem; font-weight: 900; color: var(--text-main);">
            {{ mode === 'login' ? 'Iniciar Sesión en Eduarcade' : 'Crear Cuenta Académica' }}
          </h1>
          <p style="color: var(--text-muted); font-size: 0.92rem;">
            Tu pasaporte para jugar, calificar y publicar retos educativos interactivos.
          </p>
        </div>

        <!-- Mode Toggle Tabs -->
        <div style="display: flex; gap: 8px; margin-bottom: 24px; background: var(--bg-surface-alt); padding: 4px; border-radius: var(--radius-md); border: 2px solid var(--border-main);">
          <button 
            type="button" 
            @click="mode = 'login'" 
            class="sticker-btn" 
            :class="mode === 'login' ? 'btn-primary' : 'btn-neutral'"
            style="flex: 1; padding: 8px;"
          >
            Iniciar Sesión
          </button>
          <button 
            type="button" 
            @click="mode = 'register'" 
            class="sticker-btn" 
            :class="mode === 'register' ? 'btn-primary' : 'btn-neutral'"
            style="flex: 1; padding: 8px;"
          >
            Registrarse
          </button>
        </div>

        <!-- Error Alert -->
        <div v-if="authError" style="background-color: #FEE2E2; border: 2px solid #EF4444; color: #B91C1C; padding: 12px; border-radius: 8px; margin-bottom: 18px; font-weight: 700; font-size: 0.88rem;">
          ❌ {{ authError }}
        </div>

        <!-- LOGIN FORM -->
        <form v-if="mode === 'login'" @submit.prevent="handleLogin" style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <label style="display: block; font-weight: 800; font-size: 0.88rem; margin-bottom: 6px;">
              Correo Electrónico
            </label>
            <input 
              v-model="loginEmail" 
              type="email" 
              required 
              class="sticker-input" 
              placeholder="tu_correo@eduarcade.com"
            />
          </div>

          <div>
            <label style="display: block; font-weight: 800; font-size: 0.88rem; margin-bottom: 6px;">
              Contraseña
            </label>
            <input 
              v-model="loginPassword" 
              type="password" 
              required 
              class="sticker-input" 
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            :disabled="isLoading" 
            class="sticker-btn btn-primary" 
            style="padding: 12px; font-size: 1rem; margin-top: 8px;"
          >
            {{ isLoading ? 'Comprobando...' : 'Entrar a Eduarcade 🚀' }}
          </button>

          <!-- Demo Accounts Helper -->
          <div style="margin-top: 16px; padding-top: 16px; border-top: 1.5px dashed var(--border-main); text-align: center;">
            <div style="font-weight: 800; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 10px;">
              ACCESO RÁPIDO PARA EVALUACIÓN:
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <button 
                type="button" 
                @click="quickLogin('sofia@eduarcade.com', 'password123')" 
                class="sticker-btn btn-neutral" 
                style="padding: 8px; font-size: 0.85rem;"
              >
                👩‍🏫 Prof. Sofía Navarro (Docente / Química & Ciencias)
              </button>
              <button 
                type="button" 
                @click="quickLogin('mateo@eduarcade.com', 'password123')" 
                class="sticker-btn btn-neutral" 
                style="padding: 8px; font-size: 0.85rem;"
              >
                🎒 Mateo Gómez (Estudiante / Creador Minijuegos)
              </button>
            </div>
          </div>
        </form>

        <!-- REGISTER FORM -->
        <form v-else @submit.prevent="handleRegister" style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <label style="display: block; font-weight: 800; font-size: 0.88rem; margin-bottom: 6px;">
              Nombre Completo *
            </label>
            <input 
              v-model="regName" 
              required 
              class="sticker-input" 
              placeholder="ej: Carla Méndez"
            />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="display: block; font-weight: 800; font-size: 0.88rem; margin-bottom: 6px;">
                Usuario (@) *
              </label>
              <input 
                v-model="regUsername" 
                required 
                class="sticker-input" 
                placeholder="carla_m"
              />
            </div>
            <div>
              <label style="display: block; font-weight: 800; font-size: 0.88rem; margin-bottom: 6px;">
                Rol Académico
              </label>
              <select v-model="regRole" class="sticker-input">
                <option value="estudiante">Estudiante</option>
                <option value="profesor">Profesor(a)</option>
              </select>
            </div>
          </div>

          <div>
            <label style="display: block; font-weight: 800; font-size: 0.88rem; margin-bottom: 6px;">
              Correo Electrónico *
            </label>
            <input 
              v-model="regEmail" 
              type="email" 
              required 
              class="sticker-input" 
              placeholder="carla@colegio.edu"
            />
          </div>

          <div>
            <label style="display: block; font-weight: 800; font-size: 0.88rem; margin-bottom: 6px;">
              Contraseña (mínimo 6 caracteres) *
            </label>
            <input 
              v-model="regPassword" 
              type="password" 
              required 
              minlength="6"
              class="sticker-input" 
              placeholder="••••••••"
            />
          </div>

          <div>
            <label style="display: block; font-weight: 800; font-size: 0.88rem; margin-bottom: 6px;">
              Biografía / Intereses
            </label>
            <input 
              v-model="regBio" 
              class="sticker-input" 
              placeholder="ej: Alumno apasionado de la física y los acertijos"
            />
          </div>

          <button 
            type="submit" 
            :disabled="isLoading" 
            class="sticker-btn btn-mint" 
            style="padding: 12px; font-size: 1rem; margin-top: 8px;"
          >
            {{ isLoading ? 'Creando cuenta...' : 'Completar Registro 🎓' }}
          </button>
        </form>

      </div>

    </div>
  `
};
