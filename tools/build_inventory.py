#!/usr/bin/env python3
"""Generate 0OFFLINE/inventario.html: the whole repository on one page.

    python3 tools/build_inventory.py

Why it lives in 0OFFLINE: it indexes the workshop too, and the workshop is not
published. 0OFFLINE is the house convention for "this does not go out", so a page
placed there cannot leak by being deployed.

Two things it marks, and they are the point of the page:
  - what git does NOT carry (.gitignore), so it is on disk in one place only
  - what the deploy does NOT publish (despliegue.yaml excluye:)

2026 Alejandro Rojo Gualix - MIT
"""

import html
import os
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, '0OFFLINE', 'inventario.html')

# Curated descriptions. A bare file listing says nothing; what costs time to
# rediscover is what each thing IS. Keys are paths relative to the repo root.
NOTES = {
    'index.html': 'La puerta. Enlaza todo lo publicable.',
    'analysis.html': 'El visor de UN carácter: descomposición, taxogrid y navegador radial. Los árboles se fueron a browse.html.',
    'analysis.js': 'Recorre la descomposición y anota recursividad. Aquí se mide la divisibilidad.',
    'article.html': 'El artículo, en inglés: «Recursion in Chinese phonosemantograms». Traducción de article.es.html.',
    'article.es.html': 'El artículo, y el original: «Recursividad en los fonosemagramas chinos». Manda este.',
    'phonetictree.js': 'Árboles ascendentes, las dos vistas. Vive en browse.html: es vista del conjunto, no del carácter.',
    'phonetictree.css': 'Estilo de los árboles. El color dice qué estadio de la lengua justifica el enlace.',
    'radialdiagram.js': 'Diagrama radial con d3 v3. Llevaba años con «dominant-middle», que no es atributo SVG.',
    'logogramselector.js': 'El selector modal: recorrer por radicales y por componentes semánticos.',
    'data/derivedmergeddata.js': '9574 entradas. Es EL dato: la fusión de todas las fuentes.',
    'browse.html': 'El conjunto entero en una tabla: particiones, escalas, filtros, selector de columnas, pegar una lista, y los árboles.',
    'browse.js': 'El motor de la exploración. Deriva las tres divisibilidades, el papel en el sistema y el acuerdo con Karlgren.',
    'browse.css': 'Estilo de la exploración.',
    'graphemesCulturalHints.html': 'Grafemas cuya composición guarda algo de la cultura que los dibujó. En inglés.',
    'graphemesCulturalHints.es.html': 'Las mismas pistas culturales, y el original en castellano.',
    'SOURCES.md': 'De dónde sale cada campo, con qué licencia, cuánto de cada fuente se quedó fuera y en qué siete puntos se contradicen.',
    'sources.html': 'La misma página, generada desde SOURCES.md por tools/build_sources.py.',
    'tools/build_sources.py': 'Convierte SOURCES.md en sources.html. Se niega a convertir lo que no entiende, en vez de descartarlo.',
    'tools/graph_export.py': 'Exporta familias al formato del basic_graph_editor, una por fichero.',
    'tools/editor-config.json': 'Categorías, colores y tooltip para el editor de grafos.',
    'tools/build_inventory.py': 'Genera esta misma página.',
    'tools/build_stats.py': 'Mide el corpus entero y reescribe el bloque de estadísticas del README. Las cifras se generan, no se teclean.',
    'tools/binarydivision/binarydivision.html': 'Dibuja una expresión con corchetes como división del espacio.',

    '0OFFLINE/article.md': 'El original del artículo, en Markdown. De aquí salió article.es.html.',
    '0OFFLINE/article RESTOS.md': 'Lo que se cayó del artículo al montarlo. Material escrito y sin publicar.',
    '0OFFLINE/readme.md': 'Borrador del README, anterior al cambio de licencia: todavía dice CC BY-NC.',
    '0OFFLINE/SOURCES.txt': 'Versión más completa que la publicada: incluye el crédito a D3.js.',
    '0OFFLINE/graphemesCulturalHints.md': 'El original de las pistas culturales.',
    '0OFFLINE/MODIFICABASEDATOS.html': 'Herramienta de edición del dato. Cómo se construyó derivedmergeddata.',
    '0OFFLINE/DataTables_dynamic.html': 'La dinámica que nunca se publicó. Fue el punto de partida de browse.html.',
    '0OFFLINE/tablas-estaticas-sustituidas/LEEME.md': 'Qué sustituyó a cada una de las siete páginas retiradas, con su enlace equivalente.',
    '0OFFLINE/radialdiagram.html': 'Banco de pruebas del diagrama radial, suelto.',

    '0OFFLINE/data/1/dictionary.js': 'makemeahanzi: el diccionario de origen. Su COPYING es LGPL.',
    '0OFFLINE/data/1/graphics.json': 'makemeahanzi: los trazos de cada carácter, 30 MB.',
    '0OFFLINE/data/1/COPYING': 'La LGPL de makemeahanzi. Viaja con el dato y es la razón de conservarlo.',
    '0OFFLINE/data/BaxterSagart/BaxterSagartOC2015-10-13.xlsx': 'La reconstrucción del chino antiguo, tal como se descargó de Michigan.',
    '0OFFLINE/data/BaxterSagart/BaxterSagart.js': 'La misma, ya convertida para la aplicación.',
    '0OFFLINE/data/wikimedia/Chinese characters decomposition.ods': 'La descomposición gráfica de Wikimedia Commons, hoja de cálculo original.',
    '0OFFLINE/data/derivedmergeddata2.js': 'Una fusión anterior del dato. Se conserva por si hiciera falta rehacer el camino.',
    '0OFFLINE/data/Anomalías.ods': 'Las anomalías encontradas al cruzar las fuentes.',
    '0OFFLINE/data/incidencias correlate CRÍTICAS.csv': 'Las discrepancias graves entre fuentes al correlacionarlas.',
    '0OFFLINE/data/incidencias correlate TODAS.csv': 'Todas las discrepancias, no solo las graves.',

    '0OFFLINE/mi análisis/ConclusionsGraphic2Recursivity.md': (
        '⭐ El resultado hermano y sin publicar: la recursividad de la descomposición '
        'GRÁFICA llega a 7, y la alcanzan 擲 y 躑. La etimológica, que es la del '
        'artículo, se queda en 4. Por eso 躑 es el carácter que analysis.html trae puesto.'),
    '0OFFLINE/mi análisis/A_Metaphorical_Study_on_Chines.pdf': 'Artículo de terceros, leído para el análisis.',
    '0OFFLINE/mi análisis/radicales y semantogramas 1 3 11.odt': 'Notas sobre radicales frente a componentes semánticos.',
    '0OFFLINE/mi análisis/apartado/totalidad EN RESERVA.js': 'Dato apartado, en reserva. No entró en la fusión.',
    '0OFFLINE/d3/data_dendrogram.json': 'Pruebas de dendrograma con d3, previas al diagrama radial.',
    '0OFFLINE/TRABAJO/grafemas culturales.ods': 'La hoja de trabajo de donde salieron las pistas culturales.',
}

# Sections, in reading order: what it is, and which paths fall in it.
SECTIONS = [
    ('Puertas', 'Lo que se abre con doble clic.',
     lambda p: p in ('index.html', 'analysis.html', 'browse.html', 'article.html',
                     'article.es.html', 'graphemesCulturalHints.html',
                     'graphemesCulturalHints.es.html', 'sources.html')),
    ('Aplicación', 'El código propio que mueve el visor.',
     lambda p: '/' not in p and p.endswith(('.js', '.css'))),
    ('Dato', 'La base sobre la que se mide todo.',
     lambda p: p.startswith('data/')),
    ('Herramientas', 'Lo que se ejecuta desde la consola, y la división binaria.',
     lambda p: p.startswith('tools/')),
    ('Figuras', 'Las imágenes que usan las páginas.',
     lambda p: p.startswith('img/graphemes/')),
    ('Compartido', 'Bibliotecas propias y de terceros, y las hojas de estilo.',
     lambda p: p.split('/')[0] in ('js', 'jsexternal', 'style', 'img')),
    ('Documentos', 'Los cuatro de la casa, la licencia y las capturas del README.',
     lambda p: p.endswith('.md') or p in ('LICENSE', '.gitignore')
     or (p.startswith('capture') and p.endswith('.png'))),
    ('Taller (0OFFLINE)', 'Lo no publicable: materia prima, borradores y análisis.',
     lambda p: p.startswith('0OFFLINE/')),
]


def ignored_by_git(paths):
    """Ask git itself, instead of reimplementing .gitignore matching."""
    if not paths:
        return set()
    try:
        r = subprocess.run(['git', '-C', ROOT, 'check-ignore', '--stdin'],
                           input='\n'.join(paths), capture_output=True, text=True)
        return set(r.stdout.split('\n')) - {''}
    except Exception:
        return set()


def human(n):
    for unit in ('B', 'KB', 'MB'):
        if n < 1024 or unit == 'MB':
            return ('%.0f %s' % (n, unit)) if unit == 'B' else ('%.1f %s' % (n, unit))
        n /= 1024.0


def scan():
    files = []
    for base, dirs, names in os.walk(ROOT):
        dirs[:] = [d for d in dirs if d != '.git']
        for n in names:
            full = os.path.join(base, n)
            rel = os.path.relpath(full, ROOT).replace(os.sep, '/')
            files.append((rel, os.path.getsize(full)))
    return sorted(files)


def build():
    files = scan()
    ign = ignored_by_git([p for p, _ in files])

    # The workshop claims its files first, whatever else they look like: a .md
    # inside 0OFFLINE is a draft, not one of the four house documents, and that
    # distinction is the whole point of the page. It is still shown last.
    def workshop(p):
        return p.startswith('0OFFLINE/')

    buckets, placed = [], set()
    for title, blurb, test in SECTIONS:
        mine = test if title.startswith('Taller') else (lambda p, t=test: t(p) and not workshop(p))
        rows = [(p, s) for p, s in files if p not in placed and mine(p)]
        placed |= {p for p, _ in rows}
        buckets.append((title, blurb, rows))
    rest = [(p, s) for p, s in files if p not in placed]
    if rest:
        buckets.append(('Lo demás', 'Sin clasificar.', rest))

    total = sum(s for _, s in files)
    untracked = sum(s for p, s in files if p in ign)

    out = [HEAD]
    out.append('<h1>phsemgram · inventario</h1>')
    out.append('<p class="lede">Todo lo que hay en el repositorio, publicable y no '
               'publicable. Generado por <code>tools/build_inventory.py</code>; vive '
               'en <code>0OFFLINE/</code> para que no pueda publicarse por descuido.</p>')
    out.append('<div class="totals"><span><b>%d</b> ficheros</span>'
               '<span><b>%s</b> en total</span>'
               '<span class="warn"><b>%s</b> fuera de git</span></div>'
               % (len(files), human(total), human(untracked)))

    out.append('<nav class="toc">' + ' · '.join(
        '<a href="#s%d">%s</a>' % (i, html.escape(t))
        for i, (t, _, r) in enumerate(buckets) if r) + '</nav>')

    for i, (title, blurb, rows) in enumerate(buckets):
        if not rows:
            continue
        n = len(rows)
        size = sum(s for _, s in rows)
        out.append('<section id="s%d"><h2>%s <span class="count">%d ficheros · %s</span></h2>'
                   % (i, html.escape(title), n, human(size)))
        out.append('<p class="blurb">%s</p>' % html.escape(blurb))
        out.append('<table>')
        for p, s in rows:
            note = NOTES.get(p, '')
            cls = ' class="ign"' if p in ign else ''
            flag = '<span class="tag" title="no lo lleva git">sin versionar</span>' if p in ign else ''
            href = os.path.relpath(os.path.join(ROOT, p), os.path.dirname(OUT)).replace(os.sep, '/')
            out.append('<tr%s><td class="p"><a href="%s">%s</a>%s</td>'
                       '<td class="s">%s</td><td class="n">%s</td></tr>'
                       % (cls, html.escape(href), html.escape(p), flag, human(s),
                          note if note.startswith('⭐') or note.startswith('⚠')
                          else html.escape(note)))
        out.append('</table></section>')

    out.append('</main></body></html>')
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write('\n'.join(out))
    print('%s  ·  %d ficheros, %s, %s sin versionar'
          % (os.path.relpath(OUT, ROOT), len(files), human(total), human(untracked)))


HEAD = '''<!DOCTYPE html>
<html lang="es">

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>phsemgram · inventario</title>
<style>
:root { --bg:#fbfaf8; --fg:#242220; --dim:#6d6862; --line:#ddd8d0; --warn:#b06a20; --star:#1d7a66; }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { --bg:#1d1d1d; --fg:#e8e5e0; --dim:#9b958d; --line:#3a3733; --warn:#e0a860; --star:#6fd3c0; }
}
* { box-sizing: border-box; }
body { margin:0; background:var(--bg); color:var(--fg);
       font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; }
main { max-width:60em; margin:0 auto; padding:2em 1.2em 5em; }
h1 { font-size:1.5em; margin:0 0 .3em; }
.lede { color:var(--dim); margin:0 0 1.4em; max-width:46em; }
.totals { display:flex; flex-wrap:wrap; gap:1.6em; padding:.8em 0;
          border-top:1px solid var(--line); border-bottom:1px solid var(--line); }
.totals span { color:var(--dim); }
.totals b { color:var(--fg); font-size:1.15em; }
.totals .warn b { color:var(--warn); }
.toc { margin:1.4em 0 2em; color:var(--dim); font-size:.92em; }
.toc a { color:var(--dim); }
h2 { font-size:1.1em; margin:2.4em 0 .2em; padding-bottom:.3em;
     border-bottom:1px solid var(--line); }
h2 .count { float:right; font-weight:normal; font-size:.8em; color:var(--dim); }
.blurb { color:var(--dim); margin:.4em 0 .8em; }
table { width:100%; border-collapse:collapse; }
td { padding:.32em .6em .32em 0; vertical-align:top; border-bottom:1px solid var(--line); }
td.p { white-space:nowrap; font-family:ui-monospace,"DejaVu Sans Mono",monospace; font-size:.92em; }
td.s { white-space:nowrap; text-align:right; color:var(--dim); width:6em; font-variant-numeric:tabular-nums; }
td.n { color:var(--dim); }
a { color:inherit; }
tr.ign td.p a { color:var(--warn); }
.tag { margin-left:.6em; font-size:.72em; padding:.05em .45em; border-radius:.6em;
       border:1px solid var(--warn); color:var(--warn); font-family:system-ui,sans-serif; }
@media (max-width:700px) { td.p { white-space:normal; word-break:break-all; } }
</style>
</head>

<body>
<main>'''

if __name__ == '__main__':
    build()
