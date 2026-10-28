(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  let category = 'Todos';
  function filterProjects() {
    const q = $('#search').value.trim().toLocaleLowerCase('es');
    let n = 0;
    $$('.project').forEach(p => { const show = (category === 'Todos' || p.dataset.kind === category) && p.dataset.search.includes(q); p.hidden = !show; if (show) n++; });
    $('#results').textContent = `${n} proyecto${n === 1 ? '' : 's'}`;
    $('#empty').hidden = n > 0;
  }
  $$('[data-filter]').forEach(b => b.addEventListener('click', () => {
    category = b.dataset.filter;
    $$('[data-filter]').forEach(x => { const selected = x === b; x.classList.toggle('selected', selected); x.setAttribute('aria-pressed', String(selected)); });
    filterProjects();
  }));
  $('#search').addEventListener('input', filterProjects);
  const flowTexts = [
    'La interfaz presenta el estado y solicita capacidades mediante contratos explícitos.',
    'Main conserva la autoridad; proveedores y backends se seleccionan mediante responsabilidades distintas.',
    'Las capacidades autorizadas llegan a servicios y helpers. Cada backend declara sus límites.',
    'Memoria, checkpoints y recibos permiten revisar continuidad y evidencia; respuesta correcta no implica tarea verificada.'
  ];
  $$('[data-step]').forEach(b => { b.setAttribute('aria-pressed', String(b.classList.contains('active'))); b.addEventListener('click', () => {
    $$('[data-step]').forEach(x => { x.classList.toggle('active', x === b); x.setAttribute('aria-pressed', String(x === b)); });
    $('#flow-detail').textContent = flowTexts[Number(b.dataset.step)];
  }); });
  const dialog = $('#project-dialog');
  let projectData;
  async function loadProjects() {
    if (!projectData) {
      const response = await fetch('projects.json');
      if (!response.ok) throw new Error('No se pudo cargar el catálogo.');
      projectData = await response.json();
    }
    return projectData;
  }
  $$('[data-open]').forEach(b => b.addEventListener('click', async () => {
    try {
      const p = (await loadProjects()).find(x => x.id === b.dataset.open);
      if (!p) return;
      $('#dialog-title').textContent = p.name;
      $('#dialog-kind').textContent = p.kind;
      $('#dialog-status').textContent = p.status;
      $('#dialog-description').textContent = p.desc;
      $('#dialog-problem').textContent = p.problem;
      $('#dialog-architecture').textContent = p.architecture;
      $('#dialog-limits').textContent = p.limits;
      $('#dialog-code').textContent = p.code;
      $('#dialog-repo').href = p.url;
      $('#dialog-tags').replaceChildren(...p.tech.map(t => { const x = document.createElement('span'); x.textContent = t; return x; }));
      $('#dialog-decisions').replaceChildren(...p.decisions.map(t => { const x = document.createElement('li'); x.textContent = t; return x; }));
      dialog.showModal();
    } catch (error) {
      $('#results').textContent = 'No se pudo abrir el detalle. Puedes consultar el código con el enlace de GitHub.';
    }
  }));
  $('#close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { const r = dialog.getBoundingClientRect(); if (e.target === dialog && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) dialog.close(); });
  const theme = $('#theme');
  let stored;
  try { stored = localStorage.getItem('portfolio-theme'); } catch {}
  const prefersDark = matchMedia('(prefers-color-scheme: dark)');
  function applyTheme(dark) { document.body.dataset.theme = dark ? 'dark' : 'light'; theme.setAttribute('aria-label', dark ? 'Activar tema claro' : 'Activar tema oscuro'); }
  applyTheme(stored ? stored === 'dark' : prefersDark.matches);
  theme.addEventListener('click', () => { const dark = document.body.dataset.theme !== 'dark'; applyTheme(dark); try { localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light'); } catch {} });
  $('#copy-email').addEventListener('click', async () => { try { await navigator.clipboard.writeText('leo_jesmtze11@hotmail.com'); $('#copy-status').textContent = 'Correo copiado.'; } catch { $('#copy-status').textContent = 'Correo: leo_jesmtze11@hotmail.com'; } });
  let scheduled = false;
  function progress() { scheduled = false; const max = document.documentElement.scrollHeight - innerHeight; $('.reading-progress').style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 0}%`; }
  addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(progress); } }, { passive: true });
  addEventListener('resize', progress); progress();
})();
