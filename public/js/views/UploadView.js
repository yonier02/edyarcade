import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';
import { useGamesStore } from '../stores/games.js';
import { useUiStore } from '../stores/ui.js';
import SandboxCodeTester from '../components/SandboxCodeTester.js';
import LearningTipsCard from '../components/LearningTipsCard.js';

export default {
  name: 'UploadView',
  components: {
    SandboxCodeTester,
    LearningTipsCard
  },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const gamesStore = useGamesStore();
    const uiStore = useUiStore();

    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const currentUser = computed(() => authStore.currentUser);

    // Form inputs
    const title = ref('');
    const description = ref('');
    const category = ref('Ciencias Naturales');
    const difficulty = ref('Intermedio');
    const tagsString = ref('secundaria, ciencia, interactivo');
    const coverUrl = ref('/uploads/cover-science.svg');
    const isUploadingCover = ref(false);

    // Code editor / file upload mode
    const inputMode = ref('files'); // 'files' | 'editor'
    const activeTab = ref('html'); // 'html' | 'css' | 'js'
    const rawHtml = ref('<h2>¡Mi Nuevo Reto Educativo!</h2>\n<p>Haz clic en el botón para responder:</p>\n<button id="myBtn" class="game-btn">Comenzar</button>\n<div id="output"></div>');
    const rawCss = ref('body { font-family: "Nunito", sans-serif; text-align: center; padding: 20px; background: #FFFDF7; color: #0F172A; }\n.game-btn { background: #FF6B35; color: #FFF; padding: 12px 24px; font-size: 1rem; font-weight: 800; border: 3px solid #0F172A; border-radius: 8px; box-shadow: 3px 3px 0px #0F172A; cursor: pointer; }\n.game-btn:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0px #0F172A; }\n#output { margin-top: 16px; font-weight: 800; font-size: 1.1rem; color: #00A896; }');
    const rawJs = ref('document.getElementById("myBtn").addEventListener("click", () => {\n  document.getElementById("output").textContent = "🎉 ¡Excelente trabajo! Reto completado con éxito.";\n});');
    
    const uploadedFilesSummary = ref([]);
    const isProcessingFiles = ref(false);

    const availableCategories = [
      'Química',
      'Matemáticas',
      'Geografía',
      'Lengua y Literatura',
      'Ciencias Naturales',
      'Física',
      'Historia',
      'Tecnología'
    ];

    // Consolidated standalone HTML
    const consolidatedCode = computed(() => {
      let html = rawHtml.value.trim();
      let css = rawCss.value.trim();
      let js = rawJs.value.trim();

      if (html.toLowerCase().includes('<!doctype') || html.toLowerCase().includes('<html')) {
        if (css && !html.includes(css)) {
          html = html.replace('</head>', `<style>\n${css}\n</style>\n</head>`);
        }
        if (js && !html.includes(js)) {
          html = html.replace('</body>', `<script>\n${js}\n</script>\n</body>`);
        }
        return html;
      }

      return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title.value || 'Juego Educativo'}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    ${js}
  </script>
</body>
</html>`;
    });

    const handleFilesChosen = async (event) => {
      const files = Array.from(event.target.files);
      if (!files || files.length === 0) return;

      isProcessingFiles.value = true;
      uploadedFilesSummary.value = [];

      for (const file of files) {
        const text = await file.text();
        uploadedFilesSummary.value.push({ name: file.name, size: file.size, type: file.type });

        if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
          rawHtml.value = text;
        } else if (file.name.endsWith('.css')) {
          rawCss.value = text;
        } else if (file.name.endsWith('.js')) {
          rawJs.value = text;
        }
      }

      isProcessingFiles.value = false;
      uiStore.notify(`Se procesaron ${files.length} archivos y se combinaron exitosamente.`, 'success');
    };

    const handleCoverUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      isUploadingCover.value = true;
      try {
        const formData = new FormData();
        formData.append('cover', file);
        const res = await fetch('/api/upload-cover', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success && data.url) {
          coverUrl.value = data.url;
          uiStore.notify('Portada del juego subida correctamente', 'success');
        } else {
          uiStore.notify('Error al subir la portada', 'error');
        }
      } catch (err) {
        uiStore.notify('Error al conectar con el servidor para subir la portada', 'error');
      } finally {
        isUploadingCover.value = false;
      }
    };

    const onLoadTemplate = (tpl) => {
      title.value = tpl.title;
      category.value = tpl.category;
      rawHtml.value = tpl.html;
      rawCss.value = tpl.css;
      rawJs.value = tpl.js;
      inputMode.value = 'editor';
      uiStore.notify(`¡Plantilla "${tpl.name}" cargada en el editor!`, 'success');
    };

    const testRunGame = () => {
      const previewGame = {
        id: 'preview-' + Date.now(),
        title: title.value.trim() || 'Vista Previa del Juego',
        category: category.value,
        code: consolidatedCode.value
      };
      uiStore.openGame(previewGame);
    };

    const publishGame = async () => {
      if (!isAuthenticated.value) {
        uiStore.notify('Debes iniciar sesión para publicar un videojuego', 'error');
        router.push('/login');
        return;
      }

      if (!title.value.trim()) {
        uiStore.notify('Por favor escribe un título para el juego', 'error');
        return;
      }

      if (!description.value.trim()) {
        uiStore.notify('Por favor agrega una descripción pedagógica', 'error');
        return;
      }

      const tags = tagsString.value
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(t => t.length > 0);

      const newGameData = {
        title: title.value.trim(),
        description: description.value.trim(),
        category: category.value,
        difficulty: difficulty.value,
        tags,
        cover: coverUrl.value,
        authorId: currentUser.value.id,
        authorName: currentUser.value.name,
        code: consolidatedCode.value
      };

      const result = await gamesStore.createGame(newGameData);
      if (result.success) {
        uiStore.notify(`¡Reto "${newGameData.title}" publicado con éxito!`, 'success');
        router.push('/my-games');
      } else {
        uiStore.notify(result.error || 'Error al guardar el juego', 'error');
      }
    };

    return {
      isAuthenticated,
      currentUser,
      title,
      description,
      category,
      difficulty,
      tagsString,
      coverUrl,
      isUploadingCover,
      inputMode,
      activeTab,
      rawHtml,
      rawCss,
      rawJs,
      uploadedFilesSummary,
      isProcessingFiles,
      availableCategories,
      consolidatedCode,
      handleFilesChosen,
      handleCoverUpload,
      onLoadTemplate,
      testRunGame,
      publishGame
    };
  },
  template: `
    <div class="upload-page" style="max-width: 900px; margin: 0 auto;">
      
      <!-- Page Header -->
      <div style="margin-bottom: 24px;">
        <span class="sticker-badge" style="background-color: var(--accent-mint); color: #0F172A; margin-bottom: 8px;">
          CREADOR DE CONTENIDO
        </span>
        <h1 style="font-size: 2.2rem; font-weight: 900; color: var(--text-main); margin-bottom: 8px;">
          Publicar Nuevo Videojuego Educativo
        </h1>
        <p style="color: var(--text-muted); font-size: 1rem;">
          Sube tus archivos HTML, CSS y JS (individuales o múltiples) o usa el editor para consolidar tu reto educativo.
        </p>
      </div>

      <!-- Component 1: SandboxCodeTester (Asistente de plantillas de código) -->
      <sandbox-code-tester @load-template="onLoadTemplate" />

      <!-- Component 2: LearningTipsCard -->
      <div style="margin-bottom: 24px;">
        <learning-tips-card />
      </div>

      <!-- Auth warning if not logged in -->
      <div v-if="!isAuthenticated" class="sticker-card" style="padding: 18px 24px; background-color: var(--accent-yellow); color: #0F172A; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px;">
        <div>
          <span style="font-weight: 800; font-size: 0.95rem;">⚠️ Modo Invitado:</span>
          <p style="font-size: 0.88rem;">Puedes probar tu código en la ventana flotante libremente, pero inicia sesión para guardarlo.</p>
        </div>
        <router-link to="/login" class="sticker-btn btn-neutral" style="font-size: 0.85rem;">
          Iniciar Sesión
        </router-link>
      </div>

      <!-- Component 3: Main Upload Form -->
      <form @submit.prevent="publishGame" class="sticker-card" style="padding: 32px; background-color: var(--bg-surface); display: flex; flex-direction: column; gap: 24px;">
        
        <!-- Section 1: Basic Metadata -->
        <div>
          <h2 style="font-size: 1.25rem; font-weight: 900; margin-bottom: 16px; border-bottom: 2px solid var(--border-main); padding-bottom: 8px;">
            1. Información del Reto Educativo
          </h2>

          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <label style="display: block; font-weight: 800; font-size: 0.9rem; margin-bottom: 6px;">
                Título del Videojuego *
              </label>
              <input 
                v-model="title" 
                required 
                class="sticker-input" 
                placeholder="ej: Desafío de la Tabla Periódica"
              />
            </div>

            <div>
              <label style="display: block; font-weight: 800; font-size: 0.9rem; margin-bottom: 6px;">
                Descripción Pedagógica *
              </label>
              <textarea 
                v-model="description" 
                required 
                rows="3" 
                class="sticker-input" 
                placeholder="Explica las instrucciones del juego y los objetivos de aprendizaje que refuerza..."
                style="resize: vertical;"
              ></textarea>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
              <div>
                <label style="display: block; font-weight: 800; font-size: 0.9rem; margin-bottom: 6px;">
                  Materia / Asignatura *
                </label>
                <select v-model="category" class="sticker-input">
                  <option v-for="cat in availableCategories" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                </select>
              </div>

              <div>
                <label style="display: block; font-weight: 800; font-size: 0.9rem; margin-bottom: 6px;">
                  Nivel de Dificultad
                </label>
                <select v-model="difficulty" class="sticker-input">
                  <option value="Básico">Básico</option>
                  <option value="Intermedio">Intermedio (Recomendado)</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
              </div>
            </div>

            <div>
              <label style="display: block; font-weight: 800; font-size: 0.9rem; margin-bottom: 6px;">
                Etiquetas Curriculares (separadas por coma)
              </label>
              <input 
                v-model="tagsString" 
                class="sticker-input" 
                placeholder="química, secundaria, fórmulas, memoria"
              />
            </div>
          </div>
        </div>

        <!-- Section 2: Cover Image Upload -->
        <div>
          <h2 style="font-size: 1.25rem; font-weight: 900; margin-bottom: 16px; border-bottom: 2px solid var(--border-main); padding-bottom: 8px;">
            2. Imagen de Portada (Multer /uploads)
          </h2>

          <div style="display: flex; flex-wrap: wrap; gap: 20px; align-items: center;">
            <div style="width: 160px; height: 100px; border: 2.5px solid var(--border-main); border-radius: 8px; overflow: hidden; background: #E2E8F0; box-shadow: 2px 2px 0px var(--shadow-color);">
              <img :src="coverUrl" alt="Portada" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>

            <div style="flex: 1; min-width: 240px;">
              <label style="display: block; font-weight: 700; font-size: 0.85rem; margin-bottom: 6px; color: var(--text-muted);">
                Sube una imagen personalizada (.png, .jpg, .svg) para la tarjeta:
              </label>
              <input 
                type="file" 
                accept="image/*" 
                @change="handleCoverUpload" 
                class="sticker-input"
              />
              <span v-if="isUploadingCover" style="font-weight: 700; font-size: 0.85rem; color: var(--accent-orange); margin-top: 4px; display: inline-block;">
                ⏳ Subiendo imagen al servidor Express...
              </span>
            </div>
          </div>
        </div>

        <!-- Section 3: Game Code Upload / Combination -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 2px solid var(--border-main); padding-bottom: 8px;">
            <h2 style="font-size: 1.25rem; font-weight: 900;">
              3. Código del Videojuego (HTML, JS, CSS)
            </h2>
            <div style="display: flex; gap: 8px;">
              <button 
                type="button" 
                @click="inputMode = 'files'" 
                class="sticker-btn" 
                :class="inputMode === 'files' ? 'btn-primary' : 'btn-neutral'"
                style="padding: 5px 12px; font-size: 0.8rem;"
              >
                📁 Subir Archivos
              </button>
              <button 
                type="button" 
                @click="inputMode = 'editor'" 
                class="sticker-btn" 
                :class="inputMode === 'editor' ? 'btn-primary' : 'btn-neutral'"
                style="padding: 5px 12px; font-size: 0.8rem;"
              >
                ✏️ Editar Pestañas
              </button>
            </div>
          </div>

          <!-- File Upload Mode -->
          <div v-if="inputMode === 'files'" style="background: var(--bg-surface-alt); border: 2.5px dashed var(--border-main); border-radius: 10px; padding: 24px; text-align: center;">
            <div style="font-size: 2.5rem; margin-bottom: 10px;">📦</div>
            <h3 style="font-weight: 800; font-size: 1.1rem; margin-bottom: 6px;">
              Selecciona uno o varios archivos (.html, .css, .js)
            </h3>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 16px;">
              Eduarcade leerá automáticamente cada archivo y los consolidará en una experiencia web segura.
            </p>
            <input 
              type="file" 
              multiple 
              accept=".html,.htm,.css,.js" 
              @change="handleFilesChosen" 
              style="margin: 0 auto; display: block;" 
            />

            <!-- Summary of files uploaded -->
            <div v-if="uploadedFilesSummary.length > 0" style="margin-top: 16px; text-align: left; background: #FFF; border: 2px solid var(--border-main); border-radius: 8px; padding: 12px;">
              <div style="font-weight: 800; font-size: 0.85rem; margin-bottom: 6px;">Archivos combinados:</div>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 4px; font-family: var(--font-mono); font-size: 0.8rem;">
                <li v-for="f in uploadedFilesSummary" :key="f.name">
                  ✅ {{ f.name }} ({{ Math.round(f.size/1024) }} KB)
                </li>
              </ul>
            </div>
          </div>

          <!-- Editor Mode with tabs -->
          <div v-else>
            <div style="display: flex; gap: 6px; margin-bottom: 10px;">
              <button 
                type="button" 
                @click="activeTab = 'html'" 
                class="sticker-btn" 
                :class="activeTab === 'html' ? 'btn-mint' : 'btn-neutral'"
                style="padding: 6px 14px; font-size: 0.85rem;"
              >
                HTML
              </button>
              <button 
                type="button" 
                @click="activeTab = 'css'" 
                class="sticker-btn" 
                :class="activeTab === 'css' ? 'btn-mint' : 'btn-neutral'"
                style="padding: 6px 14px; font-size: 0.85rem;"
              >
                CSS
              </button>
              <button 
                type="button" 
                @click="activeTab = 'js'" 
                class="sticker-btn" 
                :class="activeTab === 'js' ? 'btn-mint' : 'btn-neutral'"
                style="padding: 6px 14px; font-size: 0.85rem;"
              >
                JavaScript
              </button>
            </div>

            <textarea 
              v-if="activeTab === 'html'" 
              v-model="rawHtml" 
              rows="10" 
              class="sticker-input" 
              style="font-family: var(--font-mono); font-size: 0.85rem; resize: vertical;"
              placeholder="<!-- Código HTML de la estructura del juego -->"
            ></textarea>

            <textarea 
              v-if="activeTab === 'css'" 
              v-model="rawCss" 
              rows="10" 
              class="sticker-input" 
              style="font-family: var(--font-mono); font-size: 0.85rem; resize: vertical;"
              placeholder="/* Estilos CSS del juego */"
            ></textarea>

            <textarea 
              v-if="activeTab === 'js'" 
              v-model="rawJs" 
              rows="10" 
              class="sticker-input" 
              style="font-family: var(--font-mono); font-size: 0.85rem; resize: vertical;"
              placeholder="// Lógica de interacción JavaScript"
            ></textarea>
          </div>
        </div>

        <!-- Section 4: Actions & Live Preview -->
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; border-top: 2px solid var(--border-main); padding-top: 20px;">
          <button 
            type="button" 
            @click="testRunGame" 
            class="sticker-btn btn-yellow" 
            style="font-size: 0.95rem; padding: 12px 20px;"
          >
            ▶ Probar en Ventana Flotante (Sandbox)
          </button>

          <button 
            type="submit" 
            class="sticker-btn btn-primary" 
            style="font-size: 1rem; padding: 12px 28px;"
          >
            🚀 Publicar Videojuego en Eduarcade
          </button>
        </div>

      </form>
    </div>
  `
};
