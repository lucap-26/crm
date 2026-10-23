# -*- coding: utf-8 -*-
"""
Genera index.html (un único archivo, con CSS y JS dentro) a partir de:
  _build/fuente/plantilla.html   estructura de la web (con el marcador <!--GEN:INI--> ... <!--GEN:FIN-->)
  _build/fuente/estilos.css      estilos
  _build/fuente/app.js           comportamiento de los apartados de maquinaria
  _build/datos.py                datos de todas las máquinas
Uso (desde la carpeta del prototipo):   python3 _build/construir.py
"""
import re, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import datos as D

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
rd = lambda f: open(os.path.join(RAIZ, f), encoding='utf8').read()
def wr(f, t): open(os.path.join(RAIZ, f), 'w', encoding='utf8').write(t)

ICONO_PDF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 11l5 5 5-5M5 21h14"/></svg>'

def tarjeta(m):
    kp = ''.join(f'<li><b>{v}</b> {l}</li>' for v, l in m['kpis'][:3])
    return f'''      <article class="mcard" data-m="{m['slug']}">
        <div class="mcard-pic"><img loading="lazy" src="{m['img']}" alt="{m['alt']}" width="600" height="390"></div>
        <div class="mcard-body">
          <span class="mcard-tag">{m['cab']}</span>
          <h3>{m['serie']}</h3>
          <ul class="mcard-kpi">{kp}</ul>
          <p class="mcard-res">{m['resumen']}</p>
          <button type="button" class="more mcard-btn" aria-expanded="false" aria-controls="md-{m['slug']}" data-open="{m['slug']}"><span>Ver información</span></button>
        </div>
      </article>
'''

def panel(m):
    feats = ''.join(f'<li>{f}</li>' for f in m['feats'])
    kp = ''.join(f'<li><b>{v}</b><span>{l}</span></li>' for v, l in m['kpis'])
    cert = '' if m['certs'] == 'Consultar' else f'<p class="mcerts"><span>Certificaciones:</span> {m["certs"]}</p>'
    return f'''    <div class="mdetail" id="md-{m['slug']}" role="region" aria-label="Información: {m['serie']}, {m['cab'].lower()}" hidden>
      <button type="button" class="mclose" data-close aria-label="Cerrar información">×</button>
      <div class="mdetail-pic"><img loading="lazy" src="{m['img']}" alt="" width="600" height="390"></div>
      <div class="mdetail-txt">
        <span class="mcard-tag">{m['cab']}</span>
        <h3>{m['serie']}</h3>
        <p>{m['intro']}</p>
        <ul class="mdetail-kpis">{kp}</ul>
        <ul class="mfeats">{feats}</ul>
        {cert}
        <div class="mactions">
          <a class="btn pdf-btn" href="{m['pdf']}" download data-pdf>{ICONO_PDF}Descargar ficha en PDF</a>
          <a class="btn btn-line" href="{D.CONTACTO}">Solicitar información</a>
        </div>
      </div>
    </div>
'''

def tabla(ap, g):
    ms = g['maquinas']
    ident = ap['id'] + ('-' + g['slug'] if g.get('slug') else '')
    th = ''.join(f'<th scope="col"><span>{m["cab"]}</span>{m["serie"]}</th>' for m in ms)
    filas = ''
    for k in g['filas']:
        tds = ''.join(f'<td data-label="{m["serie"]}">{m["specs"].get(k, "Consultar")}</td>' for m in ms)
        filas += f'          <tr><th scope="row">{k}</th>{tds}</tr>\n'
    pie = ''.join(f'<td data-label="{m["serie"]}"><a class="btn pdf-btn" href="{m["pdf"]}" download data-pdf>{ICONO_PDF}Descargar PDF</a></td>' for m in ms)
    return f'''    <details class="cmp-det">
      <summary id="cmp-{ident}"><span>{g['cmp']}</span></summary>
    <div class="cmp-wrap" role="region" aria-labelledby="cmp-{ident}" tabindex="0">
      <table class="cmp">
        <thead><tr><td></td>{th}</tr></thead>
        <tbody>
{filas}        </tbody>
        <tfoot><tr><th scope="row">Ficha completa</th>{pie}</tr></tfoot>
      </table>
    </div>
    <p class="cmp-note">{g['nota']}</p>
    </details>
'''

def grupos(ap):
    # un apartado puede tener varios grupos (p. ej. soldadura y limpieza); si no, es un único grupo
    if ap.get('grupos'):
        return ap['grupos']
    return [dict(titulo=None, maquinas=ap['maquinas'], filas=ap['filas'], cmp=ap['cmp'], nota=ap['nota'])]

def bloque_grupo(ap, g, i):
    n = len(g['maquinas'])
    cards = ''.join(tarjeta(m) for m in g['maquinas'])
    panels = ''.join(panel(m) for m in g['maquinas'])
    g = dict(g, slug=(None if len(grupos(ap)) == 1 else str(i + 1)))
    tit = f'    <h3 class="grp-title">{g.get("titulo") or ""}</h3>\n' if (g.get('titulo') and len(grupos(ap)) > 1) else ''
    if tit: pass
    return f'''{tit}    <div class="mgrid mgrid-{n}">
{cards}    </div>

{panels}
{tabla(ap, g)}'''

def seccion(ap):
    gs = grupos(ap)
    cuerpo = '\n'.join(bloque_grupo(ap, g, i) for i, g in enumerate(gs))
    gen = ''
    if ap.get('general'):
        items = ''.join(f'<li><b>{t}</b><span>{d}</span></li>' for t, d in ap['general'])
        gen = f'    <ul class="flat-gen">{items}</ul>\n'
    return f'''<!-- {ap['titulo'].upper()} -->
<section id="{ap['id']}" class="flat view" aria-labelledby="h-{ap['id']}">
  <div class="wrap">
    <div class="flat-head">
      <span class="eyebrow">Maquinaria</span>
      <h2 id="h-{ap['id']}">{ap['titulo']}</h2>
      <p class="flat-lead">{ap['lead']}</p>
    </div>
{gen}    <p class="flat-step">{ap['paso']}</p>
{cuerpo}    <p class="pdf-msg" role="status" aria-live="polite" hidden></p>
  </div>
</section>
'''

t = rd('_build/fuente/plantilla.html')
gen = '\n'.join(seccion(ap) for ap in D.APARTADOS if ap['num'] < '06')
gen_post = '\n'.join(seccion(ap) for ap in D.APARTADOS if ap['num'] > '06')
t = re.sub(r'<!--GEN:INI-->.*?<!--GEN:FIN-->', lambda m: '<!--GEN:INI-->\n' + gen + '<!--GEN:FIN-->', t, flags=re.S)
t = re.sub(r'<!--GEN2:INI-->.*?<!--GEN2:FIN-->', lambda m: '<!--GEN2:INI-->\n' + gen_post + '<!--GEN2:FIN-->', t, flags=re.S)
css = rd('_build/fuente/estilos.css'); js = rd('_build/fuente/app.js')
t = t.replace('<link rel="stylesheet" href="assets/estilos.css">', '<style>\n' + css + '\n</style>')
t = t.replace('<!--APP-JS-->', '<script>\n' + js + '\n</script>')
# espacio duro entre cifra y unidad, para que no se separen en dos líneas
t = re.sub(r'(\d) (kW|KW|W|mm|kg|kN|m/min|m/s|Hz|V|G|%)(?![\w])', lambda m: m.group(1) + '\u00a0' + m.group(2), t)
wr('index.html', t)

# Versión 2 (tema 'Contención arquitectónica'): mismo contenido, otro aspecto -> index-v2.html
css2 = css + '\n' + rd('_build/fuente/tema-v2.css')
t2 = t.replace(css, css2, 1)
t2 = re.sub(r'<link href="https://fonts\.googleapis\.com/css2\?family=Syne[^>]*>', '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">', t2)
t2 = t2.replace('<meta name="theme-color" content="#0F172A">', '<meta name="theme-color" content="#21211e">')
wr('index-v2.html', t2)

# Versión 3 (DESIGN-krexon.md, referencia TCI) -> index-v3.html
t3 = t.replace(css, css + '\n' + rd('_build/fuente/tema-v3.css'), 1)
t3 = re.sub(r'<link href="https://fonts\.googleapis\.com/css2\?family=Syne[^>]*>', '<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Archivo:wdth,wght@125,700;125,800&display=swap" rel="stylesheet">', t3)
t3 = t3.replace('<meta name="theme-color" content="#0F172A">', '<meta name="theme-color" content="#1c1c1c">')
# v3: las baldosas de máquinas salen del vídeo de portada y pasan a su propia sección,
# después de los datos y los accesos (Nosotros, Servicios, Contacto) y antes del banner final
m = re.search(r'    <!-- Accesos directos a cada línea de maquinaria -->\n(    <nav class="pick".*?</nav>\n)', t3, flags=re.S)
if m:
    pick = re.sub(r'\s*<span class="pick-title">.*?</span>', '', m.group(1), count=1)
    t3 = t3.replace(m.group(0), '', 1)
    seccion_pick = ('<!-- ELIGE TU MÁQUINA -->\n<section class="pick-sec view-home" aria-labelledby="h-pick">\n  <div class="wrap">\n'
                    '    <div class="pick-head">\n      <span class="eyebrow">Maquinaria</span>\n      <h2 id="h-pick">Tecnologías disponibles</h2>\n    </div>\n'
                    + pick + '  </div>\n</section>\n\n')
    t3 = t3.replace('<!-- BANNER FINAL -->', seccion_pick + '<!-- BANNER FINAL -->', 1)
else:
    print('AVISO: no se encontró el bloque de baldosas')
wr('index-v3.html', t3)
print('index.html generado:', len(t) // 1024, 'KB;', sum(len(g['maquinas']) for a in D.APARTADOS for g in grupos(a)), 'máquinas')
