#!/usr/bin/env python3
"""Export the constitutive relations between logograms to the format read by
basic_graph_editor.

    python3 tools/graph_export.py --families 12 --out ../basic_graph_editor/samples

The whole graph is 9574 nodes and 13726 edges, and the largest graph the editor
has carried is the Tokyo metro, 216 nodes. So it is not exported whole: one
family per file, which is also the unit that gets studied. The largest, 工, has
60 nodes; only 53 families pass 20.

Output format, the editor's own:
    {"graphs": [{"nodes": [{id,x,y,label,type,category,description}],
                 "edges": [{from,to,label,type,category}]}]}

2026 Alejandro Rojo Gualix — MIT
"""

import argparse
import json
import os
import re
import sys
from collections import defaultdict

DATA = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                    '..', 'data', 'derivedmergeddata.js')


def load(path):
    """The data file is a JavaScript `var logograms = {...};`."""
    with open(path, encoding='utf-8') as f:
        s = f.read()
    return json.loads(s[s.index('{'):].rstrip().rstrip(';'))


def strokes(L, c):
    """len(matches) is the stroke count. Checked against 13 control characters,
    and cross-checked against Baxter-Sagart on 265 variant pairs: 261 agree."""
    return len((L.get(c) or {}).get('matches') or [])


def series(L, c):
    """Karlgren's phonetic series number, stripped of its letter suffix."""
    bs = (L.get(c) or {}).get('BaxterSagart') or {}
    m = re.match(r'\d+', bs.get('GSR') or '')
    return m.group() if m else None


def pronunciation(L, c):
    """The stage of the language that justifies the relation. Any stage counts,
    but Old Chinese goes first because it is the only one that explains the
    branch: 各 *kˤak and 落 *kə.rˤak are a family; gè and luò do not look like
    one."""
    lg = L.get(c) or {}
    bs = lg.get('BaxterSagart') or {}
    if (bs.get('OC') or '').strip():
        return (bs['OC'].strip(), 'Old Chinese', 'oc')
    if (bs.get('MC') or '').strip():
        return (bs['MC'].strip(), 'Middle Chinese', 'mc')
    if lg.get('pinyin'):
        return (', '.join(lg['pinyin']), 'modern pinyin only', 'py')
    return ('—', 'no pronunciation', 'none')


def indexes(L):
    phon, sem = defaultdict(list), defaultdict(list)
    for k, v in L.items():
        e = v.get('etymology') or {}
        if e.get('phonetic'):
            phon[e['phonetic']].append(k)
        if e.get('semantic'):
            sem[e['semantic']].append(k)
    return phon, sem


def family(root, children):
    """Nodes and edges of the ascending tree, cycles guarded: 舉 contains itself
    and made the original code recurse forever."""
    nodes, edges, seen = [], [], set()

    def walk(c, level):
        if c in seen:
            return
        seen.add(c)
        nodes.append((c, level))
        for ch in sorted(children.get(c, [])):
            if ch not in seen:
                edges.append((c, ch))
            walk(ch, level + 1)

    walk(root, 0)
    return nodes, edges


def export(L, root, children, kind):
    nodes, edges = family(root, children)

    # Layered layout: depth gives y, order within the layer gives x. The editor
    # has automatic layout (cola, dagre, elk), so this is only a sane start.
    by_level = defaultdict(list)
    for c, n in nodes:
        by_level[n].append(c)
    pos, STEP_X, STEP_Y = {}, 130, 150
    for n, cs in by_level.items():
        width = (len(cs) - 1) * STEP_X
        for i, c in enumerate(cs):
            pos[c] = (i * STEP_X - width / 2, n * STEP_Y)
    # Shift into the positive quadrant: a layer of 26 siblings is 3250 px wide
    # and, centred, would leave half the tree at negative x.
    dx = 80 - min(x for x, _ in pos.values())
    pos = {c: (x + dx, y + 80) for c, (x, y) in pos.items()}

    ident = {c: i + 1 for i, (c, _) in enumerate(nodes)}
    jnodes = []
    for c, _ in nodes:
        lg = L.get(c) or {}
        text, label, _stage = pronunciation(L, c)
        desc = ['%s   (%s)' % (text, label)]
        if lg.get('definition'):
            desc.append(lg['definition'])
        bs = lg.get('BaxterSagart')
        if bs:
            if bs.get('gloss'):
                desc.append('Baxter-Sagart gloss: ' + bs['gloss'])
            if bs.get('GSR'):
                desc.append('GSR series: ' + bs['GSR'])
        else:
            desc.append('Not attested in the classical corpus. This is where the '
                        '20th-century coinages land (氫 ammonia, 烴 hydrocarbon, '
                        '砼 concrete), which use the same procedure two thousand '
                        'years later.')
        x, y = pos[c]
        jnodes.append({
            'id': ident[c],
            'x': round(x), 'y': round(y),
            'label': c,
            'type': 0,
            'category': 'attested' if bs else 'unattested',
            'description': '\n'.join(desc),
        })

    jedges = []
    for a, b in edges:
        sa, sb = series(L, a), series(L, b)
        clash = bool(sa and sb and sa != sb)
        jedges.append({
            'from': ident[a], 'to': ident[b],
            'label': '⚠' if clash else '',
            'type': 0,
            'category': (kind + ' disputed') if clash else kind,
        })

    return {'graphs': [{'nodes': jnodes, 'edges': jedges}]}


def main():
    ap = argparse.ArgumentParser(description='Export logogram families to basic_graph_editor.')
    ap.add_argument('--families', type=int, default=10,
                    help='how many of the largest to export (default 10)')
    ap.add_argument('--kind', choices=['phonetic', 'semantic', 'both'], default='phonetic')
    ap.add_argument('--root', help='export only this family, by its grapheme')
    ap.add_argument('--out', default='graphs', help='output directory')
    ap.add_argument('--data', default=DATA)
    args = ap.parse_args()

    L = load(args.data)
    phon, sem = indexes(L)
    os.makedirs(args.out, exist_ok=True)

    kinds = [('phonetic', phon), ('semantic', sem)]
    if args.kind != 'both':
        kinds = [k for k in kinds if k[0] == args.kind]

    written = []
    for name, children in kinds:
        if args.root:
            roots = [args.root] if args.root in children else []
            if not roots:
                sys.exit('"%s" is not a %s component of anything' % (args.root, name))
        else:
            roots = sorted(children, key=lambda r: -len(family(r, children)[0]))[:args.families]
        for r in roots:
            data = export(L, r, children, name)
            n = len(data['graphs'][0]['nodes'])
            path = os.path.join(args.out, '%s_%s.json' % (name, r))
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=1)
            written.append((path, n))
            print('%-44s %3d nodes' % (path, n))

    # Index for the editor's File → Samples
    if written and not args.root:
        idx = [{'file': os.path.basename(p), 'name': os.path.basename(p)[:-5].replace('_', ' · ')}
               for p, _ in written]
        with open(os.path.join(args.out, 'index.json'), 'w', encoding='utf-8') as f:
            json.dump(idx, f, ensure_ascii=False, indent=2)
        print('\n%d files and their index.json in %s/' % (len(written), args.out))


if __name__ == '__main__':
    main()
