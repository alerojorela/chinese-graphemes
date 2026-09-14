/************************************************
Ascending trees of chinese grapheme composition

A phonetic component A is used by AB, which is in turn used by ABC, ABD, ABE.
This renders that tree, in two mutually exclusive views.

The point is didactic and it only works in Old Chinese: a phonetic branch
sounds alike in the reconstructed language, not in modern Mandarin.
    各 *kˤak → 格 *kˤrak → 落 *kə.rˤak     is a family
    gè       → gé        → luò             is not

A node is a WORD, not a glyph. Traditional and simplified forms of the same word
are one node with two spellings, and the checkboxes choose which spellings show.
They were two sibling nodes until 2026-09-14, which said the pair was a family
relation when it is the same character written twice.

2026 Alejandro Rojo Gualix

MIT license
see LICENSE at the repository root
*************************************************/

var phonetictree = (function () {
    'use strict';

    var ALL = '__all__';   // the whole forest instead of one root

    // ── Index, built once on first use ─────────────────────────────────────────

    var idx = null;

    // len(matches) is the stroke count. Checked against 13 known characters and
    // cross-checked against Baxter-Sagart on 265 variant pairs: 261 agree.
    function strokes(c) {
        var lg = logograms[c];
        return (lg && lg.matches) ? lg.matches.length : 0;
    }

    function attested(c) {
        var lg = logograms[c];
        return !!(lg && lg.BaxterSagart);
    }

    // Karlgren's phonetic series number, stripped of its letter suffix.
    function series(c) {
        var lg = logograms[c];
        var g = lg && lg.BaxterSagart && lg.BaxterSagart.GSR;
        var m = g && /^\d+/.exec(g);
        return m ? m[0] : null;
    }

    function build() {
        if (idx) return idx;

        var phon = {}, sem = {};
        for (var ch in logograms) {
            var e = logograms[ch].etymology;
            if (!e) continue;
            if (e.phonetic) (phon[e.phonetic] = phon[e.phonetic] || []).push(ch);
            if (e.semantic) (sem[e.semantic] = sem[e.semantic] || []).push(ch);
        }

        // Variant pairs (traditional / simplified). The dataset carries no field
        // for this, so they are detected: siblings under the same phonetic
        // component sharing pinyin AND definition. Within a pair, the member
        // attested in Baxter-Sagart is the traditional one; when neither is
        // attested, the one with more strokes is.
        //
        // Measured 2026-09-14: all 602 groups have exactly two members, so a
        // pair is always a pair and the merge never has to arbitrate a third.
        var variant = {};   // char -> 'trad' | 'simp'
        var canon = {};     // char -> the id of the node it belongs to
        var pair = {};      // node id -> { trad: char, simp: char }
        for (var root in phon) {
            var buckets = {};
            phon[root].forEach(function (c) {
                var lg = logograms[c];
                if (!lg.pinyin || !lg.pinyin.length || !lg.definition) return;
                var key = lg.pinyin.join(',') + ' ' + lg.definition.trim();
                (buckets[key] = buckets[key] || []).push(c);
            });
            for (var k in buckets) {
                var g = buckets[k];
                if (g.length < 2) continue;
                var withBS = g.filter(attested);
                var trad = (withBS.length === 1) ? withBS[0]
                    : g.slice().sort(function (a, b) { return strokes(b) - strokes(a); })[0];
                var simp = g.filter(function (c) { return c !== trad; })[0];
                g.forEach(function (c) { variant[c] = (c === trad) ? 'trad' : 'simp'; canon[c] = trad; });
                pair[trad] = { trad: trad, simp: simp };
            }
        }

        function nodeOf(c) { return canon[c] || c; }
        function members(n) { return pair[n] ? [pair[n].trad, pair[n].simp] : [n]; }

        // Children of a node: the union of what each of its spellings composes,
        // mapped to node ids and deduplicated. A pair that composes the same
        // grapheme from both halves yields one child, not two.
        function kidsOf(n, kids) {
            var out = [], seen = {};
            members(n).forEach(function (m) {
                (kids[m] || []).forEach(function (c) {
                    var k = nodeOf(c);
                    if (k !== n && !seen[k]) { seen[k] = 1; out.push(k); }
                });
            });
            return out;
        }

        // Cycles guarded: 舉 used to recurse forever.
        function depth(n, kids, seen) {
            if (seen[n]) return 0;
            seen[n] = true;
            var d = 0, cs = kidsOf(n, kids);
            for (var i = 0; i < cs.length; i++) d = Math.max(d, depth(cs[i], kids, seen));
            seen[n] = false;
            return d + 1;
        }
        function size(n, kids, seen) {
            if (seen[n]) return 0;
            seen[n] = true;
            var t = 1, cs = kidsOf(n, kids);
            for (var i = 0; i < cs.length; i++) t += size(cs[i], kids, seen);
            seen[n] = false;
            return t;
        }

        // Roots of a view, as node ids, with the two lists the interface needs:
        // every component, for the picker; and the MAXIMAL ones, for the forest.
        // Maximal = not itself used by another component. Listing every
        // component instead would print 格 twice, once inside 各 and once as a
        // root of its own; over the maximal ones each grapheme appears exactly
        // once and the forest IS the relation.
        function roots(kids) {
            var all = {}, child = {};
            for (var c in kids) all[nodeOf(c)] = true;
            for (var k in kids) kids[k].forEach(function (x) {
                var t = nodeOf(x);
                if (all[t]) child[t] = true;
            });
            var list = Object.keys(all).map(function (r) {
                return { id: r, size: size(r, kids, {}), depth: depth(r, kids, {}), maximal: !child[r] };
            });
            list.sort(function (a, b) { return b.size - a.size; });
            return list;
        }

        idx = {
            phon: phon, sem: sem, variant: variant, canon: canon, pair: pair,
            nodeOf: nodeOf, members: members, kidsOf: kidsOf,
            phonRoots: roots(phon), semRoots: roots(sem)
        };
        return idx;
    }

    // ── Pronunciation: the stage that justifies the relation ───────────────────

    // Any stage of the language counts as justification. Old Chinese first,
    // because that is the one that actually explains the branch; then Middle
    // Chinese; modern pinyin last, and flagged, because a branch that only
    // agrees in pinyin is either a late coinage or a coincidence.
    function pronunciation(c) {
        var lg = logograms[c] || {};
        var bs = lg.BaxterSagart;
        if (bs && bs.OC && bs.OC.trim()) return { text: bs.OC.trim(), stage: 'oc', label: 'Old Chinese' };
        if (bs && bs.MC && bs.MC.trim()) return { text: bs.MC.trim(), stage: 'mc', label: 'Middle Chinese' };
        if (lg.pinyin && lg.pinyin.length) return { text: lg.pinyin.join(', '), stage: 'py', label: 'modern pinyin only' };
        return { text: '—', stage: 'none', label: 'no pronunciation' };
    }

    var RANK = { oc: 0, mc: 1, py: 2, none: 3 };

    // For a merged node, the best-attested spelling speaks for the word: the
    // pair is one word, and it is the traditional half that carries the Old
    // Chinese reading. Showing the simplified half's pinyin instead would hide
    // the evidence that justifies the branch.
    function pronunciationOf(n) {
        var best = null;
        idx.members(n).forEach(function (m) {
            var p = pronunciation(m);
            if (!best || RANK[p.stage] < RANK[best.stage]) best = p;
        });
        return best;
    }

    // The spelling that carries the etymological data, used for strokes, for the
    // Karlgren series and for the attestation mark.
    function head(n) {
        var ms = idx.members(n);
        for (var i = 0; i < ms.length; i++) if (attested(ms[i])) return ms[i];
        return ms[0];
    }

    function tooltip(n, parent) {
        var h = head(n);
        var lg = logograms[h] || {};
        var p = pronunciationOf(n);
        var ms = idx.members(n);
        var out = [ms.join(' ') + '   ' + p.text + '   (' + p.label + ')'];
        if (lg.definition) out.push(lg.definition);
        var bs = lg.BaxterSagart;
        if (bs) {
            if (bs.py) out.push('pinyin: ' + bs.py);
            if (bs.MC && p.stage !== 'mc') out.push('Middle Chinese: ' + bs.MC);
            if (bs.gloss) out.push('Baxter-Sagart gloss: ' + bs.gloss);
            if (bs.GSR) out.push('GSR series: ' + bs.GSR);
        } else {
            out.push('Not attested in the classical corpus: in neither Baxter-Sagart');
            out.push('nor Karlgren. This is where the coinages land — the names of');
            out.push('chemical elements and materials minted in the 20th century,');
            out.push('which use the same procedure two thousand years later.');
        }
        if (parent) {
            var a = series(h), b = series(head(parent));
            if (a && b && a !== b) {
                out.push('');
                out.push('⚠ Karlgren puts it in a different phonetic series (' + a + ' against ' +
                    b + '): this edge is disputed.');
            }
        }
        if (idx.pair[n]) {
            out.push('');
            out.push('One word, two spellings: ' + idx.pair[n].trad + ' traditional, ' +
                idx.pair[n].simp + ' simplified. The pair is detected and not declared;');
            out.push('the dataset has no field for it.');
        }
        return out.join('\n');
    }

    // ── Rendering ──────────────────────────────────────────────────────────────

    var state = { view: 'phon', root: null, trad: true, simp: true };
    var counts = { nodes: 0, glyphs: 0, unattested: 0, clashes: 0 };

    // Which spellings of this node are on show. A pair with both boxes cleared
    // has nothing to show and the node goes; every other node always shows.
    function shownGlyphs(n) {
        if (!idx.pair[n]) return [n];
        var out = [];
        if (state.trad) out.push(idx.pair[n].trad);
        if (state.simp) out.push(idx.pair[n].simp);
        return out;
    }

    function sortKids(cs) {
        return cs.filter(function (c) { return shownGlyphs(c).length > 0; })
            .sort(function (a, b) {
                return strokes(head(a)) - strokes(head(b)) || a.localeCompare(b);
            });
    }

    function renderNode(n, kids, parent, seen, collapsed) {
        if (seen[n]) return null;                  // cycle guard
        var glyphs = shownGlyphs(n);
        if (!glyphs.length) return null;
        seen[n] = true;

        var h = head(n);
        var lg = logograms[h] || {};
        var p = pronunciationOf(n);

        counts.nodes++;
        counts.glyphs += glyphs.length;
        if (!attested(h)) counts.unattested++;

        var li = document.createElement('li');
        li.className = 'pt-node pt-stage-' + p.stage;
        if (!attested(h)) li.className += ' pt-unattested';
        if (idx.pair[n]) li.className += ' pt-variant';

        var row = document.createElement('div');
        row.className = 'pt-row';
        row.title = tooltip(n, parent);

        var cs = sortKids(idx.kidsOf(n, kids));

        var toggle = document.createElement('button');
        toggle.className = 'pt-toggle';
        toggle.type = 'button';
        if (!cs.length) {
            toggle.disabled = true;
            toggle.textContent = '·';
        } else {
            toggle.textContent = collapsed ? '▸' : '▾';
            toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
        }
        row.appendChild(toggle);

        // Both spellings, each its own link: they are two characters and
        // analysis.html takes one at a time.
        glyphs.forEach(function (g) {
            var a = document.createElement('a');
            a.className = 'pt-glyph';
            if (idx.variant[g]) a.className += ' pt-' + idx.variant[g];
            a.textContent = g;
            a.href = './analysis.html?q=' + encodeURIComponent(g);
            a.target = '_blank';
            a.title = idx.variant[g] === 'trad' ? 'traditional' :
                idx.variant[g] === 'simp' ? 'simplified' : '';
            row.appendChild(a);
        });

        // Pronunciation before meaning: that is the whole didactic order.
        var pron = document.createElement('span');
        pron.className = 'pt-pron';
        pron.textContent = p.text;
        row.appendChild(pron);

        if (parent) {
            var a2 = series(h), b2 = series(head(parent));
            if (a2 && b2 && a2 !== b2) {
                counts.clashes++;
                var warn = document.createElement('span');
                warn.className = 'pt-gsr-clash';
                warn.textContent = '⚠';
                warn.title = 'Karlgren puts it in a different phonetic series: disputed edge';
                row.appendChild(warn);
            }
        }

        var gloss = document.createElement('span');
        gloss.className = 'pt-gloss';
        gloss.textContent = lg.definition || '';
        row.appendChild(gloss);

        li.appendChild(row);

        if (cs.length) {
            if (collapsed) {
                // Built on first open. With 1105 roots on screen, building every
                // subtree up front is the difference between instant and not.
                var hint = document.createElement('span');
                hint.className = 'pt-count';
                hint.textContent = cs.length + (cs.length === 1 ? ' child' : ' children');
                row.appendChild(hint);
                toggle.addEventListener('click', function () {
                    var open = li.getAttribute('data-open') === '1';
                    if (open) {
                        li.removeChild(li.lastChild);
                        li.setAttribute('data-open', '0');
                        toggle.textContent = '▸';
                        toggle.setAttribute('aria-expanded', 'false');
                        return;
                    }
                    var ul = document.createElement('ul');
                    var sub = {};
                    sub[n] = true;
                    for (var i = 0; i < cs.length; i++) {
                        var node = renderNode(cs[i], kids, n, sub, false);
                        if (node) ul.appendChild(node);
                    }
                    li.appendChild(ul);
                    li.setAttribute('data-open', '1');
                    toggle.textContent = '▾';
                    toggle.setAttribute('aria-expanded', 'true');
                });
            } else {
                var ul = document.createElement('ul');
                for (var i = 0; i < cs.length; i++) {
                    var sub2 = renderNode(cs[i], kids, n, seen, false);
                    if (sub2) ul.appendChild(sub2);
                }
                if (ul.childNodes.length) li.appendChild(ul);
                toggle.addEventListener('click', function () {
                    var shown = ul.style.display !== 'none';
                    ul.style.display = shown ? 'none' : '';
                    toggle.textContent = shown ? '▸' : '▾';
                    toggle.setAttribute('aria-expanded', shown ? 'false' : 'true');
                });
            }
        }
        return li;
    }

    function draw() {
        build();
        var host = document.getElementById('pt-tree');
        if (!host) return;
        host.innerHTML = '';
        counts = { nodes: 0, glyphs: 0, unattested: 0, clashes: 0 };

        var kids = state.view === 'phon' ? idx.phon : idx.sem;
        var roots = state.view === 'phon' ? idx.phonRoots : idx.semRoots;
        var info = document.getElementById('pt-info');

        if (!state.root) { host.textContent = 'Pick a component.'; return; }

        var ul = document.createElement('ul');
        ul.className = 'pt-root';

        if (state.root === ALL) {
            // The forest: every component that nothing else composes, each one
            // closed. Opening one builds its branch.
            var maximal = roots.filter(function (r) { return r.maximal; });
            for (var i = 0; i < maximal.length; i++) {
                var node = renderNode(maximal[i].id, kids, null, {}, true);
                if (node) ul.appendChild(node);
            }
            host.appendChild(ul);
            if (info) {
                info.textContent = maximal.length + ' components that nothing else composes, ' +
                    'covering every grapheme in the relation exactly once. ' +
                    'Open one to unfold its branch.';
            }
            return;
        }

        var one = renderNode(state.root, kids, null, {}, false);
        if (one) ul.appendChild(one);
        host.appendChild(ul);

        if (info) {
            var extra = counts.glyphs !== counts.nodes
                ? ' · ' + counts.glyphs + ' graphemes, ' + (counts.glyphs - counts.nodes) +
                  ' of them the second spelling of a pair'
                : '';
            info.textContent = counts.nodes + ' nodes' + extra + ' · ' +
                (counts.nodes - counts.unattested) + ' attested in the classical corpus · ' +
                counts.unattested + ' unattested · ' +
                counts.clashes + ' edges Karlgren disputes';
        }
    }

    function fillRoots() {
        build();
        var sel = document.getElementById('pt-root');
        if (!sel) return;
        var roots = state.view === 'phon' ? idx.phonRoots : idx.semRoots;
        var deep = roots.filter(function (r) { return r.depth >= 3; });
        var maximal = roots.filter(function (r) { return r.maximal; });

        sel.innerHTML = '';
        var all = document.createElement('option');
        all.value = ALL;
        all.textContent = '— all ' + maximal.length + ' components, folded —';
        sel.appendChild(all);

        // The picker offers the ones that make a tree worth looking at; «all»
        // above offers the rest. The semantic relation is a classification and
        // not a genealogy: 306 of its 329 components have depth 2, and 氵 alone
        // has 399 children with no grandchildren.
        var offer = state.view === 'phon' ? roots : deep;
        offer.forEach(function (r) {
            var o = document.createElement('option');
            var p = pronunciationOf(r.id);
            o.value = r.id;
            o.textContent = idx.members(r.id).join(' ') + '  ' + p.text + '  — ' + r.size +
                ' graphemes, ' + (r.depth - 1) + ' ' + (r.depth - 1 === 1 ? 'level' : 'levels');
            sel.appendChild(o);
        });
        // The forest is the default, here and on every view change: the single
        // root answers «what does 各 build», the forest answers «what is there»,
        // and the second question is the one a reader arrives with.
        state.root = ALL;
        sel.value = ALL;

        var note = document.getElementById('pt-viewnote');
        if (note) {
            note.textContent = state.view === 'phon'
                ? roots.length + ' phonetic components, ' + maximal.length +
                  ' of them composed by nothing else. The branch sounds alike in Old Chinese, not in modern Mandarin.'
                : roots.length + ' semantic components, and only ' + deep.length +
                  ' have depth. The rest are flat lists: 氵 has ' +
                  idx.kidsOf('氵', idx.sem).length + ' children and no grandchildren.';
        }
    }

    function init() {
        var sel = document.getElementById('pt-root');
        if (!sel) return;

        fillRoots();
        draw();

        sel.addEventListener('change', function () { state.root = sel.value; draw(); });
        document.getElementById('pt-view-phon').addEventListener('change', function () {
            state.view = 'phon'; fillRoots(); draw();
        });
        document.getElementById('pt-view-sem').addEventListener('change', function () {
            state.view = 'sem'; fillRoots(); draw();
        });
        document.getElementById('pt-trad').addEventListener('change', function () {
            state.trad = this.checked; draw();
        });
        document.getElementById('pt-simp').addEventListener('change', function () {
            state.simp = this.checked; draw();
        });
    }

    return { init: init, draw: draw, build: build, pronunciation: pronunciation };
})();

document.addEventListener('DOMContentLoaded', function () { phonetictree.init(); });
