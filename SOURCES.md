# Sources

Every field in `data/derivedmergeddata.js` comes from one of three places. This
page says which, under what licence, **how much of each source did not make it
in**, and **where the sources contradict each other** — which is information,
not noise: two independent descriptions of the same character that disagree are
the only way to tell a fact from a convention.

Replaces the `SOURCES.txt` this project carried from 2019 to 2026-09-14. That
one credited two of the three sources and left D3.js out.

## The three sources

| Source | What it contributes | Entries | Reach the dataset | Left out |
|---|---|---:|---:|---:|
| makemeahanzi | the census, and the etymology | 9574 | 9574 | 0 |
| Baxter-Sagart | the Old Chinese sound | 4056 | 3359 | **697** |
| Wikimedia | the graphic decomposition | 21166 | 9256 | **11910** |

### makemeahanzi — the census

<https://www.skishore.me/makemeahanzi/>, whose `dictionary.txt` is in turn
derived from [Unihan](http://unicode.org/charts/unihan.html) and
[CJKlib](https://github.com/cburgmer/cjklib).

It decides **which 9574 characters exist for this project**, and contributes
`definition`, `pinyin`, `decomposition` (the n-ary IDS tree), `radical`,
`matches`, and the whole `etymology` block: `type`, `hint`, `semantic`,
`phonetic`, `order`.

**Licence: LGPL v3 or later** for `dictionary.txt`, which is the part used here.
The copy of its `COPYING` is kept with the raw data.

⚠️ **And it ships 29 MB that nothing reads.** `graphics.json` carries `strokes`
and `medians` for all 9574 — the SVG outline of every character and the path a
brush takes through it. The project touches it only sideways: the stroke count
comes from the length of `matches`.

### Baxter-Sagart — the sound

Baxter, William H., and Laurent Sagart. 2014. *Old Chinese: a new
reconstruction*. New York: Oxford University Press. Table version 2015-10-13,
from <http://ocbaxtersagart.lsait.lsa.umich.edu/>, reached via
[Wiktionary](https://en.m.wiktionary.org/wiki/Appendix:Baxter-Sagart_Old_Chinese_reconstruction).

Contributes `OC` (the Old Chinese reconstruction), `MC` (Middle Chinese), `py`,
`gloss`, `GSR` and `HYDZD`. This is the evidence the composition trees rest on:
a phonetic branch sounds alike in Old Chinese and does not in Mandarin.

⚠️ **697 reconstructions have no character to attach to.** They are in
Baxter-Sagart and not in the census, so 82.8 % of the table arrives and the rest
waits. Nothing is wrong with them; makemeahanzi simply does not list those
characters.

⚠️ **`HYDZD` is carried and shown nowhere.** It is the reference into the 漢語大字典,
volume and page, for all 3359 attested entries: the way to check a reconstruction
against the standard dictionary without leaving the row.

### Wikimedia — the graphic decomposition

<https://commons.wikimedia.org/wiki/Commons:Chinese_characters_decomposition>.
Contributes `graphicaldecomposition`: `CompositionType`, `LeftComponent`,
`RightComponent`. Binary, left and right, where makemeahanzi's `decomposition`
is n-ary.

Their own caveat, and it is the reason both are kept:

> The graphical decomposition of a character reflects the etymological (or
> historical) composition most of the time, but not always.

⚠️ **11910 of its 21166 rows do not arrive**, and for two different reasons:
**11611** are characters the census does not list, and **299** match by id but
declare no components at all.

⚠️ **And four of its columns were never merged**: `Strokes`, `LeftStrokes`,
`RightStrokes` and `Signature`. The first three matter, because the project's
stroke count is deduced rather than read — see the sixth disagreement below.

## Where the sources disagree

### 1. Two alphabets for the same idea

`CompositionType` is **not** an IDS operator. Wikimedia names each arrangement
with a character that exemplifies it, where makemeahanzi uses ⿰⿱⿲. So the two
fields disagree in **100 %** of the 9247 comparable entries and contradict each
other in none: they are two notations, never compared.

| Wikimedia | Entries | Mostly | Agreement |
|---|---:|---|---:|
| 吅 | 6266 | ⿰ left · right | 96 % |
| 吕 | 2418 | ⿱ top · bottom | 81 % |
| 回 | 258 | ⿵ surrounds | 44 % |
| + | 123 | ⿻ overlaid | 63 % |
| 冖 | 80 | ⿱ top · bottom | 69 % |
| 咒 | 37 | ⿱ top · bottom | 97 % |
| 弼 | 34 | ⿲ three in a row | 50 % |
| 品 | 27 | ⿱ top · bottom | 100 % |

⭐ **The right-hand column is the finding.** Where the two notations agree by 96 %
they are saying the same thing in two alphabets; where they agree by 44 % one of
them is wrong about those characters, and there is no telling which without
looking. 回 is the interesting one: 258 characters whose arrangement two sources
describe differently more often than not.

### 2. The etymological order against the graphic one

The workshop kept the incidents: `0OFFLINE/data/incidencias correlate TODAS.csv`
has **1121 rows** where the etymological order (`sporder` / `psorder`, semantic
first or phonetic first) does not follow from Wikimedia's left and right;
**93** of them are in `incidencias correlate CRÍTICAS.csv`, the ones where both
orders are claimed at once or neither is. 举, 义, 仨, 兒, 养 are among them.

### 3. Karlgren against Baxter-Sagart

`GSR` is Karlgren's phonetic series number, and it checks every phonetic edge
against a source that did not assert it. **1521 edges confirmed, 205 disputed**
(11.9 %), 5083 with no data at one end. The disputed ones are marked in the
trees rather than hidden: it is where a reader learns this is reconstruction.

### 4. And in thirteen characters the two slots are swapped

The same `GSR` check answers a sharper question than "is this edge disputed".
When the component filed as **semantic** lands in the character's own Karlgren
series and the one filed as **phonetic** lands in a different one, the two slots
are the wrong way round: the part that sounds alike has been labelled as meaning,
and the part that does not has been labelled as sound.

Of the 854 characters where all three carry a `GSR`, **13 are like that**:

勒 · 協 · 否 · 欿 · 荒 · 誾 · 謠 · 躅 · 閔 · 魏 · 鸞 · 鼙 · 齋

⚠️ **And the fourteenth is in the article's own figure.** 倝 is filed with 龺 as
semantic and 人 as phonetic, and 人 cannot be it:

| | pinyin | Old Chinese | GSR |
|---|---|---|---:|
| 倝 | gàn | `*[k]ˤar-s` | **0140** |
| 幹 | gàn | `*[k]ˤar-s` | **0140** |
| 翰 | hàn | `*m-kˤar-s` | **0140** |
| 干 | gàn | `*kˤar` | 0139 |
| 人 | rén | `*ni[ŋ]` | 0388 |

倝, 幹 and 翰 are one phonetic series and 干 the neighbouring one; 人 shares with
them neither onset, nor rhyme, nor coda. It does not appear in the thirteen only
because 龺 carries no reconstruction, so Karlgren cannot arbitrate — the 干/幹
family does. makemeahanzi's own `hint` agrees twice over: for 倝 it reads only
"sunlight", which describes 龺, the part in the *semantic* slot; and for 幹 it
reads «Sunlight 龺 suggests "dry"; a club 人干 suggests "invade"», where the 人 is
a drawn club and not a sound.

### 5. Three ways to say how deep a character goes

Not a contradiction, a vocabulary problem, and it cost a real mistake: a
workshop note said 7 and a later measurement said 8 **for the same character**.

| Measure | Source | Tops out at | Reached by |
|---|---|---:|---|
| Etymological | `etymology.semantic` + `phonetic` | 4 | 礴 臟 蘩 蠮 |
| Graphic, IDS | `decomposition`, n-ary | 8 | 儺 擲 攤 灘 癱 縮 缩 蓿 襫 躑 |
| Graphic, Wikimedia | `graphicaldecomposition`, binary | 7 | 擲 躑 |

### 6. The radical against the semantic component

The radical is the dictionary's postal address; the semantic component is an
etymological claim. They coincide in 6646 of 6917, and **271 diverge**: 举 files
under 丶 and means with 扌, 义 files under 丿 and means with ⺷.

### 7. The stroke count is deduced, not read

Nothing in the merged data says how many strokes a character has. The project
uses `len(matches)`, which was **inferred**: checked against 13 control
characters (龠 = 17, 龍 = 16) and cross-checked against Baxter-Sagart over 265
variant pairs, where 261 agree that the attested member has more strokes.

⚠️ **And the Wikimedia spreadsheet has a real stroke count sitting unmerged.**
Merging `Strokes` would turn an inference supported by a heuristic into a
comparison between two sources.

## Other resources

| | |
|---|---|
| [D3.js](https://d3js.org/) | The radial diagram in `analysis.html`. BSD 3-clause |
| [pinyin2ipa](https://github.com/Connum/npm-pinyin2ipa) | Pinyin to IPA. MIT © Connum, based on flexdinesh/npm-module-boilerplate, MIT © Dinesh Pandiyan |
| [jQuery](https://jquery.com/) | MIT |
| The pure-CSS tree | <http://dabblet.com/gist/6878696>, via [Stack Overflow](http://stackoverflow.com/questions/14922247/how-to-get-a-tree-in-html-using-pure-css) |

## Licences

| What | Licence |
|---|---|
| This project's code | MIT — see `LICENSE` |
| This project's prose | CC BY 4.0 |
| makemeahanzi `dictionary.txt` | LGPL v3 or later |
| Baxter-Sagart table | See the authors' own terms at the link above |

2019–2026 Alejandro Rojo Gualix
