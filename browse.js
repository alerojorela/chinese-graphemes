/************************************************
Corpus browser: one table for the whole set

Replaces six static DataTables_*.html and DataQuery.html. The static ones were
8.1 MB of generated HTML holding ~38000 stored links to a dataset that is right
here, and they went stale the moment the data changed.

Two ways to pick rows, because they answer different questions:
  - by property, with the partitions and facets measured in README.md
  - by enumeration, pasting a list of characters — that was DataQuery.html, and
    no filter replaces it: a vocabulary list from a textbook is not a property

Reuses phonetictree.js for the index (variant pairs, phonetic/semantic maps) so
the variant-pair heuristic is written once.

2026 Alejandro Rojo Gualix

MIT license
see LICENSE at the repository root
*************************************************/

var browse = (function () {
    'use strict';

    var IDS = '⿰⿱⿲⿳⿴⿵⿶⿷⿸⿹⿺⿻';
    var IDS_NAME = {
        '⿰': 'left · right', '⿱': 'top · bottom',
        '⿲': 'three in a row', '⿳': 'three stacked',
        '⿴': 'full surround', '⿵': 'surround from above',
        '⿶': 'surround from below', '⿷': 'surround from the left',
        '⿸': 'surround upper left', '⿹': 'surround upper right',
        '⿺': 'surround lower left', '⿻': 'overlaid'
    };

    var idx = null;      // shared index, built once
    var rows = [];       // every grapheme, annotated
    var view = [];       // what the current filters leave
    var shown = 0;       // how many of `view` are in the DOM
    var CHUNK = 150;     // 9574 rows at once freezes the page; render in chunks

    // ── Derived fields ─────────────────────────────────────────────────────────

    function strokes(c) {
        var lg = logograms[c];
        return (lg && lg.matches) ? lg.matches.length : 0;
    }

    function series(c) {
        var lg = logograms[c];
        var g = lg && lg.BaxterSagart && lg.BaxterSagart.GSR;
        var m = g && /^\d+/.exec(g);
        return m ? m[0] : null;
    }

    // The three decompositions are different measures over different sources and
    // they disagree on purpose: etymological tops out at 4, IDS at 8, Wikimedia
    // at 7. Calling any of them "divisibility" on its own is how a note in the
    // workshop and a later measurement ended up contradicting each other.
    function kidsEtymological(c) {
        var e = (logograms[c] || {}).etymology || {};
        var out = [];
        if (e.semantic) out.push(e.semantic);
        if (e.phonetic) out.push(e.phonetic);
        return out;
    }

    function kidsIds(c) {
        var d = (logograms[c] || {}).decomposition || '';
        if (!d || d === '？') return [];
        var out = [];
        for (var i = 0; i < d.length; i++) {
            var ch = d[i];
            if (IDS.indexOf(ch) < 0 && ch !== '？' && ch !== c) out.push(ch);
        }
        return out;
    }

    function kidsWikimedia(c) {
        var g = (logograms[c] || {}).graphicaldecomposition || {};
        var out = [];
        if (g.LeftComponent && g.LeftComponent !== c) out.push(g.LeftComponent);
        if (g.RightComponent && g.RightComponent !== c) out.push(g.RightComponent);
        return out;
    }

    // Levels of nesting; a grapheme that does not come apart is 0. Cycles
    // guarded — 舉 contains itself and made the original code recurse forever.
    function depth(c, kids, seen) {
        if (!logograms[c]) return 0;
        seen = seen || {};
        if (seen[c]) return 0;
        seen[c] = true;
        var d = 0, cs = kids(c);
        for (var i = 0; i < cs.length; i++) {
            var sub = depth(cs[i], kids, seen);
            if (sub > d) d = sub;
        }
        seen[c] = false;
        return d + 1;
    }

    function annotate() {
        idx = phonetictree.build();
        rows = [];
        for (var c in logograms) {
            var lg = logograms[c];
            var e = lg.etymology || {};
            var bs = lg.BaxterSagart || {};
            var dec = lg.decomposition || '';
            var op = dec && IDS.indexOf(dec[0]) >= 0 ? dec[0] : '';
            var parentSeries = e.phonetic ? series(e.phonetic) : null;
            var semSeries = e.semantic ? series(e.semantic) : null;
            var own = series(c);
            rows.push({
                c: c,
                type: e.type || '',
                radical: lg.radical || '',
                semantic: e.semantic || '',
                phonetic: e.phonetic || '',
                order: e.order || '',
                hint: e.hint || '',
                definition: lg.definition || '',
                pinyin: (lg.pinyin || []).join(', '),
                oc: (bs.OC || '').trim(),
                mc: (bs.MC || '').trim(),
                gsr: bs.GSR || '',
                decomposition: dec,
                layout: op,
                strokes: strokes(c),
                divEty: depth(c, kidsEtymological) - 1,
                divIds: depth(c, kidsIds) - 1,
                divWiki: depth(c, kidsWikimedia) - 1,
                phonOf: (idx.phon[c] || []).length,
                semOf: (idx.sem[c] || []).length,
                radicalDiffers: !!(e.semantic && lg.radical && lg.radical !== e.semantic),
                gsrClash: !!(own && parentSeries && own !== parentSeries),
                // Stronger than a clash: the part filed as MEANING is the one that
                // sounds alike, and the part filed as SOUND is not. The two slots
                // are the wrong way round. 13 of the 854 checkable characters.
                slotsSwapped: !!(own && semSeries && parentSeries &&
                    own === semSeries && own !== parentSeries),
                variant: idx.variant[c] || ''
            });
        }
        rows.sort(function (a, b) { return a.strokes - b.strokes || a.c.localeCompare(b.c); });
        return rows;
    }

    // ── Columns ────────────────────────────────────────────────────────────────

    var COLUMNS = [
        { id: 'c', label: 'Grapheme', group: 'Identity', always: true,
          cell: function (r) {
              return '<a class="bw-glyph" href="./analysis.html?q=' +
                  encodeURIComponent(r.c) + '" target="_blank">' + r.c + '</a>';
          } },
        { id: 'pinyin', label: 'Pinyin', group: 'Identity' },
        { id: 'definition', label: 'Meaning', group: 'Identity', wide: true },
        { id: 'hint', label: 'Composition hint', group: 'Identity', wide: true },

        { id: 'type', label: 'Origin', group: 'Origin' },
        { id: 'radical', label: 'Radical', group: 'Parts', glyph: true },
        { id: 'semantic', label: 'Semantic', group: 'Parts', glyph: true },
        { id: 'phonetic', label: 'Phonetic', group: 'Parts', glyph: true },
        { id: 'order', label: 'Order', group: 'Parts' },

        { id: 'layout', label: 'Layout', group: 'Shape',
          cell: function (r) { return r.layout ? r.layout + ' <span class="bw-dim">' +
              (IDS_NAME[r.layout] || '') + '</span>' : ''; } },
        { id: 'decomposition', label: 'IDS', group: 'Shape' },
        { id: 'strokes', label: 'Strokes', group: 'Shape', num: true },
        { id: 'divEty', label: 'Div. etym.', group: 'Shape', num: true },
        { id: 'divIds', label: 'Div. IDS', group: 'Shape', num: true },
        { id: 'divWiki', label: 'Div. Wikimedia', group: 'Shape', num: true },

        { id: 'oc', label: 'Old Chinese', group: 'Sound' },
        { id: 'mc', label: 'Middle Chinese', group: 'Sound' },
        { id: 'gsr', label: 'GSR series', group: 'Sound' },

        { id: 'phonOf', label: 'Phonetic of', group: 'Role', num: true },
        { id: 'semOf', label: 'Semantic of', group: 'Role', num: true },
        { id: 'variant', label: 'Variant', group: 'Role' }
    ];

    var PRESETS = {
        study: ['c', 'pinyin', 'definition', 'hint'],
        etymology: ['c', 'type', 'semantic', 'phonetic', 'order', 'hint'],
        sound: ['c', 'pinyin', 'oc', 'mc', 'gsr'],
        shape: ['c', 'layout', 'decomposition', 'strokes', 'divEty', 'divIds', 'divWiki'],
        everything: COLUMNS.map(function (col) { return col.id; })
    };

    var visible = PRESETS.study.slice();
    var sortBy = null, sortDir = 1;

    // ── Filtering ──────────────────────────────────────────────────────────────

    function val(id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : '';
    }

    function checked(id) {
        var el = document.getElementById(id);
        return !!(el && el.checked);
    }

    function apply() {
        var origin = val('bw-origin');
        var layout = val('bw-layout');
        var variant = val('bw-variant');
        var minStr = parseInt(val('bw-strokes-min'), 10);
        var maxStr = parseInt(val('bw-strokes-max'), 10);
        var scales = [['divEty', 'bw-divety'], ['divIds', 'bw-divids'], ['divWiki', 'bw-divwiki']];
        var text = val('bw-search').toLowerCase();

        // Enumeration: paste a list and only those graphemes survive. Anything
        // that is not a grapheme in the set is ignored, so pasting prose works.
        var listRaw = val('bw-list');
        var list = null;
        if (listRaw) {
            list = {};
            for (var i = 0; i < listRaw.length; i++) {
                if (logograms[listRaw[i]]) list[listRaw[i]] = true;
            }
        }

        view = rows.filter(function (r) {
            if (list && !list[r.c]) return false;
            if (origin && (origin === '_none' ? r.type !== '' : r.type !== origin)) return false;
            if (layout && (layout === '_none' ? r.layout !== '' : r.layout !== layout)) return false;
            if (variant === 'trad' && r.variant !== 'trad') return false;
            if (variant === 'simp' && r.variant !== 'simp') return false;
            if (variant === 'none' && r.variant) return false;
            if (!isNaN(minStr) && r.strokes < minStr) return false;
            if (!isNaN(maxStr) && r.strokes > maxStr) return false;
            for (var s = 0; s < scales.length; s++) {
                var v = val(scales[s][1]);
                if (v !== '' && r[scales[s][0]] !== parseInt(v, 10)) return false;
            }
            if (checked('bw-attested') && !r.oc) return false;
            if (checked('bw-radicaldiffers') && !r.radicalDiffers) return false;
            if (checked('bw-composes') && !r.phonOf && !r.semOf) return false;
            if (checked('bw-gsrclash') && !r.gsrClash) return false;
            if (checked('bw-swapped') && !r.slotsSwapped) return false;
            if (text) {
                var hay = (r.c + ' ' + r.pinyin + ' ' + r.definition + ' ' + r.hint).toLowerCase();
                if (hay.indexOf(text) < 0) return false;
            }
            return true;
        });

        if (sortBy) {
            var col = COLUMNS.filter(function (x) { return x.id === sortBy; })[0];
            view.sort(function (a, b) {
                var x = a[sortBy], y = b[sortBy];
                var r = col && col.num ? (x - y) : String(x).localeCompare(String(y));
                return r * sortDir;
            });
        }

        shown = 0;
        document.getElementById('bw-tbody').innerHTML = '';
        more();
        report();
    }

    function report() {
        var el = document.getElementById('bw-count');
        if (!el) return;
        el.textContent = view.length === rows.length
            ? view.length + ' graphemes'
            : view.length + ' of ' + rows.length + ' graphemes';
        var btn = document.getElementById('bw-more');
        if (btn) {
            btn.hidden = shown >= view.length;
            btn.textContent = 'Show ' + Math.min(CHUNK, view.length - shown) +
                ' more (' + (view.length - shown) + ' left)';
        }
    }

    function cellOf(col, r) {
        if (col.cell) return col.cell(r);
        var v = r[col.id];
        if (v === '' || v === undefined || v === null) return '';
        if (col.glyph) {
            return '<a class="bw-glyph bw-small" href="./analysis.html?q=' +
                encodeURIComponent(v) + '" target="_blank">' + v + '</a>';
        }
        return String(v);
    }

    function more() {
        var tb = document.getElementById('bw-tbody');
        var end = Math.min(shown + CHUNK, view.length);
        var cols = COLUMNS.filter(function (c) { return visible.indexOf(c.id) >= 0; });
        var out = [];
        for (var i = shown; i < end; i++) {
            var r = view[i], tds = [];
            for (var j = 0; j < cols.length; j++) {
                var cls = [];
                if (cols[j].num) cls.push('bw-num');
                if (cols[j].wide) cls.push('bw-wide');
                tds.push('<td' + (cls.length ? ' class="' + cls.join(' ') + '"' : '') + '>' +
                    cellOf(cols[j], r) + '</td>');
            }
            out.push('<tr' + (r.gsrClash ? ' class="bw-clash"' : '') + '>' + tds.join('') + '</tr>');
        }
        tb.insertAdjacentHTML('beforeend', out.join(''));
        shown = end;
        report();
    }

    function header() {
        var cols = COLUMNS.filter(function (c) { return visible.indexOf(c.id) >= 0; });
        document.getElementById('bw-thead').innerHTML = '<tr>' + cols.map(function (c) {
            var arrow = sortBy === c.id ? (sortDir > 0 ? ' ▲' : ' ▼') : '';
            return '<th data-col="' + c.id + '">' + c.label + arrow + '</th>';
        }).join('') + '</tr>';
    }

    // ── Column chooser ─────────────────────────────────────────────────────────

    function buildChooser() {
        var host = document.getElementById('bw-columns');
        var groups = [];
        COLUMNS.forEach(function (c) {
            if (groups.indexOf(c.group) < 0) groups.push(c.group);
        });
        host.innerHTML = groups.map(function (g) {
            return '<fieldset><legend>' + g + '</legend>' + COLUMNS
                .filter(function (c) { return c.group === g; })
                .map(function (c) {
                    return '<label><input type="checkbox" data-col="' + c.id + '"' +
                        (visible.indexOf(c.id) >= 0 ? ' checked' : '') +
                        (c.always ? ' disabled' : '') + '> ' + c.label + '</label>';
                }).join('') + '</fieldset>';
        }).join('');
        host.addEventListener('change', function (e) {
            var id = e.target.getAttribute('data-col');
            if (!id) return;
            if (e.target.checked) {
                if (visible.indexOf(id) < 0) visible.push(id);
            } else {
                visible = visible.filter(function (x) { return x !== id; });
            }
            visible.sort(function (a, b) {
                return COLUMNS.findIndex(function (c) { return c.id === a; }) -
                    COLUMNS.findIndex(function (c) { return c.id === b; });
            });
            header(); apply();
        });
    }

    function usePreset(name) {
        visible = PRESETS[name].slice();
        buildChooser(); header(); apply();
    }

    // ── Copy as TSV, which is what a study list is actually for ───────────────

    function copyTSV() {
        var cols = COLUMNS.filter(function (c) { return visible.indexOf(c.id) >= 0; });
        var lines = [cols.map(function (c) { return c.label; }).join('\t')];
        view.forEach(function (r) {
            lines.push(cols.map(function (c) { return String(r[c.id] === undefined ? '' : r[c.id]); }).join('\t'));
        });
        var text = lines.join('\n');
        var note = document.getElementById('bw-copied');
        function done(ok) {
            if (!note) return;
            note.textContent = ok ? ('Copied ' + view.length + ' rows') : 'Could not copy';
            setTimeout(function () { note.textContent = ''; }, 2500);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () { done(true); },
                function () { done(false); });
        } else {
            // file:// in some browsers has no clipboard API; fall back to a textarea
            var ta = document.createElement('textarea');
            ta.value = text; document.body.appendChild(ta); ta.select();
            var ok = false;
            try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
            document.body.removeChild(ta);
            done(ok);
        }
    }

    // ── Wiring ─────────────────────────────────────────────────────────────────

    function fillLayoutOptions() {
        var sel = document.getElementById('bw-layout');
        var counts = {};
        rows.forEach(function (r) { counts[r.layout] = (counts[r.layout] || 0) + 1; });
        Object.keys(IDS_NAME).sort(function (a, b) {
            return (counts[b] || 0) - (counts[a] || 0);
        }).forEach(function (op) {
            if (!counts[op]) return;
            var o = document.createElement('option');
            o.value = op;
            o.textContent = op + '  ' + IDS_NAME[op] + '  (' + counts[op] + ')';
            sel.appendChild(o);
        });
        var o = document.createElement('option');
        o.value = '_none';
        o.textContent = 'does not come apart  (' + (counts[''] || 0) + ')';
        sel.appendChild(o);
    }

    function fillScaleOptions() {
        [['bw-divety', 'divEty'], ['bw-divids', 'divIds'], ['bw-divwiki', 'divWiki']]
            .forEach(function (pair) {
                var sel = document.getElementById(pair[0]);
                var counts = {};
                rows.forEach(function (r) { counts[r[pair[1]]] = (counts[r[pair[1]]] || 0) + 1; });
                Object.keys(counts).map(Number).sort(function (a, b) { return a - b; })
                    .forEach(function (lvl) {
                        var o = document.createElement('option');
                        o.value = lvl;
                        o.textContent = 'level ' + lvl + '  (' + counts[lvl] + ')';
                        sel.appendChild(o);
                    });
            });
    }

    function fillOriginCounts() {
        var sel = document.getElementById('bw-origin');
        var counts = {};
        rows.forEach(function (r) { counts[r.type] = (counts[r.type] || 0) + 1; });
        Array.prototype.forEach.call(sel.options, function (o) {
            var key = o.value === '_none' ? '' : o.value;
            if (o.value !== '' && counts[key] !== undefined) {
                o.textContent += '  (' + counts[key] + ')';
            }
        });
    }

    // The six static tables each showed one slice. Their links survive as URL
    // parameters, so article.html keeps pointing at what it meant to point at:
    //   browse.html?origin=pictographic
    //   browse.html?composes=1&cols=etymology
    var PARAM_TO_CONTROL = {
        origin: 'bw-origin', layout: 'bw-layout', variant: 'bw-variant',
        divety: 'bw-divety', divids: 'bw-divids', divwiki: 'bw-divwiki',
        strokesmin: 'bw-strokes-min', strokesmax: 'bw-strokes-max',
        q: 'bw-search', list: 'bw-list'
    };
    var PARAM_TO_CHECK = {
        attested: 'bw-attested', radicaldiffers: 'bw-radicaldiffers',
        composes: 'bw-composes', gsrclash: 'bw-gsrclash', swapped: 'bw-swapped'
    };

    function readParams() {
        var qs = window.location.search.replace(/^\?/, '');
        if (!qs) return;
        qs.split('&').forEach(function (pair) {
            var i = pair.indexOf('=');
            var k = decodeURIComponent(i < 0 ? pair : pair.slice(0, i));
            var v = i < 0 ? '1' : decodeURIComponent(pair.slice(i + 1).replace(/\+/g, ' '));
            if (PARAM_TO_CONTROL[k]) {
                var el = document.getElementById(PARAM_TO_CONTROL[k]);
                if (el) el.value = v;
            } else if (PARAM_TO_CHECK[k]) {
                var ch = document.getElementById(PARAM_TO_CHECK[k]);
                if (ch) ch.checked = (v !== '0');
            } else if (k === 'cols') {
                if (PRESETS[v]) visible = PRESETS[v].slice();
                else {
                    var ids = v.split(',').filter(function (id) {
                        return COLUMNS.some(function (c) { return c.id === id; });
                    });
                    if (ids.length) visible = ids;
                }
                if (visible.indexOf('c') < 0) visible.unshift('c');
            } else if (k === 'sort') {
                if (COLUMNS.some(function (c) { return c.id === v; })) sortBy = v;
            }
        });
    }

    function init() {
        if (!document.getElementById('bw-tbody')) return;
        annotate();
        fillOriginCounts();
        fillLayoutOptions();
        fillScaleOptions();
        readParams();          // after the selects are filled, before the first draw
        buildChooser();
        header();
        apply();

        ['bw-origin', 'bw-layout', 'bw-variant', 'bw-divety', 'bw-divids', 'bw-divwiki',
            'bw-attested', 'bw-radicaldiffers', 'bw-composes', 'bw-gsrclash', 'bw-swapped']
            .forEach(function (id) {
                var el = document.getElementById(id);
                if (el) el.addEventListener('change', apply);
            });
        ['bw-search', 'bw-list', 'bw-strokes-min', 'bw-strokes-max'].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.addEventListener('input', apply);
        });

        document.getElementById('bw-more').addEventListener('click', more);
        document.getElementById('bw-copy').addEventListener('click', copyTSV);
        document.getElementById('bw-reset').addEventListener('click', function () {
            ['bw-search', 'bw-list', 'bw-strokes-min', 'bw-strokes-max'].forEach(function (id) {
                document.getElementById(id).value = '';
            });
            ['bw-origin', 'bw-layout', 'bw-variant', 'bw-divety', 'bw-divids', 'bw-divwiki']
                .forEach(function (id) { document.getElementById(id).value = ''; });
            ['bw-attested', 'bw-radicaldiffers', 'bw-composes', 'bw-gsrclash', 'bw-swapped']
                .forEach(function (id) { document.getElementById(id).checked = false; });
            sortBy = null; header(); apply();
        });

        document.getElementById('bw-presets').addEventListener('click', function (e) {
            var p = e.target.getAttribute('data-preset');
            if (p) usePreset(p);
        });

        document.getElementById('bw-thead').addEventListener('click', function (e) {
            var id = e.target.getAttribute('data-col');
            if (!id) return;
            if (sortBy === id) sortDir = -sortDir; else { sortBy = id; sortDir = 1; }
            header(); apply();
        });
    }

    return { init: init, apply: apply, annotate: annotate, columns: COLUMNS,
             rows: function () { return rows; } };
})();

document.addEventListener('DOMContentLoaded', function () { browse.init(); });
