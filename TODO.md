# TODO

**Funcional al 85 %.** Descompone logogramas chinos en su parte fonética y su
parte semántica, con diagramas de árbol, rejilla y radiales.

## Qué se sabe ya, y es lo que da valor a la aplicación

Todos los caracteres chinos son **logogramas**, ligados a palabras y no a ideas o
imágenes. La mayoría son **fonosemantogramas**: se compusieron con una parte que
dice cómo suena y otra que dice de qué trata.

Y lo que la herramienta encontró en la base de datos, que es un resultado y no
una funcionalidad: **cuatro fonosemantogramas alcanzan el anidamiento máximo, que
es cuatro** (礴, 臟, 蘩, 蠮). Saber cuál es el techo de la recursividad de un
sistema de escritura es exactamente para lo que se hizo el visor.

El artículo que lo cuenta, `writing/chineseGraphemes/article.html`, añade un
segundo hallazgo que no está en ningún otro sitio: **la recursividad semántica es
rarísima frente a la fonética**: solo 25 grafemas de la muestra aparecen como
componente semántico no terminal.

## 🟢 Resuelto el 2026-09-13

✅ **Rescatado `article.html`** del sitio publicado, con sus cinco PNG de
`graphemes/` y los tres ficheros que necesitaba para pintarse: `style/articulo.css`,
`style/theme.css` y `js/article-toolbar.js`.

✅ **Rescatada la librería `pinyin2ipa`**, que faltaba. Estaba entera en
`sitio-fuente/jsexternal/npm-pinyin2ipa-master/`; ahora está aquí, con su LICENSE
(MIT © Connum). Era la única dependencia externa viva que el repositorio no tenía:
daba 404 en cada carga de `analysis.html`.

✅ **Licencia del código unificada en MIT.** Se quitaron los rastros de CC BY-NC
de las cabeceras de `analysis.js`, `js/taxogrid.js` y `js/binarydivision.js`, del
pie de `analysis.html`, de la cabecera de `tools/binarydivision/binarydivision.html`
y del readme de binarydivision. Ya concuerdan con `LICENSE`.

✅ **Descartada la alarma de TextFit.** El TODO anterior decía que
`analysis.html` referenciaba `../../jsexternal/TextFit-master/` con la ruta rota.
La referencia existe, pero está **dentro de un comentario HTML** junto con la de
`fitty.min.js` (líneas 15-18). No se cargan y no rompen nada.

✅ **Alineado `analysis.html`.** Resultó que la copia del sitio iba **por
delante**, no por detrás: aportaba `meta viewport`, `style/theme.css` y
`js/article-toolbar.js` (tema claro/oscuro, que sustituye al pie manual),
`@media (max-width: 600px)` y, sobre todo, el enlace al
`hierarchical-diagram-builder` en vez de al `binarydivision` archivado. Se trajo
al repositorio entera. Ya no figura como `adaptados:` en `despliegue.yaml`: si
vuelven a divergir, que bloquee.

⚠️ Efecto colateral: el pie MIT que se había puesto aquí lo sustituye el toolbar,
y `SOURCES.txt` dejó de estar enlazado desde ninguna página. Resuelto el
2026-09-14 al convertirlo en `SOURCES.md` y `sources.html`, que sí entra por el
índice.

✅ **Cuarta pestaña «Trees» y exportador al editor de grafos** (2026-09-13).
Árboles ascendentes en dos vistas excluyentes, con la pronunciación delante del
significado y el chino antiguo por encima del pinyin. El detalle y las tres
deducciones que hicieron falta (trazos, pares de variantes, serie de Karlgren)
están en el `CHANGELOG.md`.

✅ **El repositorio se volteó** (2026-09-13). Lo que estaba en
`writing/chineseGraphemes/` pasó a la raíz; la aplicación es autónoma y su puerta
es `index.html`. Se trajo del sitio **todo** lo que faltaba: las 6 tablas, la
consulta, las pistas culturales y el `0OFFLINE` de 64 MB con los datos de origen.
`conserva:` quedó **vacío**, que era la métrica de si el sitio seguía siendo
fuente.

✅ **`browse.html`, hecha** (2026-09-14). Siete páginas fundidas en una, y los
árboles mudados desde `analysis.html`. Los catorce filtros se probaron contra las
cifras medidas sobre el corpus y aciertan todos. La raíz publicable bajó de 13,4 a
5,3 MB.

## 🔴 Lo que sigue pendiente

⚠️ **Las URLs viejas mueren al desplegar.** Las seis `DataTables_*.html` y
`DataQuery.html` están publicadas en Neocities; el próximo `pf.py deploy` las
borrará con `--delete`. Los enlaces del artículo y del índice ya apuntan a
`browse.html`, pero cualquier enlace externo o marcador se romperá. Si eso
importa, la salida es dejar redirecciones de una línea en su sitio.

⚠️ **Las estadísticas no se publican**, porque `despliegue.yaml` excluye `*.md` y
desde el 2026-09-14 viven dentro del `README.md`. Sigue pendiente pasar lo
importante a HTML, que era la idea al medirlo.


⚠️ **El `0OFFLINE` de 64 MB no está versionado.** Lo excluye `.gitignore` por la
convención de la casa. Ahí viven los datos de origen (Baxter-Sagart, la
descomposición de Wikimedia, makemeahanzi con su COPYING) y el `article.md` del
que salió el artículo. **Si se borra la copia del sitio, esto queda en un solo
sitio y sin historial.** Hay que decidir: una excepción en `.gitignore`, un
repositorio aparte para el dato, o una copia fuera del árbol.

⚠️ **El enlace de autoría del pie está muerto.** `aboutme.html` era del sitio y se
retiró del repo el 2026-09-14, pero `js/article-toolbar.js` sigue dibujando un
enlace a él. No he tocado el toolbar porque es cromo compartido por 74 páginas.
Se arregla cuando se decida quién sirve el cromo.

⚠️ **`js/article-toolbar.js` y `style/theme.css` quedan vendorizados.** Son cromo
del sitio, que usan 74 páginas. Hoy son idénticos al del sitio; si aquel cambia,
estos no se enteran. Es el problema del cromo que el `CLAUDE.md` de la raíz deja
abierto en su §3.

⚠️ **El enlace «Inicio» del toolbar cambia de destino.** Deduce su base del `src`
de su propio script, que ahora es `js/`, así que lleva al `index.html` del
proyecto y no al del sitio. Es lo correcto suelto y es un cambio respecto de lo
publicado.


⚠️ **Hay un enlace que sale del proyecto y solo resuelve en el sitio.** Es uno
solo, medido: `article.html` enlaza «procedimiento jeroglífico» a
`../desarrolloEscritura/desarrolloEscritura.html`, que vive en
`sitio-fuente/writing/desarrolloEscritura/` y **no tiene origen en el taller**: es
contenido propio del sitio, no la salida de ningún proyecto. Desplegado funciona;
abierto el repositorio suelto, da 404, y es el único de los 147 enlaces que lo
hace. Hay que decidir entre cuatro salidas, y ninguna es gratis:

| | |
|---|---|
| Dejarlo relativo | Funciona desplegado y muere suelto. Es lo de hoy |
| Ponerlo absoluto a `alerojorela.neocities.org` | Funciona en los dos sitios, pero clava el dominio en el texto y **sale a internet desde una página local** |
| Una `adapta:` en `despliegue.yaml` | Relativo en el sitio, absoluto en el repo. Exige que el paso de adaptación se automatice, que es el §3 del `CLAUDE.md` de la raíz |
| Deducir la base, como hace `article-toolbar.js` | El patrón que ya funciona en casa: el script mira el `src` de su propia etiqueta. Serviría para reescribir estos enlaces al abrir la página suelta |

Es el mismo problema del cromo del sitio visto por otra cara: **cosas que el
proyecto necesita y que no son suyas**. Conviene resolverlo con aquello.

⚠️ **El panel opaco de `main` se escribe una vez por página, y por eso se olvida.**
`style/theme.css` textura el `body`, y la regla que tapa esa textura
(`main { background-color: var(--clr-background) }`) vive en **dos hojas de
página**: `articulo.css` y `graphicOutput.css`. Una página que no cargue ninguna
de las dos sale con el patrón detrás de las letras, y eso le pasó a `index.html`
y a `browse.html`, las dos escritas el 2026-09-14. Arreglado en cada una por
separado. **El sitio de la regla es `style/common.css`**, que cargan las cinco,
pero esa hoja es cromo del sitio (§3 del `CLAUDE.md` de la raíz) y tocarla aquí
la bifurca. Se resuelve con la decisión del cromo.

⚠️ **`tools/binarydivision/` es una copia autónoma que ya no tiene gemelo.** Es
el Binary Tree Diagrammer interactivo de 2019; en `hierarchical-diagram-builder`
esa página **ya no existe con ese nombre**: su `binarydivision.html` es hoy un
visor empotrable para iframe y lo interactivo vive en su `index.html`. Así que no
hay nada que «actualizar», hay que decidir: o este proyecto conserva su copia y
acepta que diverja, o enlaza a la desplegada y se queda con un enlace muerto al
abrirlo suelto. **Es el mismo dilema del cromo del sitio** y se resuelve con él.
Los dos `.js` compartidos (`binarydivision.js`, `taxogrid.js`) sí quedaron
idénticos byte a byte el 2026-09-14.

⚠️ **El cambio de geometría de `binarydivision.js` no se ha visto renderizado.**
Los márgenes bajaron de `max(0.2·tamaño, 100)` a `max(0.1·tamaño, 30)` y se
añadieron 54 px abajo para las etiquetas terminales. Vienen probados de
`hierarchical-diagram-builder`, pero aquí los consumidores son otros
(`analysis.html` y `tools/binarydivision/`) y **conviene abrir los dos y mirar**
antes de desplegar.

⚠️ **El README está del revés respecto de la regla nueva.** El `CLAUDE.md` del
taller, corregido el 2026-09-14, dice que **mientras se trabaja hay un solo
`README.md` y va en castellano**, y que el par solo se parte al publicar, siendo
entonces `README.es.md` el original y `README.md` la traducción. Aquí pasa lo
contrario: **el único README es el inglés y el castellano no existe**, así que no
hay original del que salga la copia. Este proyecto es uno de los tres de la casa
en esa situación, con `basic_graph_editor` y `hierarchical-diagram-builder`.

Arreglarlo es traducir hacia atrás, y arrastra a `tools/build_stats.py`, que el
2026-09-14 se pasó al inglés para ir a juego con el fichero en el que escribe y
tendría que volver al castellano. **No se ha tocado**: es trabajo real y la
página ya está publicada en inglés, así que la decisión es del usuario. Las dos
salidas son dejarlo como está y anotar la excepción, o escribir el castellano y
que el inglés pase a ser lo que se genera al publicar.

⚠️ **`tools/binarydivision/readme/` sigue llamándose así, y con `readme.md` en
minúsculas.** El `readme/` de la raíz desapareció el 2026-09-14; este no se tocó
porque no es lo mismo: son ocho ficheros de documentación de la notación, con un
`explanation.pdf` y un `.dxf` **de los que no hay otra copia en la casa**. La
regla de la casa pide `README.md` con mayúsculas.

⚠️ **`tools/graph_export.py` sigue contando glifos y los árboles cuentan palabras.**
Desde el 2026-09-14 un par tradicional/simplificado es **un nodo** en la vista de
árboles y **dos** en el fichero que se exporta al editor de grafos. No está mal,
pero son dos modelos del mismo dato en el mismo proyecto: hay que decidir si el
exportador funde también, o si declara a propósito que él dibuja grafías.

⚠️ **Las familias semánticas no caben en el editor de grafos.** 艹 da 356 nodos y
lo mayor que el editor ha llevado son 216. Falta decidir si se poda por
profundidad, si se parte en lotes o si esa vista simplemente no va al editor.

⚠️ **Los pares tradicional/simplificado solo se ven entre hermanos.** La
detección compara hijos del mismo componente; un par repartido entre dos ramas
distintas no se empareja. Se detectan 602 grupos y no se sabe cuántos faltan.
Con una tabla de Unihan (`kSimplifiedVariant`) sería exacto en vez de heurístico.

⚠️ **La marca de neologismo dice menos de lo que se quería.** Es «sin atestiguar
en el corpus clásico», no «acuñado en el siglo XX», porque lo segundo no está en
el dato. Cubre los casos buscados (氫, 烴, 砼) pero también arrastra grafemas
antiguos que Baxter-Sagart no recoge.

⚠️ **El `index.json` del exportador pisa el del editor.** Si se vuelca en
`basic_graph_editor/samples/`, sustituye al índice de sus ocho muestras. De
momento conviene exportar a un directorio aparte.


⚠️ **Las seis tablas `DataTables_*.html` siguen solo en el sitio** (8,3 MB en
total). `article.html` enlaza a las seis y esos enlaces están muertos aquí. Falta
decidir si un repositorio debe cargar con 8,3 MB de tablas generadas o si el
artículo debe apuntar al sitio.

⚠️ **`article.html` enlaza a `../desarrolloEscritura/`**, que es otro proyecto del
sitio y no vive en este repositorio. Ese enlace queda roto por diseño **abierto
suelto, y resuelve una vez desplegado**: comprobado el 2026-09-14 que el fichero
está en el árbol del sitio. `pf.py revisar` lo daba por roto hasta ese día porque
preguntaba al árbol de salida, que está vacío.

⚠️ **`capture_family_radicals.png` es anterior al retema del visor** (2026-09-14,
14:35): enseña el panel blanco translúcido con el radical elegido en rojo, que ya
no existe. Hay una equivalente al día preparada en
`~/rdtest/propuesta_capture_family_radicals.png`, a la espera de decisión. Es
material del README y no se despliega, así que no bloquea nada.

✅ **Ramas `mit` y `cc-by` en la copia de este repo**, el 2026-09-14. Cada página
declara la suya con `data-license`: `mit` para `analysis.html` y `browse.html`,
que son la aplicación, y `cc-by` para la prosa. El `-NC` sobraba, pues decía que
el programa se puede vender y que el texto que lo explica no.

🔴 **Lo que queda es la copia del sitio**, que sigue estampando `cc-by-nc` en sus
74 páginas y ahora **diverge 74 líneas** de esta. El cierre de verdad es portar
allí las dos ramas, o resolver la decisión del cromo (`CLAUDE.md` de la raíz, §3).
`style/theme.css` y `style/common.css` siguen idénticas, comprobado con `cmp`.

⚠️ **Y hay un punto ciego que esto dejó a la vista.** El enlace de autoría del pie
llevaba muerto en las ocho páginas y no lo vio ningún comprobador, porque se
concatena en ejecución (`'<a href="' + bp + 'aboutme.html">'`) y `pf.py revisar`
descarta con razón toda cadena con un `+`. **Las referencias que construye un
guion no las revisa nadie**: se ven leyendo.

⚠️ **`useIPA` nunca ha funcionado.** Ahora que la librería está, la llamada sigue
comentada en `analysis.js` (`var ipa = undefined;//pinyin2ipa(...)`). Queda
descomentarla y probarla.

⚠️ **Divergen del sitio** `analysis.html` y `radialdiagram.js`. Falta ver cuál de
las dos copias va por delante antes de que un despliegue decida por su cuenta.

## Lo que quedó abierto en el navegador radial (2026-09-14)

⚠️ **`getParentNodes` recorre las 9574 entradas una vez por nodo.** Para 口 son
413 nodos, o sea **cuatro millones de iteraciones y 1,8 s de bloqueo** al abrir
el carácter. La cura es barata y es un índice inverso construido una sola vez al
cargar el dato: `{componente: [grafemas que lo usan]}`, que ya se calcula de
hecho en cada llamada. Bajaría a milisegundos. No lo he tocado porque no era el
encargo, pero es lo que más se nota al usar la página.

**El control Up/Down es un `<input type="range" min="0" max="1">`**, un
deslizador de dos posiciones para lo que es un interruptor, y avisa de lo
imposible **tachando una etiqueta**. Dos botones de opción dirían lo mismo sin
que haya que descubrirlo. Tampoco dicen qué sube y qué baja: «Up» es *de qué está
hecho* y «Down» es *qué compone con él*, o al revés según se mire.

**El desvelado del zoom es escalonado y quizá convenga suavizarlo.** Los hijos
de un radical pesan todos lo mismo, luego tienen el mismo arco y aparecen a la
vez: para 口 son 7 etiquetas a 1×, 9 a 1,6×, 87 a 2,6× y las 412 a 4,1×. Suavizarlo
exigiría un criterio para ordenar la entrada de los hermanos: frecuencia de uso,
número de trazos. Ninguno sale del dato que hay, y puede que no merezca la pena.

**Queda por ver en pantalla de densidad doble.** Las etiquetas se dimensionan en
unidades del `viewBox`. Desde el 2026-09-14 el `<svg>` lleva `width` y `height`
en píxeles con el mismo número que el `viewBox`, así que una unidad es un píxel
**de CSS**; lo que no se ha probado es qué pasa con un `devicePixelRatio` de 2,
donde el umbral de 9 px puede quedarse corto o largo.

## Lo que quedó abierto al arreglar el canvas (2026-09-14)

Ninguno estorba hoy; se anotan para que no se redescubran.

⚠️ **El canvas se rasteriza al tamaño en píxeles CSS**, así que en una pantalla
de densidad doble el árbol sale borroso. `drawInlineSVG` tendría que multiplicar
`canvas.width/height` por `devicePixelRatio` y escalar el contexto, dejando el
tamaño visible al CSS. Es un cambio pequeño y no lo he hecho porque toca
`js/taxogrid.js`, que es del linaje compartido y lo usan más páginas.

⚠️ **`drawInlineSVG` dibuja de forma asíncrona y sin guarda.** Pinta en
`img.onload`; si se piden dos dibujos seguidos, el primero puede llegar después
del segundo y quedarse encima. Hoy no pasa porque solo se dibuja al cambiar de
carácter, que es lento comparado con un `data:` URL.

⚠️ **Las etiquetas terminales se pisan si alguien pone texto largo** en
`namesubstrings`. Aquí no ocurre, porque `analysis.js` mete ahí la transcripción
(`hàn`, `shuǐ`), pero sí le puede ocurrir a `hierarchical-diagram-builder`, que
etiqueta con palabras. Escribí un ensanchado automático de la celda y lo retiré:
resolvía el solape a costa de multiplicar el lienzo por veinticinco. Si se
retoma, hay que acotar el crecimiento o partir la etiqueta en varias líneas.

⚠️ **Peso muerto en `jsexternal/`**: `TextFit-master/` es un directorio VACÍO y
`fitty.min.js` (3,7 KB) lo carga un `<script>` que está comentado. El ajuste de
texto lo hace `fittext()`, escrito a mano. Decidir si se borran las dos cosas.

**Nota de diseño, no defecto.** `#treesection` enseña el mismo árbol dos veces:
dibujado en el `<canvas>` y listado en `#definitiontree`, y solo la lista trae
las definiciones. Es parte del muestrario de representaciones de la pestaña de
descomposición y se deja a propósito. Pero es la razón por la que meter también
las definiciones en el canvas no sale a cuenta: cinco definiciones en fila no
caben en la caja a ningún tamaño legible.

**El par de idiomas usa un convenio contrario al del sitio.** Aquí
`article.html` es el inglés y `article.es.html` el castellano, como
`README.md` / `README.es.md`. El toolbar del sitio, que usan 74 páginas, hace lo
contrario: `X.html` castellano y `X_EN.html` inglés. La copia vendorizada
entiende los dos, pero la divergencia con el cromo del sitio crece.

## Del README original

~~Mejorar el escalado del texto~~ ✅ hecho el 2026-09-14: `fittext()`
mezclaba píxeles y `em`. Añadir una pestaña de ejemplos con oraciones
relacionadas con los componentes. Obtener el dato de orientación (⿰ o ⿱).
Mejorar el selector de logogramas: multiselección.
