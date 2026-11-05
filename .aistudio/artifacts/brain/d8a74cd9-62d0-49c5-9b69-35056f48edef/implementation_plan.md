# Eduarcade: Plataforma Web de Juegos Educativos

Plataforma educativa integral donde estudiantes y educadores pueden explorar, jugar en una ventana flotante interactiva y crear/subir sus propios videojuegos educativos en HTML, CSS y JavaScript, con arquitectura desacoplada impulsada por Vue 3 (Composition API), Express con Multer y JSON Server.

## Decisiones Críticas y Confirmación del Usuario

> [!IMPORTANT]
> Se han incorporado las preferencias confirmadas en la fase de clarificación interactiva:
> - **Identidad y Nombre**: **Eduarcade** (enfoque Playground Académico, lúdico pero riguroso).
> - **Nivel Educativo de los Juegos**: **Secundaria y retos avanzados (12 a 16 años)** con mecánicas de cálculo mental rápido, formulación química/memoria, geografía geopolítica, gramática/orden sintáctico y quiz interdisciplinario de ciencias.
> - **Arquitectura sin Bundler para el Cliente**: Vue 3, Pinia y Vue Router cargados vía CDN en módulos ES nativos (`.js`) con template literals, sin compiladores intermedios.
> - **Servidores Concurrentes**: Express sirviendo estáticos y gestión de uploads (`/uploads`) en el puerto 3000, y JSON Server en el puerto 3001 como base de datos RESTful (`db.json`), coordinados mediante `concurrently`.

---

## 1. Visión General y Concepto Central

- **Qué hace la aplicación**: Permite a los usuarios registrarse e iniciar sesión, navegar por una biblioteca categorizada de juegos educativos con búsqueda en tiempo real (por título, etiqueta y categoría), ejecutar cualquier juego en un entorno flotante de ventana modal arrastrable y redimensionable con sandbox seguro, y a los creadores subir o gestionar sus propios títulos combinando código HTML/JS/CSS y portadas personalizadas.
- **Público Objetivo**: Alumnos de secundaria (12 a 16 años) y profesores que buscan gamificar el aula con retos dinámicos de ciencias, matemáticas, lenguaje y geografía.
- **Valor Diferencial**: Ejecución segura y liviana mediante `srcdoc` en sandbox, sistema de creador integrado (GameManager) con control de autoría, estética visual atractiva "Playground Académico" y cero fricción de compilación en el navegador.

---

## 2. Experiencia de Usuario y Diseño Visual

### Identidad Visual "Playground Académico"
- **Paleta de Colores**:
  - *Naranja Mandarina* (`#FF6B35` / `#E85D04`): Acentos de acción primaria, botones de juego, resaltes interactivos.
  - *Verde Menta* (`#2EC4B6` / `#00A896`): Indicadores de progreso, estados de éxito, insignia de categoría de ciencias y matemáticas.
  - *Azul Pizarrón* (`#1E293B` / `#0F172A`): Estructura, fondos oscuros, bordes y tipografía de alto contraste.
  - *Crema Cálido* (`#FFFDF7` / `#F8F6F0`): Lienzo neutro principal en modo claro, simulando papel pergamino escolar de alta calidad.
- **Bordes y Sombras de Estilo Sticker**:
  - Bordes definidos de `2.5px` a `3px` sólidos (`border-slate-900 dark:border-slate-700`).
  - Sombras duras offset de estilo pegatina neo-brutalista (`box-shadow: 4px 4px 0px #0F172A` en botones y tarjetas).
- **Tipografía**:
  - *Display y Títulos*: `Nunito` (amigable, enérgica y académica, pesos 700 y 800).
  - *Datos, Puntuaciones y Código*: `Space Mono` (números tabulares, temporizadores de juego y fragmentos de código).
- **Contrato de Barra Superior**:
  - Zona de Marca única: Logotipo `Eduarcade` con icono de libro/joystick.
  - Navegación limpia de un solo renglón: Inicio, Biblioteca, Subir Juego, Mis Juegos, Configuración.
  - Zona de Acción/Perfil: Avatar del usuario autenticado con indicador de sesión o botón de acceso.

### Modos Claro y Oscuro Coherentes
- Compatibilidad completa con temas claro y oscuro mediante la directiva CSS de tema en `settingsStore`, alternando variables semánticas de color para mantener la alta legibilidad WCAG AA.

---

## 3. Decisiones de Producto y Arquitectura

1. **Gestión de Estado (Pinia Stores)**:
   - `authStore`: Manejo de usuario actual, token/sesión en `localStorage`, login, registro y logout.
   - `gamesStore`: Catálogo reactivo, carga desde JSON Server, filtros combinados de búsqueda, creación, edición y borrado con verificación de autor.
   - `uiStore`: Control de la ventana flotante activa (juego abierto, estado minimizado, maximizado, coordenadas `x, y`, dimensiones `w, h` y `zIndex`), además de notificaciones toast.
   - `settingsStore`: Preferencias de tema (claro/oscuro), idioma (es/en) y volumen/efectos guardados localmente.

2. **Ventana Flotante de Juego (FloatingGameWindow)**:
   - Componente desacoplado que flota sobre la interfaz.
   - Cuenta con barra de título con controles tipo SO (minimizar a barra inferior, expandir pantalla completa, cerrar).
   - Arrastre fluido mediante mouse/touch (`mousedown`/`mousemove` con límites de ventana).
   - Iframe aislado con `sandbox="allow-scripts"` inyectando el código consolidado del juego mediante `srcdoc`.

3. **Subida y Procesamiento de Juegos (GameManager & UploadGame)**:
   - Permite subir archivos individuales o múltiples (`.html`, `.js`, `.css`), o redactar/pegar código directamente en pestañas dedicadas.
   - El cliente combina los assets en una estructura HTML autocontenida que enlaza los estilos y scripts de manera segura.
   - Las portadas y avatares se envían al endpoint `/api/upload` de Express mediante `FormData` con `multer`, retornando la URL local accesible en `/uploads`.

4. **Los 5 Juegos Predeterminados para Secundaria**:
   - **1. Parejas de Elementos y Compuestos** (Química): Empareja símbolos químicos con sus fórmulas y nombres (e.g. $NaCl$ con Cloruro de Sodio, $H_2O$, $CO_2$, $Fe$, $Au$, $CH_4$).
   - **2. Cálculo y Agilidad Mental Relámpago** (Matemáticas): Ecuaciones rápidas, números enteros y operaciones combinadas con tiempo límite y racha de puntos.
   - **3. Desafío Geopolítico de Capitales** (Geografía): Preguntas de capitales de los 5 continentes con pistas de continente y población.
   - **4. Reordenador de Sintaxis y Oraciones** (Lenguaje): Reorganiza oraciones con estructuras complejas (sujeto, predicado, complementos directos e indirectos).
   - **5. Master Quiz de Ciencias Interdisciplinario** (Física/Biología/Astronomía): Preguntas conceptuales con explicación inmediata pedagógica tras cada respuesta.

---

## 4. Diagrama de Arquitectura y Flujo de Datos

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Cliente Navegador (Port 3000)                   │
│                                                                        │
│   Vue 3 (ES Modules CDN) + Vue Router + Pinia                          │
│                                                                        │
│   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐     │
│   │    authStore     │  │    gamesStore    │  │     uiStore      │     │
│   │ (Sesión/Usuario) │  │ (CRUD / Filtros) │  │(Ventana Flotante)│     │
│   └─────────┬────────┘  └─────────┬────────┘  └────────┬─────────┘     │
│             │                     │                    │               │
│   ┌─────────▼─────────────────────▼────────────────────▼─────────┐     │
│   │ Componentes: SearchBar, GameLibrary, GameManager, FloatWin   │     │
│   │ Vistas: HomeView, LibraryView, UploadView, SettingsView, etc.│     │
│   └───────────────────────────────┬──────────────────────────────┘     │
└───────────────────────────────────┼────────────────────────────────────┘
                                    │ Peticiones HTTP
                                    ▼
┌───────────────────────────────────────────┬────────────────────────────┐
│      Servidor Express (Port 3000)         │ JSON Server (Port 3001)    │
│                                           │                            │
│  - Archivos Estáticos (/public)           │  REST API:                 │
│  - Endpoint /api/upload (Multer)          │  - GET /games              │
│  - Directorio /uploads                    │  - POST/PUT/DELETE /games  │
│  - Proxy transparente a JSON Server:3001  │  - GET /users              │
│    (evita bloqueos de CORS o puertos)     │  - POST/PUT /users         │
└───────────────────────────────────────────┴────────────────────────────┘
```

---

## 5. Verificación y Plan de Pruebas

1. **Instalación y Configuración**:
   - Ajustar dependencias en `package.json` agregando `json-server@0.17.4`, `multer`, `concurrently` y configurar scripts `dev` y `start`.
2. **Inicialización de Base de Datos**:
   - Crear `server/db.json` con los usuarios iniciales y los 5 juegos completos con su código funcional HTML/JS/CSS embebido.
3. **Servidor y Endpoints**:
   - Implementar `server/index.js` con Express, Multer, rutas para `/uploads` y proxy / reenvío hacia JSON Server.
4. **Desarrollo Frontend en `/public`**:
   - Estructurar `/public/index.html` con CDN para Vue 3, Pinia, Vue Router y fuentes Nunito / Space Mono.
   - Implementar los 4 stores de Pinia (`auth.js`, `games.js`, `ui.js`, `settings.js`).
   - Implementar componentes: `Navbar.js`, `SearchBar.js`, `GameCard.js`, `GameLibrary.js`, `GameManager.js`, `FloatingGameWindow.js`, `ToastContainer.js`.
   - Implementar vistas: `HomeView.js`, `LibraryView.js`, `UploadView.js`, `MyGamesView.js`, `SettingsView.js`, `AuthView.js`.
5. **Pruebas Integrales**:
   - Compilación y verificación de ejecución simultánea de Express y JSON Server.
   - Búsqueda en tiempo real por título, categoría y etiquetas.
   - Prueba de apertura de cada uno de los 5 juegos en la ventana flotante (arrastrar, minimizar, maximizar, cerrar).
   - Prueba de login, registro, subida de archivos múltiples y control de autoría en GameManager.
