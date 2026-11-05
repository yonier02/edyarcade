export default {
  name: 'SandboxCodeTester',
  emits: ['loadTemplate'],
  setup(props, { emit }) {
    const templates = [
      {
        id: 'math',
        name: '⚡ Plantilla Operaciones Matemáticas',
        title: 'Desafío Mental Rápido',
        category: 'Matemáticas',
        html: `<div class="quiz-box">\n  <h3>¿Cuánto es 14 × 6 - 8?</h3>\n  <div class="opts">\n    <button onclick="check(76)">76</button>\n    <button onclick="check(84)">84</button>\n    <button onclick="check(92)">92</button>\n  </div>\n  <p id="res"></p>\n</div>`,
        css: `body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #FEF3C7; }\n.quiz-box { background: #FFF; border: 3px solid #0F172A; padding: 24px; border-radius: 12px; box-shadow: 4px 4px 0px #0F172A; text-align: center; }\n.opts { display: flex; gap: 10px; margin-top: 14px; justify-content: center; }\nbutton { padding: 10px 18px; font-weight: bold; border: 2px solid #0F172A; border-radius: 6px; background: #E0F2FE; cursor: pointer; }\nbutton:hover { background: #BAE6FD; }\n#res { margin-top: 12px; font-weight: bold; font-size: 1.1rem; }`,
        js: `function check(ans) {\n  const el = document.getElementById('res');\n  if (ans === 76) {\n    el.textContent = '🎉 ¡Correcto! 14 × 6 = 84, y 84 - 8 = 76.';\n    el.style.color = '#059669';\n  } else {\n    el.textContent = '❌ Incorrecto. ¡Calcula de nuevo!';\n    el.style.color = '#DC2626';\n  }\n}`
      },
      {
        id: 'science',
        name: '🧪 Plantilla Quiz de Química',
        title: 'Identifica el Elemento',
        category: 'Química',
        html: `<div class="card">\n  <h2>Elemento: Símbolo 'Au'</h2>\n  <p>¿A qué elemento de la tabla periódica corresponde?</p>\n  <button onclick="ans('Plata')">Plata</button>\n  <button onclick="ans('Oro')">Oro</button>\n  <button onclick="ans('Cobre')">Cobre</button>\n  <div id="feedback"></div>\n</div>`,
        css: `body { font-family: sans-serif; background: #E0F2FE; display: flex; justify-content: center; align-items: center; height: 100vh; }\n.card { background: #FFF; border: 3px solid #0F172A; padding: 20px; border-radius: 10px; box-shadow: 3px 3px 0px #0F172A; text-align: center; }\nbutton { margin: 6px; padding: 8px 16px; font-weight: 800; border: 2px solid #0F172A; border-radius: 6px; background: #FEF08A; cursor: pointer; }\n#feedback { margin-top: 14px; font-weight: 800; }`,
        js: `function ans(val) {\n  const f = document.getElementById('feedback');\n  if (val === 'Oro') {\n    f.textContent = '✨ ¡Exacto! Del latín aurum (brillante amanecer).';\n    f.style.color = '#D97706';\n  } else {\n    f.textContent = '❌ No es correcto. El símbolo Au viene del latín aurum.';\n    f.style.color = '#EF4444';\n  }\n}`
      }
    ];

    const pick = (tpl) => {
      emit('loadTemplate', tpl);
    };

    return {
      templates,
      pick
    };
  },
  template: `
    <div class="sticker-card" style="padding: 20px; background: var(--bg-surface-alt); margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span class="sticker-badge" style="background: var(--accent-yellow); color: #0F172A; font-weight: 800; font-size: 0.75rem;">
          💡 ASISTENTE DE CÓDIGO
        </span>
        <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700;">
          Carga una estructura base funcional con 1 clic
        </span>
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 10px;">
        <button 
          v-for="tpl in templates" 
          :key="tpl.id"
          type="button"
          @click="pick(tpl)"
          class="sticker-btn btn-neutral"
          style="padding: 8px 14px; font-size: 0.85rem;"
        >
          {{ tpl.name }}
        </button>
      </div>
    </div>
  `
};
