import { defineStore } from 'pinia';

// Use transparent /api/db proxy or direct JSON server
const API_BASE = '/api/db';

export const useAuthStore = defineStore('auth', {
  state: () => {
    let savedUser = null;
    try {
      const raw = localStorage.getItem('eduarcade_user');
      if (raw) savedUser = JSON.parse(raw);
    } catch (e) {
      console.warn('Error reading saved user', e);
    }
    return {
      user: savedUser,
      isLoading: false,
      authError: null
    };
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
    userId: (state) => state.user?.id || null,
    isTeacher: (state) => state.user?.role === 'profesor' || state.user?.role === 'profesora'
  },
  actions: {
    async login(email, password) {
      this.isLoading = true;
      this.authError = null;
      try {
        const res = await fetch(`${API_BASE}/users?email=${encodeURIComponent(email.trim().toLowerCase())}`);
        if (!res.ok) throw new Error('Error al conectar con el servidor');
        const users = await res.json();
        
        if (!users || users.length === 0) {
          throw new Error('No existe ningún usuario registrado con este correo');
        }

        const found = users[0];
        if (found.password !== password) {
          throw new Error('Contraseña incorrecta. Por favor verifica tus credenciales');
        }

        this.user = found;
        localStorage.setItem('eduarcade_user', JSON.stringify(found));
        return { success: true, user: found };
      } catch (err) {
        this.authError = err.message;
        return { success: false, error: err.message };
      } finally {
        this.isLoading = false;
      }
    },

    async register({ name, username, email, password, role, bio, avatar }) {
      this.isLoading = true;
      this.authError = null;
      try {
        // Check if email or username already taken
        const checkRes = await fetch(`${API_BASE}/users?email=${encodeURIComponent(email.trim().toLowerCase())}`);
        const existing = await checkRes.json();
        if (existing && existing.length > 0) {
          throw new Error('El correo electrónico ya está en uso');
        }

        const newUser = {
          id: 'u_' + Date.now(),
          name: name.trim(),
          username: username.trim().toLowerCase(),
          email: email.trim().toLowerCase(),
          password,
          role: role || 'estudiante',
          avatar: avatar || '/uploads/avatar-student.svg',
          bio: bio || 'Entusiasta del aprendizaje interactivo en Eduarcade',
          createdAt: new Date().toISOString()
        };

        const res = await fetch(`${API_BASE}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
        });

        if (!res.ok) throw new Error('Error al registrar usuario en el servidor');
        const created = await res.json();
        this.user = created;
        localStorage.setItem('eduarcade_user', JSON.stringify(created));
        return { success: true, user: created };
      } catch (err) {
        this.authError = err.message;
        return { success: false, error: err.message };
      } finally {
        this.isLoading = false;
      }
    },

    logout() {
      this.user = null;
      localStorage.removeItem('eduarcade_user');
    },

    async updateProfile(updates) {
      if (!this.user) return { success: false, error: 'No hay usuario autenticado' };
      this.isLoading = true;
      try {
        const res = await fetch(`${API_BASE}/users/${this.user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
        if (!res.ok) throw new Error('Error al actualizar perfil');
        const updated = await res.json();
        this.user = updated;
        localStorage.setItem('eduarcade_user', JSON.stringify(updated));
        return { success: true, user: updated };
      } catch (err) {
        return { success: false, error: err.message };
      } finally {
        this.isLoading = false;
      }
    }
  }
});
