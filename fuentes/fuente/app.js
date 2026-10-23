/* Krexon · apartados de maquinaria: despliegue de cada máquina y fichas PDF */
(function(){
  'use strict';
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const secciones = [...document.querySelectorAll('.flat')];

  /* ENVÍO DE FORMULARIOS — un único punto para los tres formularios (contacto, servicio técnico, automatización).
     Mientras ENVIO.url esté vacío, se abre el programa de correo del usuario (no hay servidor conectado).
     Cuando haya destino (servicio de formularios o servidor de Krexon), basta con rellenar ENVIO.url. */
  const ENVIO = {
    url: '',                         // p. ej. 'https://api.krexon.com/contacto' o la URL de un servicio de formularios
    email: 'info@krexon.com',        // se usa solo mientras url esté vacío
    telefono: '+34 623 968 619'
  };
  /* origen: 'contacto' | 'servicio-tecnico' | 'automatizacion' · asunto: texto corto · datos: { etiqueta: valor } · estado: callback(texto, tipo) */
  function enviarSolicitud(origen, asunto, datos, hp, estado) {
    if (hp) return;                  // campo trampa para spam: una persona no lo rellena
    const cuerpo = Object.keys(datos).map(k => k + ': ' + (datos[k] || '—')).join('\n');
    const respaldo = 'Si lo prefieres, escríbenos a ' + ENVIO.email + ' o llámanos al ' + ENVIO.telefono + '.';
    if (!ENVIO.url) {
      estado('Hemos preparado el correo en tu programa de correo. Revísalo y pulsa enviar. Si no se abre, escríbenos a ' + ENVIO.email + ' o llámanos al ' + ENVIO.telefono + '.', '');
      location.href = 'mailto:' + ENVIO.email + '?subject=' + encodeURIComponent(asunto) + '&body=' + encodeURIComponent(cuerpo);
      return;
    }
    estado('Enviando…', '');
    fetch(ENVIO.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ origen: origen, asunto: asunto, datos: datos, pagina: location.href })
    }).then(r => {
      if (!r.ok) throw new Error(r.status);
      estado('¡Gracias! Hemos recibido tu solicitud y te contactaremos lo antes posible.', 'ok');
    }).catch(() => {
      estado('No hemos podido enviar tu solicitud. ' + respaldo, 'err');
    });
  }

  secciones.forEach(sec => {
    const cards = [...sec.querySelectorAll('.mcard')];
    const btns = [...sec.querySelectorAll('.mcard-btn')];
    const panels = [...sec.querySelectorAll('.mdetail')];
    const txt = (b, on) => { b.querySelector('span').textContent = on ? 'Ocultar información' : 'Ver información'; };

    function abrir(id) {
      panels.forEach(p => { p.hidden = p.id !== 'md-' + id; });
      btns.forEach(b => { const on = b.dataset.open === id; b.setAttribute('aria-expanded', on); txt(b, on); });
      cards.forEach(c => c.classList.toggle('is-open', c.dataset.m === id));
      const p = document.getElementById('md-' + id);
      if (p) p.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
    }
    function cerrar(devolverFoco) {
      const abierto = panels.find(p => !p.hidden);
      panels.forEach(p => { p.hidden = true; });
      btns.forEach(b => { b.setAttribute('aria-expanded', 'false'); txt(b, false); });
      cards.forEach(c => c.classList.remove('is-open'));
      if (abierto && devolverFoco) {
        const b = btns.find(x => 'md-' + x.dataset.open === abierto.id);
        if (b) { b.focus({ preventScroll: true }); b.closest('.mcard').scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'center' }); }
      }
    }
    btns.forEach(b => b.addEventListener('click', e => {
      e.stopPropagation();
      b.getAttribute('aria-expanded') === 'true' ? cerrar(false) : abrir(b.dataset.open);
    }));
    // pulsar en cualquier parte de la tarjeta también abre su información
    cards.forEach(c => c.addEventListener('click', e => {
      if (e.target.closest('button,a')) return;
      c.querySelector('.mcard-btn').click();
    }));
    panels.forEach(p => p.querySelector('[data-close]').addEventListener('click', () => cerrar(true)));
    sec.addEventListener('keydown', e => { if (e.key === 'Escape' && panels.some(p => !p.hidden)) cerrar(true); });
  });

  /* Botones de PDF: descargan la ficha si existe; si aún no está subida, avisan con claridad */
  let timer = 0;
  document.querySelectorAll('[data-pdf]').forEach(a => a.addEventListener('click', async e => {
    e.preventDefault();
    const href = a.getAttribute('href');
    let ok = false;
    try { const r = await fetch(href, { method: 'HEAD', cache: 'no-store' }); ok = r.ok && /pdf/i.test(r.headers.get('content-type') || ''); } catch (_) {}
    if (ok) { const d = document.createElement('a'); d.href = href; d.download = ''; document.body.appendChild(d); d.click(); d.remove(); return; }
    const box = (a.closest('section') || document).querySelector('.pdf-msg');
    if (!box) return;
    box.textContent = 'La ficha en PDF de esta máquina estará disponible próximamente. Mientras tanto, solicítala a nuestro equipo en info@krexon.com o en el teléfono +34 623 968 619.';
    box.hidden = false; clearTimeout(timer); timer = setTimeout(() => { box.hidden = true; }, 9000);
    box.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'nearest' });
  }));

  /* Formulario de automatización: validación real; el envío prepara un correo (no hay servidor conectado) */
  const form = document.getElementById('autoForm');
  if (form) {
    const $ = id => document.getElementById(id);
    const status = $('afStatus');
    const reglas = [
      ['af-nombre', 'af-e-nombre', v => v.trim().length >= 2 || 'Escribe tu nombre (mínimo 2 caracteres).'],
      ['af-email', 'af-e-email', v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Introduce un email válido, por ejemplo nombre@empresa.com.'],
      ['af-tel', 'af-e-tel', v => v.trim() === '' || /^[+()\d\s.-]{7,20}$/.test(v.trim()) || 'Introduce un teléfono válido o déjalo en blanco.'],
      ['af-msg', 'af-e-msg', v => v.trim().length >= 10 || 'Cuéntanos brevemente qué quieres automatizar (mínimo 10 caracteres).'],
      ['af-ok', 'af-e-ok', (v, el) => el.checked || 'Debes aceptar para que podamos responderte.']
    ];
    function comprobar(r, mostrar) {
      const el = $(r[0]), err = $(r[1]), res = r[2](el.value, el), ok = res === true;
      if (mostrar) {
        err.textContent = ok ? '' : res;
        el.setAttribute('aria-invalid', String(!ok));
        el.closest('.af-field').classList.toggle('has-error', !ok);
      }
      return ok;
    }
    reglas.forEach(r => {
      const el = $(r[0]);
      el.addEventListener('blur', () => { if (el.value !== '' || el.type === 'checkbox') comprobar(r, true); });
      el.addEventListener('input', () => { if (el.closest('.af-field').classList.contains('has-error')) comprobar(r, true); });
      el.addEventListener('change', () => { if (el.type === 'checkbox') comprobar(r, true); });
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const fallos = reglas.filter(r => !comprobar(r, true));
      if (fallos.length) {
        status.className = 'af-status is-err'; status.hidden = false;
        status.textContent = 'Revisa los campos marcados para poder preparar tu consulta.';
        $(fallos[0][0]).focus();
        return;
      }
      const v = id => $(id).value.trim();
      const asunto = 'Consulta de automatización' + (v('af-empresa') ? ' · ' + v('af-empresa') : ' · ' + v('af-nombre'));
      enviarSolicitud('automatizacion', asunto, {
        'Nombre': v('af-nombre'), 'Empresa': v('af-empresa'), 'Email': v('af-email'), 'Teléfono': v('af-tel'), '¿Qué quiere automatizar?': v('af-msg')
      }, v('af-web'), (t, tipo) => { status.className = 'af-status' + (tipo === 'err' ? ' is-err' : ''); status.hidden = false; status.textContent = t; });
    });
  }

  /* Recambios / servicio técnico: asistente en 3 pasos; el envío prepara un correo (no hay servidor conectado) */
  const sf = document.getElementById('stForm');
  if (sf) {
    const g = id => document.getElementById(id);
    const sel = n => { const r = sf.querySelector('input[name="' + n + '"]:checked'); return r ? r.value : ''; };
    const resumen = g('stResumen'), status = g('stStatus');
    function pintarResumen() {
      const t = sel('st-tipo'), m = sel('st-maq');
      resumen.innerHTML = (t || m)
        ? 'Tu solicitud: <b>' + (t || '—') + '</b> · máquina: <b>' + (m || '—') + '</b>'
        : 'Elige arriba qué necesitas y para qué máquina.';
    }
    sf.querySelectorAll('input[type=radio]').forEach(r => r.addEventListener('change', () => {
      pintarResumen();
      const fs = r.closest('fieldset'); fs.classList.remove('has-error');
      g(r.name === 'st-tipo' ? 'st-e-tipo' : 'st-e-maq').textContent = '';
    }));
    const campos = [
      ['st-nombre', 'st-e-nombre', v => v.trim().length >= 2 || 'Escribe tu nombre.'],
      ['st-tel', 'st-e-tel', v => /^[+()\d\s.-]{7,20}$/.test(v.trim()) || 'Escribe un teléfono válido para poder llamarte.'],
      ['st-email', 'st-e-email', v => v.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Introduce un email válido o déjalo en blanco.'],
      ['st-msg', 'st-e-msg', v => v.trim().length >= 10 || 'Cuéntanos brevemente qué necesitas (mínimo 10 caracteres).'],
      ['st-ok', 'st-e-ok', (v, el) => el.checked || 'Debes aceptar para que podamos responderte.']
    ];
    function check(c, show) {
      const el = g(c[0]), res = c[2](el.value, el), ok = res === true;
      if (show) { g(c[1]).textContent = ok ? '' : res; el.setAttribute('aria-invalid', String(!ok)); el.closest('.st-field').classList.toggle('has-error', !ok); }
      return ok;
    }
    campos.forEach(c => {
      const el = g(c[0]);
      el.addEventListener('blur', () => { if (el.value !== '' || el.type === 'checkbox') check(c, true); });
      el.addEventListener('input', () => { if (el.closest('.st-field').classList.contains('has-error')) check(c, true); });
      el.addEventListener('change', () => { if (el.type === 'checkbox') check(c, true); });
    });
    sf.addEventListener('submit', e => {
      e.preventDefault();
      const fallos = [];
      [['st-tipo', 'st-e-tipo', 'Elige qué necesitas.'], ['st-maq', 'st-e-maq', 'Elige para qué tipo de máquina.']].forEach(x => {
        const fs = sf.querySelector('input[name="' + x[0] + '"]').closest('fieldset');
        if (!sel(x[0])) { fs.classList.add('has-error'); g(x[1]).textContent = x[2]; fallos.push(sf.querySelector('input[name="' + x[0] + '"]')); }
      });
      campos.forEach(c => { if (!check(c, true)) fallos.push(g(c[0])); });
      if (fallos.length) {
        status.className = 'st-status is-err'; status.hidden = false;
        status.textContent = 'Revisa los pasos marcados para poder preparar tu solicitud.';
        fallos[0].focus(); return;
      }
      const v = id => g(id).value.trim();
      const asunto = sel('st-tipo') + ' · ' + sel('st-maq') + (v('st-empresa') ? ' · ' + v('st-empresa') : ' · ' + v('st-nombre'));
      enviarSolicitud('servicio-tecnico', asunto, {
        'Necesita': sel('st-tipo'), 'Máquina': sel('st-maq'), 'Modelo / nº de serie': v('st-modelo'),
        'Nombre': v('st-nombre'), 'Empresa': v('st-empresa'), 'Teléfono': v('st-tel'), 'Email': v('st-email'), 'Mensaje': v('st-msg')
      }, v('st-web'), (t, tipo) => { status.className = 'st-status' + (tipo === 'err' ? ' is-err' : ''); status.hidden = false; status.textContent = t; });
    });
  }

  /* Contacto: formulario corto con validación; el envío prepara un correo (no hay servidor conectado) */
  const cf = document.getElementById('ctForm');
  if (cf) {
    const g = id => document.getElementById(id), status = g('ctStatus');
    const reglas = [
      ['ct-nombre', 'ct-e-nombre', v => v.trim().length >= 2 || 'Escribe tu nombre.'],
      ['ct-tel', 'ct-e-tel', v => /^[+()\d\s.-]{7,20}$/.test(v.trim()) || 'Escribe un teléfono válido para poder llamarte.'],
      ['ct-msg', 'ct-e-msg', v => v.trim().length >= 5 || 'Escribe un breve mensaje.'],
      ['ct-ok', 'ct-e-ok', (v, el) => el.checked || 'Debes aceptar para que podamos responderte.']
    ];
    function comprobar(r, mostrar) {
      const el = g(r[0]), res = r[2](el.value, el), ok = res === true;
      if (mostrar) { g(r[1]).textContent = ok ? '' : res; el.setAttribute('aria-invalid', String(!ok)); el.closest('.ct-field').classList.toggle('has-error', !ok); }
      return ok;
    }
    reglas.forEach(r => {
      const el = g(r[0]);
      el.addEventListener('blur', () => { if (el.value !== '' || el.type === 'checkbox') comprobar(r, true); });
      el.addEventListener('input', () => { if (el.closest('.ct-field').classList.contains('has-error')) comprobar(r, true); });
      el.addEventListener('change', () => { if (el.type === 'checkbox') comprobar(r, true); });
    });
    cf.addEventListener('submit', e => {
      e.preventDefault();
      const fallos = reglas.filter(r => !comprobar(r, true));
      if (fallos.length) {
        status.className = 'ct-status is-err'; status.hidden = false;
        status.textContent = 'Revisa los campos marcados para poder preparar tu mensaje.';
        g(fallos[0][0]).focus(); return;
      }
      const v = id => g(id).value.trim();
      enviarSolicitud('contacto', 'Consulta desde la web · ' + v('ct-nombre'), {
        'Nombre': v('ct-nombre'), 'Teléfono': v('ct-tel'), 'Mensaje': v('ct-msg')
      }, v('ct-web'), (t, tipo) => { status.className = 'ct-status' + (tipo === 'err' ? ' is-err' : ''); status.hidden = false; status.textContent = t; });
    });
  }

  /* Página «Maquinaria»: al pasar el ratón (o llegar con el teclado) por una línea, se muestra su vista previa */
  (function indiceMaquinaria() {
    const sec = document.getElementById('maquinaria');
    if (!sec || !sec.classList.contains('mq')) return;
    const links = [...sec.querySelectorAll('.mq-list a')], panels = [...sec.querySelectorAll('.mq-panel')];
    function activar(id) {
      links.forEach(a => a.classList.toggle('is-on', a.dataset.mq === id));
      panels.forEach(p => p.classList.toggle('is-on', p.dataset.mq === id));
    }
    links.forEach(a => {
      a.addEventListener('mouseenter', () => activar(a.dataset.mq));
      a.addEventListener('focus', () => activar(a.dataset.mq));
    });
  })();

  /* Vistas: solo se ve una sección a la vez; la dirección (#plegadoras…) y el botón atrás funcionan */
  (function vistas() {
    const views = [...document.querySelectorAll('.view')];
    const ids = new Set(views.map(v => v.id));
    const maquina = new Set(['corte-plano', 'corte-tubos', 'corte-combinado', 'soldadura-limpieza', 'plegadoras', 'automatizacion', 'corte-co2', 'servicio-tecnico']);
    const vbar = document.getElementById('vbar'), chips = [...document.querySelectorAll('#vchips a')];
    const home = [...document.querySelectorAll('.view-home')];
    const tituloBase = document.title.replace(/\s*\|.*$/, '') || 'Krexon';
    const raiz = document.documentElement;
    let actual = null;
    const instantaneo = fn => { raiz.style.scrollBehavior = 'auto'; fn(); requestAnimationFrame(() => { raiz.style.scrollBehavior = ''; }); };

    const NUM = '34623968619';
    function actualizarWA(id, titulo) {
      let msg = 'Hola, me gustaría información sobre vuestras máquinas y servicios.';
      if (id === 'servicio-tecnico') msg = 'Hola, necesito recambios, consumibles o servicio técnico.';
      else if (maquina.has(id) && titulo) msg = 'Hola, me gustaría información sobre: ' + titulo + '.';
      const url = 'https://wa.me/' + NUM + '?text=' + encodeURIComponent(msg);
      document.querySelectorAll('[data-wa]').forEach(a => { a.href = url; });
    }
    function mostrar(id) {
      const dentro = !!id;
      document.body.classList.toggle('in-view', dentro);
      home.forEach(e => e.classList.toggle('is-off', dentro));
      views.forEach(v => v.classList.toggle('is-on', v.id === id));
      vbar.hidden = !dentro;
      vbar.classList.toggle('is-machine', maquina.has(id));
      chips.forEach(a => { const on = a.getAttribute('href') === '#' + id; if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); if (on) a.scrollIntoView({ block: 'nearest', inline: 'center' }); });
      document.body.dataset.menu = maquina.has(id) ? 'maquinaria' : (id || '');
      document.querySelectorAll('.menu a[href^="#"]').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + document.body.dataset.menu));
      const h2 = dentro ? document.querySelector('#' + id + ' h2') : null;
      document.title = (h2 ? h2.innerText.replace(/\s+/g, ' ').trim() + ' | ' : '') + tituloBase;
      actualizarWA(id, h2 ? h2.textContent.replace(/\s+/g, ' ').trim() : '');
      if (typeof syncHeader === 'function') syncHeader();
      if (!dentro) window.dispatchEvent(new Event('resize'));   // los lienzos del inicio se redimensionan al volver
    }
    function ruta(primera) {
      const h = decodeURIComponent(location.hash.slice(1));
      if (h === 'content') return;                               // enlace "Ir al contenido": no cambia de vista
      if (ids.has(h)) {
        if (actual !== h) {
          mostrar(h); actual = h;
          instantaneo(() => scrollTo(0, 0));
          if (!primera) { const t = document.querySelector('#' + h + ' h2'); if (t) { t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); } }
        }
        return;
      }
      const veniaDeVista = actual !== null;
      if (veniaDeVista || primera) { mostrar(null); actual = null; }
      const destino = h ? document.getElementById(h) : null;
      if (veniaDeVista || primera) instantaneo(() => { if (destino) destino.scrollIntoView(); else scrollTo(0, 0); });
    }
    addEventListener('hashchange', () => ruta(false));
    ruta(true);
  })();
})();
