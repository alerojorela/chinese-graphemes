# CHANGELOG

## 2026-09-14 21:43 · Fuera el histórico del README, y el castellano no se recrea

**El README contaba de dónde venía `browse.html` y a nadie le sirve.** Lo dijo el
usuario: un párrafo entero explicando que sustituyó a siete páginas —seis
`DataTables_static_*.html` y una `DataQuery.html`— con 8,1 MB de HTML generado.
Eso es crónica, y la crónica vive aquí, no en el manual. La sección queda en lo
que sí contesta: `browse.html` es el conjunto, `analysis.html` es un carácter, y
de ese reparto sale dónde va cada cosa.

**Eran cuatro menciones y no una, y dos las escribía el guion.** Buscar el nombre
de la página muerta lo enseñó: además del párrafo había una explicación de la
selección por enumeración que se definía por lo que hacía la página vieja, y
otras dos **dentro del bloque generado**, en `tools/build_stats.py`. Un README que
se genera no se arregla editando el README: al volver a ejecutarse, vuelve. Se
tocaron las dos líneas del guion, se regeneró, y ahora **no queda ninguna
mención** ni en el documento ni en el generador.

Las dos que se reescribieron en vez de borrarse decían algo útil por debajo del
nombre propio, y se quedan diciéndolo sin él: la enumeración «no la sustituye
ningún filtro, porque una lista de vocabulario de un libro de texto no es una
propiedad», y la fila de la tabla pasa a decir qué hace, «solo sobreviven los
caracteres que pegues».

**Y el README castellano no existe ni existió.** Antes de ponerse a traducir se
midió el trabajo —**216 líneas a mano y 275 generadas**, de 490— porque las
salidas posibles eran muy distintas: o un guion bilingüe, o una traducción que
empezaría a divergir en la siguiente ejecución.

⚠️ **Luego se buscó en el historial, que es lo que faltaba por hacer.** La
sospecha era razonable: si el castellano fue el original, tenía que estar en un
commit viejo bajo el nombre `README.md`. Revisados **los cuatro que han existido
en el repositorio**, están los cuatro en inglés, incluido el del commit inicial,
que son **39 bytes de título**; y la copia que conserva el árbol congelado en su
`0OFFLINE` es el mismo fichero de 2.068 bytes. **Nunca hubo original castellano de
este README.** Lo que sí está en castellano es el artículo, `article.es.html`, que
es otro documento y sigue en su sitio. Queda anotado en el
[`CLAUDE.md` del taller](../../../../CLAUDE.md) como cerrado por hecho, no como
deuda pendiente.

Comprobado que el bloque generado vuelve a salir **idéntico** tras el cambio, así
que la próxima regeneración no reabre nada.

## 2026-09-14 21:32 · La dirección dice qué se está mirando, y revisión final

**La URL se escribe, no solo se lee.** Decía el carácter únicamente si habías
llegado por uno, y nunca decía la pestaña: una vista de Family se podía mirar
pero no mandar a nadie. Ahora la dirección se normaliza al cargar y se reescribe
al cambiar de pestaña.

**`replaceState` y no `pushState`**, porque aquí nada es una página nueva: otra
pestaña es el mismo carácter visto por otro lado, y hacer que Atrás recorra eso
prometería un historial que esta página no tiene. **Cambiar de carácter ya es una
navegación de verdad** —el selector abre `?q=` en ventana nueva y cada logograma
del texto es un enlace—, así que ahí no hay nada que escribir.

⚠️ **Y hace falta una guarda que no es ceremonia.** El guion corre mientras la
página aún se está analizando, y el primer `selectTab` se ejecuta mucho antes de
que `onload` lea `?q=` de la dirección: escribir entonces **borraría el parámetro
que la página está a punto de leer**. De ahí `urlReady`.

Medido, las cinco llegadas:

| Llegas con | Queda escrito |
|---|---|
| nada | `?q=喻&tab=decomposition` — el carácter por defecto se vuelve direccionable |
| `?q=蠮` | `?q=蠮&tab=decomposition` |
| `?q=口&tab=family` | igual, y al volver a Decomposition se reescribe |
| `?tab=family` | `?q=喻&tab=family` |
| `?q=口&tab=disparate` | `?q=口&tab=decomposition`, el carácter intacto |

Comprobado además que lo escrito va percent-codificado y **se vuelve a leer
igual**: `?q=%E8%A0%AE` → releído 蠮.

### Revisión final

| Qué se miró | Resultado |
|---|---|
| Las ocho páginas, errores de JavaScript | **ninguno**, y las ocho dibujan su pie |
| Maquetación: 4 caracteres × 6 anchuras | **cero área desnuda en los 24**; la página solo se desplaza en el diseño estrecho, que es lo previsto |
| Centrado de los logogramas | desequilibrio medio 1,1 / 1,5 / 1,8 px en 蠮, 啊 y 呵; margen mínimo +4 px |
| Licencias | las ocho declaran la suya: `mit` las dos aplicaciones, `cc-by` las seis de prosa |
| Referencias locales | todas resuelven, salvo dos que son otra cosa (abajo) |
| Qué subiría git | 41 ficheros sin seguir, **todos contenido del proyecto**; `0OFFLINE/` queda ignorado |

**Dos enlaces salen del proyecto y solo funcionan desplegados**, comprobado uno a
uno contra el árbol congelado: `../../tools/hierarchical-diagram-builder/index.html`
(los dos enlaces bajo los taxogramas, en `analysis.html`) y
`../desarrolloEscritura/desarrolloEscritura.html` (en los dos `article`). Es el
precio de que el proyecto sea autónomo y siga citando a sus vecinos del sitio.
⚠️ **Y matiza lo que dice `despliegue.yaml`**, que afirma que sus rutas son las
mismas suelto y desplegado: lo son para todo lo suyo, no para estas dos.

**Una frase se había quedado sin traducir** en `graphemesCulturalHints.html`, que
es la versión inglesa: «`y 卟` … `También 卦` … `o 拈`». Traducida. Barridas las
seis páginas inglesas y las dos castellanas, **no queda ninguna otra mezcla**.

**Y los cuatro comentarios en castellano de `analysis.html` pasan al inglés**, por
la regla de migrar el fichero que se toca. El fichero queda en cero.

⚠️ **Dos bibliotecas muertas siguen desplegándose**: `jsexternal/fitty.min.js` y
`jsexternal/TextFit-master/`, 12 KB, cuyas etiquetas `<script>` y cuyas llamadas
llevan comentadas desde que `fittext()` hace ese trabajo. No molestan, pero
tampoco hacen nada. **Y el `grep` que las busca las encuentra igual**, porque
casa dentro del comentario: es la segunda vez esta sesión que un acierto de
patrón parece vivo y no lo está.

## 2026-09-14 21:16 · La URL admite pestaña, y las cuatro capturas se pulsan

`analysis.html` solo leía `q`, así que una captura de la pestaña Family no se
podía enlazar: el enlace habría aterrizado en Decomposition, o sea en algo
distinto de lo que la foto enseña. Ahora lee también **`tab=decomposition` o
`tab=family`**, y lo que no reconoce **lo ignora en vez de discutirlo**: una URL
que nombre una pestaña que esta página no tiene debe abrir el carácter igual.

**La lógica de cambiar de pestaña estaba escrita tres veces**, una por botón más
la del arranque, y ahora es una función, `selectTab()`. No es orden por el orden:
de las tres copias **solo una llamaba a `drawDiagram()`**, que es lo que el
anillo necesita. Y el orden dentro importa y es la razón de que sea función y no
dos líneas: el diagrama **mide la caja en la que se dibuja**, así que el panel
tiene que estar visible antes. Al revés lee una anchura de cero y no dibuja nada.

También va después de `Run()` al arrancar, porque el anillo se dibuja con los
datos que `Run()` es quien carga.

Medido en el navegador, los cinco casos:

| URL | Resultado |
|---|---|
| `?q=口` | Decomposition, svg sin dibujar |
| `?q=口&tab=family` | Family, **svg 656×656 con 413 sectores** |
| `?q=口&tab=decomposition` | Decomposition |
| `?q=口&tab=disparate` | Decomposition, y el carácter carga igual |
| `?tab=family` sin `q` | Family sobre el carácter por defecto |

Y los botones, que cambiaron de manejador: pulsar Family dibuja (svg 656) y
volver a Decomposition deja la clase y los radios como estaban.

**Las cuatro capturas del README son ahora enlaces**, con su pestaña explícita.
La de 見 hubo que averiguarla, porque **el selector de radicales tapa el carácter
del centro**: se leyeron las etiquetas del anillo ampliando la imagen (覽, 攬,
欖, 觀, 親, 襯, 靚) y se comprobó contra el anillo que la página dibuja para 見,
que devuelve esas mismas. No se supuso: se coteja.

**Y la tabla de ficheros decía «four tabs» y son dos**, que la tercera lleva
comentada desde antes. Corregido, y de paso la fila documenta los dos parámetros,
que es donde alguien los buscará.

## 2026-09-14 21:10 · Las capturas de descomposición llevan al visor

El usuario rehízo las dos capturas de la pestaña Decomposition y borró las
demás. Los nombres pasan a decir qué contienen —`capture_decomposition_蠮.png` y
`capture_decomposition_呵.png`— y el README las repunta: **las dos referencias
anteriores apuntaban a ficheros que ya no existen**.

**Y ahora se pulsan.** Cada una envuelve su imagen en un enlace a
`analysis.html?q=` con su carácter, en la misma forma de URL absoluta al sitio
que el README ya usaba para los caracteres del texto, así que funciona también
leído en GitHub. Las dos capturas muestran la pestaña Decomposition, que es la
que abre por defecto, de modo que **lo que se ve al llegar es lo que había en la
foto**.

呵 se gana además su pie, porque es el ejemplo que la sección de la interfaz
necesitaba: 口 «boca» da el sentido y 可 kě da el sonido, y 可 es a su vez
compuesto, con 口 haciendo de sonido sobre 丁 de sentido. **Los mismos dos
colores en los dos niveles**, que es justo lo que la clave de color explica.

⚠️ **La leyenda decía de más y se corrigió antes de dejarla.** Escribí «todas las
capturas de abajo son enlaces» cuando las dos de Family aún no lo eran. Se
retiró, y luego se ganó: ver la entrada de las 21:16.

Comprobado que el bloque entre `<!-- BEGIN STATS -->` y `<!-- END STATS -->`
sigue en las líneas 177 a 452 y que los enlaces caen fuera: ejecutado
`tools/build_stats.py`, el fichero sale idéntico, así que la próxima regeneración
no se los lleva.

## 2026-09-14 21:00 · El guion medía un glifo y la página dibujaba otro

**Los logogramas de los taxogramas caían bajos y cruzaban el borde inferior de su
celda.** La causa está dos capas por debajo de donde parecía, y son dos fallos
encadenados.

**Uno: el DOM y el `canvas` no usaban la misma fuente.** `graphicOutput.css` le
da a la página `'Century Gothic', 'Arial Narrow'`. Ninguna de las dos está
instalada aquí y ninguna de las dos tiene un glifo chino, así que el navegador
recurría a una fuente de reserva **elegida por el idioma del documento**.
`measureText` no conoce el idioma, así que podía resolver otra. Y lo hacía: para
矢 el `canvas` declaraba 33 px de tinta sobre la línea base y 5 por debajo,
mientras que lo pintado medía 19 y 13. El guion medía un glifo y la página
dibujaba otro. **Nombrar la familia CJK** en `.fittedtext` hace que los dos
respondan lo mismo, y de paso deja de depender de una reserva que nadie declaró.

**Dos: la sonda de la línea base estaba mal, y era la pieza en la que más
confiaba.** Medía con un `<span>` de tamaño cero, con el argumento de que medir es
mejor que modelar. Lo es cuando la medida es buena, y esta no lo era: **se
equivocaba en 10,7 px sobre un glifo de 37,6**, y el desplazamiento construido
sobre ella empujaba cada logograma por debajo de su celda. La aritmética que la
sustituye es la que la propia fuente contesta, media interlínea más su ascenso
(`fontBoundingBoxAscent`), y cae dentro de un píxel de lo que se pinta.

Medido celda por celda contra los píxeles, en los trece cuadros de 蠮:

| | antes | ahora |
|---|---|---|
| margen arriba | +11 a +25 px | +5 a +17 |
| margen abajo | **−2 a +5 px** | +4 a +18 |
| desequilibrio medio | 12,5 px | **1,1 px** |

Y con 啊, que incluye 一: margen mínimo +5 px, desequilibrio medio 1,5. 一 sigue
saliendo pequeño, que es lo que debe: el cuadratín manda el tamaño para que todos
los caracteres salgan iguales, y sólo se **encoge** cuando la tinta no cabe.

**De paso, la holgura se prometía al cuadratín y no a la tinta**, que es otra
promesa: un glifo denso pinta fuera de su cuadrado. 大 salía con 41 px de tinta en
un cuadratín de 40,5 dentro de una celda de 45, así que del 10 % de aire que el
`* 0.9` pretendía dejar quedaban **2 px**. Ahora el tope se aplica a la tinta, en
los dos ejes.

**Y el movimiento se hace con `top` en vez de `transform`.** Se ve igual en
pantalla, pero `transform` lo resuelve el compositor y hay caminos de renderizado
que se lo saltan. El fichero ya traía, comentado, ese mismo enfoque.

⚠️ **Tres errores míos de método, que costaron más que el arreglo.**

1. Colorear los glifos para localizarlos con **rojo y azul puros**, que son los
   colores que esta página usa para fonético y semántico: las dos primeras
   mediciones salieron contaminadas con tinta de otros elementos.
2. Comparar píxeles de la captura contra coordenadas del DOM. **No coinciden**:
   una marca insertada por el guion cae 1:1, pero el contorno de un elemento de la
   página cuyo rectángulo el DOM sitúa en y=181,7 se pinta en y=198. Lo que sí
   vale es contornear el contenedor y medir la tinta contra **su propio contorno
   dentro de la misma imagen**.
3. Dar por bueno un control negativo. Para comprobar si el desplazamiento influía
   se puso `transform: none !important` en línea y la imagen no cambió, de lo que
   se concluyó que la captura ignoraba las transformaciones. **Falso**: una
   llamada posterior de `fittext` reescribe `style.transform` y borra la
   declaración entera, importancia incluida. La captura nunca mintió, y esa
   conclusión equivocada mandó la investigación por un desvío largo.

## 2026-09-14 20:31 · La sonda que medía la línea base cambiaba lo que medía

**Los logogramas de los taxogramas se salían de su casilla, y no era el tamaño.**
Se probó primero lo evidente: quitar el desplazamiento vertical y volver a
capturar. Salió **idéntico**, así que el centrado no era el culpable y el tamaño
tampoco: las celdas cuadradas de 45×45 quedaban bien y las rectangulares no.

**El mecanismo es que la medición se estorbaba a sí misma.** `fittext()` busca la
línea base metiendo dentro del elemento un `<span>` de tamaño cero y preguntando
dónde ha caído. Pero estas celdas se dimensionan para que la caja de contenido
mida casi exactamente el avance de un glifo, así que **esa sonda no cabe en la
línea y salta a la siguiente**. Entonces devuelve la base de la segunda línea, y
además de un elemento que acaba de doblar de alto y que su padre `flex` ha vuelto
a centrar. Medido: el elemento de `羽` pasa de **87 px a 168** con la sonda
dentro, y el de `矢` de **46 a 87**; los de `中` y `习` no saltan. Por eso unas
casillas salían bien y otras fuera por media celda.

La cura es `white-space: nowrap` mientras la sonda está puesta. Comprobado en los
trece glifos de 蠮: ninguno salta, el error de centrado es **0,0 px en todos** y
ninguna tinta se sale de su celda. Y el rastro que lo confirma son los propios
desplazamientos: antes iban de **−32,5 a +13,3 px con los signos mezclados**;
ahora van de **+6,7 a +13,3, todos positivos**, que es justo lo que predice la
asimetría de un glifo CJK, dibujado alto en su cuadratín y que hay que bajar.

⚠️ **Y una advertencia sobre el banco de pruebas, que costó más que el arreglo.**
Comparar píxeles de una captura contra coordenadas del DOM **no es fiable aquí**.
Dos trampas, las dos mías: colorear los glifos con rojo o azul puros, que son los
colores que la página ya usa para fonético y semántico, contamina la medida; y
los contornos CSS aparecen en la captura escalados 1,1167 respecto a lo que
`getBoundingClientRect` declara, mientras que un `div` que yo mismo inserte cae
1:1. Calibrado con marcas absolutas y fijas: las marcas caen exactas, los
contornos no. **La conclusión operativa: medir en coordenadas del DOM, y usar las
capturas solo para mirar.** Lo que aquí probó el fallo y probó la cura fueron
números del DOM, no píxeles.

**Segundo asunto, el hueco entre los taxogramas y los árboles.** Era real y tenía
tres sumandos, todos de la misma familia: espacio reservado para lo que no está.

| Qué | Cuánto |
|---|---|
| `justify-content: space-around` repartía el aire **entre** los paneles, no alrededor del grupo, así que cuanto más llano el carácter, más grande el agujero central | 198 px entre taxogramas y árbol con 口 |
| `.WarningArea`, vacío casi siempre, seguía siendo un elemento `flex` y cobraba su parte del reparto | una ración entera |
| `#notaphonosemantogram`, que solo algunos caracteres tienen, hacía lo mismo | 34 px más su separación, medido en 蠮 |
| `#treesection` con `height: 50%` reservaba media columna fuese cual fuese el árbol | 145 px de contenido en una caja de 338 |

Agrupado con `center` y una separación fija, ocultas las dos secciones cuando
están vacías, y con la sección del árbol ajustada a su contenido **pero
conservando el tope del 50 %**, que es contra lo que `#definitiontree` mide su
`max-height` y lo que impide que un árbol hondo se coma la columna. El hueco pasa
de **198 px a 85** con 口 y a **25** con 蠮, y deja de depender de la profundidad
del carácter.

**De paso, la misma costura por el otro lado.** En el diseño estrecho el `body`
llevaba `height: auto`, y con un carácter llano salía **más corto que la
ventana**: medido en 口 a 600 px de ancho, el `body` terminaba en 475 con la
ventana en 719, y esos 244 px los pintaba `<html>` solo, sin la textura. Ya
existía antes de todo esto. Con `min-height: 100vh` desaparece. Verificado en tres
caracteres por seis anchuras: **cero área desnuda en los dieciocho casos**.

## 2026-09-14 15:57 · El esquema no cabía en su panel, y eran tres fallos a la vez

**Lo que se veía eran tres cosas, y la causa era una.** Al desplazarse con 蠮
asomaba una banda de otro color por debajo, la tira de pestañas se cortaba a
media página, y antes de eso asomaba además la textura. Las tres salen de que
**`#definitiontree` no cabe en su sección y se sale de ella** en vez de crecer.

Medido a 800 px de ancho: **1079 px de esquema dentro de una sección de 298**, y
como `#treesection` centra verticalmente, el sobrante se reparte arriba y abajo.
Por arriba se dibujaba encima de los paneles de descomposición; por abajo
empujaba el documento a **1051 px en una ventana de 719**. Y ahí está la clave:
`main` se quedaba en 688 y el `aside` de las pestañas en 719, así que esos 332
píxeles finales **no los alcanzaba ningún elemento del diseño**. Lo que se veía
en ellos era el lienzo de la página, y la tira de pestañas terminaba antes que
la página, que es exactamente «recortada».

Se buscó el culpable en vez de suponerlo: un recorrido por el árbol preguntando
qué elementos pasan del borde inferior devolvió **`#definitiontree` y nada más**;
todo lo demás de la lista era contenido suyo arrastrado.

**La cura la dicta el vecino.** `#tree`, el lienzo de al lado, ya dice
`max-height: 100%`: un mapa de bits se escala entero y se queda dentro. El texto
no puede escalarse, así que se desplaza. Con `max-height: 100%` y
`overflow: auto` en `#definitiontree`, el documento vuelve a medir **exactamente
una pantalla de 700 px de ancho en adelante**, y en el diseño estrecho, donde la
página sí debe desplazarse, `main` llega al final del documento: **cero área
desnuda a todas las anchuras medidas** (1400, 1200, 1000, 800, 700, 600, 480).

**Y el arreglo traía su propio defecto, que se vio al mirarlo.** Es el primer
desplazador que este diseño tiene a propósito, y por tanto el primero al que hay
que decirle en qué tema está: sin decírselo salía **blanco del sistema**, la cosa
más brillante de una página oscura. Vestido con `scrollbar-color` y las reglas
`-webkit-` equivalentes, queda en una línea fina del color de los controles.
Comprobado en los dos temas.

**El fondo en `<html>` se queda, pero su comentario ya mentía.** Describía un
desbordamiento que acaba de dejar de existir. La regla sigue porque cuesta una
declaración y es la respuesta honesta a de qué color es la página por debajo,
además de cubrir el rebase del panel táctil; el comentario ahora dice eso y no
otra cosa.

## 2026-09-14 15:39 · Al desplazarse asomaba la textura, y `0OFFLINE` adelgaza 24 MB

**La textura del fondo se veía por debajo del contenido al bajar.** No era un
fallo del fondo sino de quién lo pinta: `theme.css` le da a `<body>` una textura,
que es el aspecto del sitio, y `graphicOutput.css` la tapa con un `main` opaco de
exactamente una pantalla de alto. Eso aguanta hasta que la página se desplaza, y
entonces lo que asoma bajo lo desplazado es la textura, que ahí no es un fondo
sino una costura.

**Y se desplaza por una razón que no es la profundidad sino la anchura.** Con 蠮,
que es el carácter más hondo del juego, el esquema de la derecha envuelve más
líneas conforme se estrecha la ventana, desborda su propia sección y empuja el
documento más allá de `main`, que sigue midiendo una pantalla. Medido a 1000 px
de ancho: **documento de 746 px en una ventana de 719**, con esos 27 píxeles
texturados. A 900 son 800, y a 800 son 1051.

La cura es una línea y está donde debe: **el color plano va en `<html>`**. El
lienzo de la página lo pinta `<html>` si tiene fondo, y si no se propaga el de
`<body>`, que es justo por donde entraba la textura. Con el fondo en `<html>`,
toda el área desplazable queda plana y `<body>` conserva su textura dentro de su
propia caja, bajo la barra de artículo, que es el único sitio donde se veía a
propósito. Comprobado leyendo qué elemento pinta el lienzo en cada versión:
antes `<body>` **con textura**, ahora `<html>` **plano**.

**`0OFFLINE` pasa de 68 MB a 44**, y de 61 ficheros a 46. Se fueron ocho cosas,
ninguna de ellas información que se pierda:

| Qué | Tamaño | Dónde sigue viva |
|---|---:|---|
| `data/1/data.zip` | 12 MB | su `graphics.json` era **idéntico por sha256** al extraído al lado; su `dictionary.json` sobrevive como `dictionary.js` |
| `tablas-estaticas-sustituidas_OLD/` | 8,1 MB | las siete páginas están en `sitio-web_ORIGINAL/`; normalizadas, la única diferencia eran las rutas relativas, 9 líneas por fichero |
| `data/derivedmergeddata2.js` | 3,6 MB | mismas 9574 entradas que el vivo, **sin el bloque Baxter-Sagart**: la construcción anterior |
| `BaxterSagart...xlsx.zip` | 512 KB | contenía el `.xlsx` de al lado, byte a byte |
| `inventario.html` | 32 KB | lo regenera `tools/build_inventory.py` |
| `radialdiagram.html` | 20 KB | prototipo suelto, hoy dentro de `analysis.html` |
| `DataTables_dynamic.html` | 16 KB | la octava tabla, sustituida por `browse.html` |
| `readme.md` | 4 KB | el README anterior |

⚠️ **Dos que parecían candidatas y no lo eran, por el nombre.** Los ficheros de
`d3/` con «(copia)» **no son copias**: `DisplayCircularPacking (copia).csv` son
173 KB frente a los 521 bytes del original. Y `article.md` es **el original
castellano del artículo**. Comprobar antes de creerse un nombre.

⚠️ **Y otro tropiezo propio del mismo tipo que el `rsync` de las 14:44**: un
`heredoc` con ruta relativa, lanzado desde el directorio del proyecto, dejó un
`snip-seam.js` dentro de `phsemgram`. Se vio al fallar el mandato siguiente. Ya
van dos: **una ruta relativa detrás de un `cd` encadenado es una trampa**, y en
este flujo de trabajo toca escribir las dos rutas absolutas siempre.

## 2026-09-14 15:32 · La introducción del README vendía poco, y confundía cuatro palabras

**El gancho estaba en el dato y no se estaba usando.** La introducción decía que
los caracteres chinos son logogramas y que la mayoría se componen de un fonético
y un semántico, que es cierto y no le da a nadie ganas de abrir nada. La cifra
que sí lo hace ya estaba medida unas líneas más abajo: **de los 9574 caracteres,
solo 227 son dibujos de lo que significan, el 2,4 %**. La idea popular de la
escritura china cubre dos de cada cien caracteres.

Ahora abre con eso, sigue con que las ecuaciones **anidan**, y lo enseña con la
cadena entera de 蠮: 虫 + 翳, 翳 = 羽 + 殹, 殹 = 殳 + 医, 医 = 矢 + 匸. Cinco
niveles antes de agotarse.

**Y se separan las cuatro palabras que se usaban como una.** Pictograma,
ideograma, logograma y fonosemagrama no son grados de lo mismo: lo que los
distingue es **a qué apunta el signo**, y por eso un pictograma y un ideograma
**no son logogramas**, pues apuntan a cosas y a ideas y no a palabras. Una señal
de tráfico no es escritura. De ahí se sigue lo que el README nunca decía con
claridad: todo carácter chino en uso **es** un logograma, y pictográfico,
ideográfico o fonosemántico no dicen lo que un carácter *es* sino cómo se
**diseñó**, que es justamente lo que guarda el campo `etymology.type`.

⚠️ **Todos los ejemplos se comprobaron contra el dato antes de escribirlos**, y
uno salió mal: yo había escrito que 蠮 es una avispa y el dato dice **bee**.
Corregido. Los demás verificados uno a uno: 木 y 口 pictográficos, 林 y 灾
ideográficos, 蠮 pictofonético con 虫 semántico y 翳 fonético.

De paso, **el párrafo de las pestañas llevaba desde hoy mismo mintiendo**: decía
«las tres primeras pestañas» y «la cuarta, Trees», y desde las 14:28 hay dos y se
llaman Decomposition y Family.

Comprobado que las cuatro imágenes resuelven, que los cinco enlaces
porcentuales decodifican a 口 木 林 灾 蠮, y que `build_stats.py` sigue encontrando
sus marcas y reproduce su bloque sin una línea de diferencia.

## 2026-09-14 15:04 · El pie decía dos cosas falsas en las ocho páginas

Salieron al preparar la subida, y ninguna la caza un comprobador.

**Todas las páginas estampaban CC BY-NC mientras el `LICENSE` dice MIT.** El
`-NC` añade una restricción no comercial que el MIT del código no tiene:
mantener las dos a la vez es decir que el programa se puede vender y que el texto
que lo explica no. La regla de la casa lo prohíbe desde el 2026-08-26 y el
arreglo llevaba pendiente desde entonces **porque el `article-toolbar.js` vivía
solo en el sitio**; eso dejó de ser cierto el 2026-09-14, cuando este proyecto se
volvió autónomo y se trajo su copia.

Ahora la barra sabe tres licencias en vez de dos, y **cada página declara la
suya**, que no es la misma para todas:

| | |
|---|---|
| `mit` | `analysis.html`, `browse.html`: son la aplicación, y una aplicación es software |
| `cc-by` | `article`, `graphemesCulturalHints`, `sources`, `index`: son prosa |

El MIT va en texto y sin icono, con la redacción que ya usaba
`tools/binarydivision/binarydivision.html`. No se inventa un icono que no existe.

**Y el enlace de autoría estaba muerto en las ocho.** La barra escribía
`aboutme.html` junto a la página; este proyecto no lo tiene, y desplegado en
`writing/chineseGraphemes/` el sitio tampoco, porque el suyo vive en la raíz.
Muerto suelto **y** muerto desplegado. Ahora la barra acepta `data-about`: sin el
atributo hace lo de siempre, con valor enlaza donde se le diga, y **vacío escribe
el nombre sin enlace**, que es lo único correcto en los dos sitios a la vez, pues
un enlace a la raíz del sitio rompería la copia suelta y uno absoluto ataría el
proyecto a un dominio.

⚠️ **Por qué no lo había visto ningún comprobador**: el enlace se concatena en
ejecución, `'<a href="' + bp + 'aboutme.html">'`, y un escáner descarta con razón
toda cadena con un `+` dentro. Las referencias que construye un guion son un
punto ciego de la revisión previa, y se ven leyendo.

⚠️ **El precio, que hay que anotar porque nadie avisará**: `js/article-toolbar.js`
**deja de ser idéntico al del sitio**, 74 líneas de diferencia. `style/theme.css`
y `style/common.css` siguen iguales. Es la divergencia que el `CLAUDE.md` de la
raíz §3 avisaba que traería cada proyecto que se volviera autónomo antes de
resolver el cromo; aquí se ha pagado a sabiendas, porque la alternativa era subir
una página que se contradice con su propio `LICENSE`.

**El icono `license_NonCommercial.png` se queda** aunque ninguna página lo use ya:
la rama `cc-by-nc` sigue viva en la barra y es la de por defecto. Un camino de
código que apunte a un fichero borrado falla en silencio, y 2,9 KB no valen eso.

## 2026-09-14 14:50 · El logograma se centraba por su caja y no por su tinta

Lo vio el usuario en `?q=番`: el carácter se salía por arriba de su casilla y
abajo le sobraba sitio.

**Ajustar el tamaño y centrar son dos trabajos distintos, y solo se hacía el
primero.** Un glifo CJK se dibuja dentro de un cuadratín que su tinta ni llena ni
ocupa por el centro: medido sobre 番 a 161,6 px, la tinta sube **134 px sobre la
línea base y baja 14**. Centrando la CAJA, la tinta queda a **4,1 px del borde de
arriba y a 27,7 del de abajo**; se lee como que rebosa, y con una tipografía de
ascendente algo mayor rebosa de verdad.

Ahora se mide la tinta con `measureText`, se localiza la línea base con una sonda
de tamaño cero (las métricas de la tipografía no se alcanzan desde CSS) y se
desplaza el glifo lo justo para que el centro de la tinta caiga en el centro de
la casilla. **Comprobado en las diecisiete casillas de 番, 躑 y 一: holgura igual
arriba y abajo con menos de 0,1 px de diferencia**, y sin desviarse tras cinco
pasadas seguidas ni al cambiar de tamaño de ventana.

**El cuadratín sigue siendo la regla para el TAMAÑO, y es una decisión, no un
descuido.** Medir el tamaño por la tinta agrandaría 一 diez veces para llenar la
celda, porque su tinta es la décima parte de su cuadratín; la escritura china se
dibuja sobre un cuadrado uniforme justamente para que todos los caracteres salgan
del mismo tamaño. Lo único que se corrige por tinta es un glifo cuya tinta se
salga del cuadratín, que entonces se reduce.

Vale para las tres vistas, porque `taxogrid.js` marca también con `fittedtext`
las celdas de su rejilla: en 番 se arreglan de paso el 丿, el 木, el 丷 y el 田.

⚠️ **Y una prueba propia que salió mal y enseñó otra cosa.** Para comprobar el
reajuste quité el alto en línea de `.squared` y volví a llamar a `fittext`: la
celda se quedó en 26 px y el texto en 20. No era un fallo del ajuste sino de la
prueba, porque ese alto lo pone `Update()` con `$('.squared').width('25vh')`. De
paso queda claro por qué el redimensionado funciona sin recalcular las celdas:
**están en `vh`, así que siguen a la ventana solas** y a `onresize` solo le toca
reajustar el texto.

## 2026-09-14 14:44 · Los radicales no cabían en su casilla, y el velo escondía su propio final

**Medido: la casilla era de 18x19 px con un glifo de 16 px dentro.** Descontado
el borde, el hueco de contenido eran **16 px justos para una tinta de 16**, o sea
que un radical denso como 鬱 tocaba los cuatro lados. Y las casillas eran
`inline`, que no ocupa alto: los bordes de una fila llegaban a tocar los de la
siguiente y se leían como una sola raya gruesa.

Pasan a `inline-block` con relleno, margen de 1 px y `min-width: 1em`. La casilla
queda en 25x25 px para el mismo glifo de 16, y de paso las columnas salen
alineadas, porque ahora todas miden lo mismo. La fila de resultados de abajo
lleva el mismo tratamiento, que tenía el mismo problema.

⚠️ **Y al crecer la lista salió un fallo que ya estaba y que nadie había visto:
el final del listado no se alcanzaba.** El velo es `position: fixed` con
`height: 100%` y un `padding-top: 100px` en **`content-box`**, así que su caja
medía **la pantalla más 100 px**; al estar fija, esa franja de abajo queda fuera
y no hay recorrido que llegue. Medido en una ventana de 1024x640: el último
radical, 賣, se quedaba en y=637 **con el recorrido ya al máximo** y la ventana
de 559 de alto. Setenta y ocho píxeles inalcanzables.

Se cierra con `box-sizing: border-box` y con el relleno en unidades relativas,
`6vh` en vez de 100 px, para que una pantalla baja no regale un séptimo de su
altura antes de empezar el panel. **Comprobado que 賣 se alcanza en 1280x800,
1024x640 y 800x600**, donde hace falta recorrer 253 px.

⚠️ **Y un tropiezo propio que conviene dejar escrito.** Un `rsync` con la ruta de
destino relativa, lanzado desde el directorio del proyecto en vez de desde el
espejo, **creó una copia del proyecto dentro del proyecto**: 110 ficheros y 6,6 MB
en `phsemgram/phsemgram/`. No la habría cazado ningún comprobador, porque nada
apunta a ella; se vio al fallar el mandato siguiente por no encontrar `probe.sh`.
Se comprobó que no había dentro ni un fichero que no estuviera ya en el padre,
y se borró. **Una ruta relativa con `cd` encadenado delante es una trampa**, y el
espejo de medición conviene sincronizarlo siempre con las dos rutas absolutas.

## 2026-09-14 14:38 · Las capturas dicen ahora lo que enseñan, y el README apuntaba a nombres muertos

El usuario renombró los PNG de la raíz: de `capture1.png`…`capture5.png`, que
iban **numerados por orden de aparición en el README**, a nombres que dicen el
contenido, y de paso quedan cuatro en vez de cinco.

| Antes | Ahora | Qué enseña |
|---|---|---|
| `capture1.png` | `capture_decomposition1.png` | 蠮, el anidamiento máximo de cuatro |
| `capture2.png` | `capture_decomposition2.png` | 殹 en las tres vistas, con la clave de color |
| `capture3.png` | `capture_family.png` | el anillo de 口, ya con el globo y el reparto nuevos |
| `capture4.png` | (desaparece) | la composición hacia arriba de 見 |
| `capture5.png` | `capture_family_radicals.png` | el visor de radicales |

**El nombre por contenido gana sobre el número de orden**, y esto lo ilustra: la
numeración obligaba a renumerar el resto cada vez que se quitaba una figura, y
era justo lo que impedía quitarla. La que sobraba enseñaba la composición hacia
arriba, que es exactamente lo que el pie de la figura anterior ya promete y lo
que el anillo de 口 ya enseña.

De paso, los textos alternativos decían `![1-15]` en tres de las cinco, que no es
un texto alternativo sino un resto. Ahora describen la figura.

**El despliegue no se entera y está bien que no se entere**: en `despliegue.yaml`
el patrón `capture*.png` es una **exclusión**, porque las capturas son material
del README y no se publican. Los cuatro nombres nuevos siguen empezando por
`capture`, así que siguen excluidos. `pf.py verifica` sigue diciendo «Todo
cuadra».

⚠️ **Y una que hay que rehacer: `capture_family_radicals.png` es anterior al
retema del visor**, de las 14:35 de hoy. Enseña el panel blanco translúcido con
el radical elegido en rojo, o sea el aspecto que ya no existe. La equivalente al
día está preparada en `~/rdtest/propuesta_capture_family_radicals.png`, al mismo
encuadre, a la espera de que el usuario decida. La otra captura del anillo,
`capture_family.png`, sí es de hoy: se le ve el globo con el rótulo SEMANTIC y el
anillo azul ancho.

## 2026-09-14 14:35 · El visor de radicales era medio transparente y de otra casa

Se llega a él pulsando el logograma del centro en la pestaña Family, y tenía
tres cosas mal, de las cuales la primera explica por qué se veía tan raro.

**`opacity: 50%` sobre el panel entero, que es la herramienta equivocada.**
Atenúa el ELEMENTO, texto y bordes incluidos, así que el anillo de detrás se veía
**a través de los radicales** y la lista no se podía leer. Lo translúcido va en
el canal alfa del color de fondo, nunca sobre la caja. La aspa de cerrar era de
paso un `×` gris sobre panel gris al 50 %, o sea prácticamente invisible.

**Y era un panel blanco con letra negra en una página oscura.** No es que
desentonara con el tema: es que nunca preguntó por él. Ahora sale de los mismos
símbolos que el resto (`--clr-surface`, `--clr-text`, `--clr-control-border`), y
por tanto va a juego en los dos temas.

**El velo de detrás estaba en `rgba(0,0,0,0.4)`**, que no apartaba nada: el
diagrama seguía perfectamente legible debajo de la lista y los dos competían.
Sube a 0,72, y **con un valor distinto para el tema claro**, 0,45, porque un 72 %
de negro convierte una página crema en carbón: la aparta, sí, pero ya no es la
misma página.

⚠️ **Y había un `z-index` que se pisaba a sí mismo.** `common.css` da a todo
modal un `z-index: 1000` bajo un comentario que dice que los modales deben ir
delante; esta hoja, que carga después, escribía `z-index: 1` y ganaba en
silencio. El síntoma llevaba ahí a la vista sin que nadie lo relacionara: **los
botones del zoom del anillo, con `z-index: 5`, se pintaban encima del modal
abierto**. Comprobado con `elementFromPoint`, que ahora contesta el modal donde
antes contestaba el botón.

**El rojo del radical elegido también se ha ido**, y esa es la única decisión que
no es de acabado: en este proyecto el rojo significa **fonético**, en los árboles,
en el anillo y en el artículo. Usarlo para «elegido» era la paleta diciendo algo
que no quería decir. Ahora es el acento de la casa. Fuera también dos violetas
que no salían en ningún otro sitio.

## 2026-09-14 14:28 · La pestaña se llama Family, y por qué no Navigator ni Browser

**`browse` ya estaba cogido, y para lo contrario.** `browse.html` se titula
«browse the whole set»: el catálogo entero, sin foco. Llamar «Browser» a la
pestaña que enseña **un** carácter y su vecindad habría usado la misma palabra
para las dos preguntas opuestas.

**Navigator y Explorer fallaban por registro.** Nombran lo que uno hace,
mientras que la pestaña vecina se llama *Decomposition*, que nombra lo que uno
ve. «Descomposición / Explorador» no es un par. Y las dos arrastran equipaje
ajeno, `window.navigator` y el explorador de ficheros.

**Family es la palabra que ya estaba en la casa**, y eso es lo que decidió:
`RecursiveAnnotation` escribe `lg.family` en cada nodo desde siempre, el
`README.md` dice *Phonetic families* y el artículo habla de *phonetic series* y
de *kinship*. Es además la única candidata que cubre los dos sentidos del
deslizador, porque una familia tiene ascendientes y descendientes mientras que
una descomposición solo mira hacia abajo.

Se descartó *Phonetic series*, que es el término exacto de la disciplina, por
estrecho: de los 412 parientes de 口 la mayoría son semánticos, o sea que el
nombre diría menos de lo que hay.

## 2026-09-14 14:19 · 啊 flotaba suelto porque el árbol no era un árbol

Lo vio el usuario en el anillo de 口: **啊 aparecía desconectado, sin nada
alrededor**. Medido, el sector de 啊 estaba dibujado entre los 206,6° y los
207,5°, mientras su padre 阿 ocupaba de los 33,1° a los 39,5°. Un hijo fuera de
la cuña de su padre.

**La causa es que estos grafos no son árboles y se estaban dibujando como si lo
fueran.** Un logograma puede descender del mismo radical por dos caminos: 啊
toma 口 directamente, por significado, y otra vez a través de 阿, su fonético,
que también lleva 口 dentro. En el árbol de 口 lo hacen cuatro: **呵 啊 唔 囔**.
Medido: **413 apariciones y solo 409 objetos distintos**.

Y el que fueran el **mismo objeto** es lo que rompía el dibujo, porque
`d3.layout.partition` **escribe `x` e `y` sobre el propio nodo** mientras
recorre. La segunda visita pisaba lo que había escrito la primera, y el sector
acababa con el ángulo de una aparición y el radio de la otra: flotando, pegado a
nada.

La cura es que haya **un nodo por aparición y no uno por logograma**, que es
justo lo que el parámetro `copynode` prometía en su propio comentario desde
siempre y no hacía: decía «reference or value» y devolvía siempre la referencia.
Una copia superficial basta, pues lo que se escribe por aparición es la
anotación y lo que se lee de la entrada compartida solo se lee.

**Y con ello cada aparición tiene su color, que es de lo que va este diagrama.**
啊 llega a 口 por el significado y a 阿 por el sonido; con un solo objeto, las
dos arcos se quedaban con el último color escrito. Medido antes: **azul en los
dos sitios**. Ahora rojo bajo 阿 y azul bajo 口.

⚠️ **Dos cosas más se arreglaron solas, y ninguna se había relacionado con esto.**
El censo por niveles de 口 vuelve a ser **333 / 72 / 7**, que es el número de
hijos directos que el dato dice y que el dibujo llevaba contando como 329: cuatro
hijos directos estaban apuntados a la profundidad equivocada, y ese censo es lo
que decide hoy el ancho de cada anillo. Y **el desvelado por zoom llega ya a las
412 etiquetas** de 412; las **siete que se daban por perdidas** en la entrada de
las 14:07 no eran el precio del anillo exterior más fino, eran estas mismas.

⚠️ **El lienzo de descomposición no estaba afectado, y conviene decirlo porque
parecía que sí.** Comprobado con 囔, que lleva 口 dos veces: la captura de antes
y la de después son iguales. `binarydivision` construye sus propios nodos al
parsear, así que nunca compartió el objeto. El fallo era exclusivo del radial,
que es el único que deja a una biblioteca escribir coordenadas encima del dato.

⚠️ **Y un aviso sobre el instrumento**: el Brave en `headless` **redondea
`performance.now()`** como defensa contra la identificación por huella, y devolvió
0 ms para una anotación que tarda más de un segundo. Para medir tiempos, este
navegador no vale.

## 2026-09-14 14:07 · El anillo repartía el radio a partes iguales entre niveles que no lo son

**Cada nivel se llevaba un cuarto del área tuviera lo que tuviera dentro.** Para
口, que tiene **329 parientes en el primer nivel, 75 en el segundo y OCHO en el
tercero**, eso daba un anillo exterior con un cuarto del disco para dibujar ocho
sectores. Y en pantalla no leía como un anillo: leía como unos pelos rojos
asomando por fuera del borde del dibujo, que es lo que había estado pareciendo un
fallo de recorte y no lo era.

**Y el hueco central lo fijaba la profundidad del árbol, no lo que lleva dentro.**
Era el **71 % del radio con un nivel**, 58 % con dos y 50 % con tres, mientras el
texto del medio conservaba su tamaño en `em`. Medido: **5.474 de los 6.966
caracteres que se descomponen tienen un solo nivel**, o sea que el caso normal
era una corona fina alrededor de un agujero que se comía la mitad del área, con
el texto ocupando **un tercio del ancho de su propio hueco**.

Ahora el hueco es fijo, la mitad del radio siempre, y el resto se reparte entre
los niveles **en proporción a la raíz cuadrada de cuántos nodos lleva cada uno**.
La raíz y no el censo a secas: medido, el censo deja el anillo más hondo en
**3 px**, y un anillo que no se ve no es un nivel encogido sino un nivel
borrado.

| | antes | ahora |
|---|---|---|
| 口 (329/75/8) | anillos de 68 / 52 / 44 px | **100 / 48 / 16** |
| 躑 (un nivel) | hueco al 71 %, corona de 96 px | **hueco al 50 %, corona de 164** |
| 照 (2/2/2) | 55 / 54 / 55 px | **55 / 54 / 55**, igual, que es lo correcto |

⚠️ **El precio son tres etiquetas.** El desvelado por zoom sigue funcionando y va
más suave que antes (6 a 1×, 8 a 1,6×, 87 a 2,6×, 405 a 4,1×, frente a un salto
a 408 de golpe), pero a 6× se quedan **siete sin salir en vez de cuatro**: son
los sectores más estrechos de los dos primeros niveles. El nivel 3, en cambio,
ahora sale entero.

**Y el texto del centro ya no puede salirse de su hueco.** Su tamaño lo ponía la
hoja de estilo en `em` y su ancho depende de lo larga que sea la definición, que
no tiene nada que ver con lo grande que sea el agujero: medido sobre tres
caracteres al mismo radio, el bloque ocupaba el **33 %, el 53 % y el 77 %** del
ancho de su hueco. Ahora se mide la distancia de la esquina más lejana al centro
y se encoge lo justo, **solo encoger**, así que el aspecto sigue siendo el que
pide la hoja y solo ceden las definiciones largas: 照 baja al 80 %.

⚠️ **Lo primero que hizo falta fue no reducir el hueco.** El primer intento lo
dejaba en el 30 % del radio y en la captura **el 口 del centro se metía encima
del primer anillo**. Ahí se vio que las dos mitades del problema son una sola: el
hueco y su texto tenían que decidirse juntos, y estaban decidiéndose cada uno por
su lado.

## 2026-09-14 13:33 · La barra de desplazamiento que fabricaban dos barras, y un sentido que no se anotaba

**La página no tenía por qué desplazarse y se desplazaba.** Medido en una ventana
de 1280x719: el documento salía de **763 px de alto en un hueco de 704**. Eran
tres causas sumadas, y dos de ellas se alimentaban entre sí.

- `body { width: 100vw }`. **`100vw` cuenta el ancho de la barra vertical**, así
  que el cuerpo era 15 px más ancho que el sitio disponible y levantaba una barra
  **horizontal**; esa barra se comía 15 px de alto y levantaba la vertical. Cada
  una creaba a la otra, y por eso ninguna se iba tocando solo una.
- La barra de artículo es un elemento de verdad, **31 px** por encima de `main`, y
  `graphicOutput.css` le da a todo `main` un `min-height: 100vh`. **31 + 100vh no
  ha cabido nunca en 100vh.** El `height: 99vh` del cuerpo era un intento de
  compensarlo a ojo que se quedaba 23 px corto.
- Y el propio globo del anillo: posicionado contra el documento, al asomar por
  debajo del borde **estiraba la página**. Aportaba 13 px él solo.

Se arregla diciéndolo una vez en vez de adivinándolo: el cuerpo se dispone en
columna, `main` toma lo que queda con `flex: 1` y un `min-height: 0` que deshace
el del cromo, y el globo se recorta a la ventana. De paso, tres cajas que
sumaban `height: 100%` y relleno pasan a `border-box`, que era otro desbordamiento
de 12 y 30 px. **Comprobado sin barras en 1280x800, 1600x900 y 1024x640, en las
dos pestañas y con el globo desplegado.**

⚠️ **Y al medir apareció que el dibujo era un 7 % más pequeño de lo que el código
creía.** El `max-height: 85vh` de la hoja de estilo recortaba el SVG a 611 px
cuando su `viewBox` medía 656 unidades, así que **una unidad eran 0,93 px** y toda
etiqueta salía un 7 % por debajo del tamaño con el que se había decidido que
cabía. La premisa «una unidad es un píxel» es justamente de lo que vive
`glyphSize`. Ahora el SVG lleva `width` y `height` en píxeles con el mismo número
que el `viewBox`, y el tope de la hoja sobra.

**El control Up/Down tenía un caso que no dibujaba nada.** El sentido lo decidían
dos `if` seguidos, y cada uno leía el deslizador que el otro acababa de escribir.
Un carácter que solo va hacia arriba, alcanzado con el deslizador en Down por el
carácter anterior, tachaba Down, devolvía el deslizador a Up y **no anotaba en
ninguna de las dos ramas**. Medido sobre 口, que tiene 413 parientes por encima y
ninguna descomposición propia: **dibujaba un sector vacío** mientras el control
decía Up. El sentido contrario funcionaba solo por el orden en que estaban
escritos los dos bloques, no porque estuviera resuelto.

Ahora el sentido se decide una vez, antes de tocar nada, y la anotación sale de
esa decisión. Comprobados los cinco casos: los dos sentidos de un carácter que
los tiene, los dos que solo tienen uno alcanzados con el deslizador al revés, y
la vuelta al primero.

⚠️ **Lo que lo hacía invisible es que `RecursiveAnnotation` escribe dentro de
`logograms`.** No devuelve un árbol: le cuelga `children` a la entrada
compartida. Así que saltarse la llamada no deja el diagrama vacío, **deja lo que
hubiera puesto ahí un recorrido anterior**, quizá en el otro sentido. Un fallo
que se disfraza de dato viejo cuesta el doble de encontrar.

**Y esta vez sí se ha visto medido, no solo ejecutado.** Se encontró un navegador
utilizable en la máquina, el Brave del `snap`, que en modo `headless` carga la
página y devuelve el DOM: de ahí salen todas las cifras de arriba. ⚠️ **No lee
`/mnt`**, así que hay que copiar el proyecto bajo `$HOME` para medirlo, y
**tampoco lee las carpetas ocultas del propio `$HOME`**, que fue el primer intento
y devolvía la página de error de Chromium sin decir por qué.

## 2026-09-14 13:02 · Acercarse de verdad al anillo, y por qué la letra no puede crecer con él

El anillo tiene ahora dos zooms, que no son el mismo y contestan a cosas
distintas: **pulsar un nodo redistribuye los ángulos** y le da los 360° a una
rama; **la rueda magnifica**, como en un mapa, sin tocar la geometría.

**La letra se queda quieta, y no es un detalle de acabado: es lo que hace que el
zoom sirva de algo.** Si el texto escalara con el dibujo, la proporción entre un
glifo y el arco que lo aloja no cambiaría nunca y **no aparecería ni un logograma
nuevo por mucho que uno se acercara**: se verían más grandes las diez etiquetas
que ya había y los 398 sectores mudos seguirían mudos. Con el texto fijo en
píxeles de pantalla, el arco crece y el glifo no, y van entrando solos.

En el código son dos líneas: la geometría cuelga de un grupo que recibe la
transformación, cada etiqueta lleva un `scale(1/k)` que la deshace para sí misma,
y `glyphSize()` mide el arco **multiplicado por k**, porque el sitio que una
etiqueta tiene es el que ve el lector y no el que mide el dibujo sin transformar.

Medido sobre el código ya escrito, no sobre una simulación:

    carácter   k=1    1,5    2      3      4      6     total
    口         10     25     46     408    408    408    408
    氵          5     28     58     66     440    440    440
    木         15     30     326    326    326    326    326

    k=1 -> 10 etiquetas, entre 9,5 y 22,0 px de pantalla
    k=3 -> 408 etiquetas, entre 9,5 y 22,0 px de pantalla
    k=6 -> 408 etiquetas, entre 19,0 y 22,0 px de pantalla

La segunda tabla es la prueba de que el texto no crece: el tamaño **no se sale
de la banda** a ningún aumento, porque hay un tope de 22 px.

⚠️ **El desvelado es escalonado, no continuo.** Los 333 hijos de 口 pesan lo
mismo, luego tienen **el mismo arco**, y cruzan el umbral a la vez. Lo que va
saliendo entre 1× y 2× son los concentradores, que tienen arco mayor por tener
descendencia; el resto entra de golpe en k≈3. Son tres estados y conviene no
prometer una transición suave.

**El precio es el tamaño**: a 3× el anillo mide 2400 px de diámetro y en un panel
de 800 se ve un noveno, así que hay que arrastrar.

**Tres cosas que había que resolver para que esto no molestara:**

- **Un arrastre que termina sobre un sector no es una pulsación en él.** El
  manejador del clic empieza ahora con `if (d3.event.defaultPrevented) return;`.
- **No se puede perder el dibujo.** Nada impedía arrastrarlo fuera de la
  pantalla y quedarse con un panel en blanco sin saber por qué. El arrastre se
  recorta a `|t| <= radio * (k - 1)`, que a 1× lo deja clavado en cero, que es lo
  correcto: con el círculo entero a la vista no hay a dónde ir.
- **Una rueda que magnifica es invisible hasta que alguien la prueba**, y además
  deja de desplazar la página. Hay `+`, `−` y un «volver al círculo entero», y el
  aumento se enseña solo cuando no es 1×. La mano de arrastrar aparece por la
  misma razón: a 1× prometería algo que no se puede hacer.
- ⚠️ **El centro de un anillo es un agujero.** Acercarse hacia el centro de la
  vista camina hacia la nada: medido, **a partir de 4× la corona se sale entera
  del recuadro** y queda una pantalla en blanco. La rueda se libra sola, porque
  acerca hacia el puntero, pero un botón no tiene puntero al que apuntar. Así
  que los botones apuntan a la corona: conservan la parte que el lector ya esté
  mirando, y a 1×, donde eso es el hueco y ninguna dirección es mejor que otra,
  toman la de arriba. Comprobado paso a paso, de 1,6× a 6×, que siempre queda
  anillo a la vista.

**Y bajar de nivel devuelve el aumento a 1×**, porque los ángulos se van a
redistribuir y el sitio al que uno había arrastrado deja de significar nada en
cuanto arranca la transición.

`d3.behavior.zoom` ya venía en el d3 3.5.17 del proyecto: ni una dependencia
nueva.

## 2026-09-14 12:49 · El tooltip del radial llevaba oculto por CSS, y la página tenía dos temas peleándose

**El tooltip no se veía nunca, y la causa estaba en otra hoja.** `common.css`
declara `div.tooltip { visibility: hidden }` y espera que quien lo use vuelva a
encenderlo; el comentario que hay justo encima de esa regla enseña la llamada,
`.css("visibility", "visible")`. El diagrama radial anima **`opacity`**, no
`visibility`, así que el globo aparecía... oculto. Cada pasada del ratón por el
anillo no mostraba nada.

Importa más desde ayer: **un sector demasiado estrecho para su carácter tiene el
tooltip como única manera de decir cuál es**. Ahora está encendido, acotado a una
clase propia `rd-tip` para no destapar el tooltip de nadie más, y lleva el
carácter a 2,8 em, la definición, la lectura y **el papel de la arista**, que es
lo mismo que dice el color del arco para quien aún no lo haya aprendido.

Comprobado disparando el `mouseover` sobre un sector sin etiqueta:

    叨  talkative; grumbling  ·  dāo  ·  semantic

**Y la página tenía dos temas peleándose.** Había un bloque titulado «dark mode
adjustments» que clavaba el fondo a `#1d1d1d`, el texto de todo SVG a `white` y
cada enlace a un cian `#84ffed`. Tres problemas: contradecía a `theme.css`, que
es lo que mueve el botón de tema del toolbar, de modo que al cambiarlo media
página cambiaba y media no; el cian no pertenece a ninguna paleta de aquí, que es
ámbar sobre marrón; y con el tema claro el texto blanco de los SVG quedaba
invisible. Todo eso sale ahora de los tokens de `theme.css`, con los valores
claros al lado de los oscuros.

**Los dos fondos de pestaña**, que era el encargo, eran `#1d1d1d` y
`rgb(51, 0, 51)`, un morado saturado que no era de la casa. Ahora son dos
habitaciones de la misma: `--an-tab1` y `--an-tab2`, misma familia cálida y
distinta claridad, con su par para el tema claro. La etiqueta de cada pestaña
sigue vistiendo el color de su panel, que es lo que las empareja.

**Tres sitios donde los dos temas estaban escritos y solo ganaba uno:**

- `#grapheme .squared` traía **dos declaraciones seguidas** de `color` y
  `background-color`, una clara y otra oscura. Solo se aplicaba la segunda.
- `get_random_color()` traía **dos `var luminosity`**, `75-90` y `5-15`. Solo
  corría la segunda. Eran los dos temas, escritos y dejados pelear. Ahora cada
  celda guarda su tono en `--cell-h` y **la claridad la pone el tema**, así que
  cambiarlo recolorea todas las celdas sin redibujar nada.
- El `.content:hover` de `taxogrid.css` era `olivedrab`. Sobrescrito desde la
  página, sin tocar la hoja compartida.

⚠️ **El árbol del canvas no puede leer variables CSS**, y por eso se dibujaba con
`fill: white` fijo: `Render` serializa el SVG a un `data:` URL que `drawInlineSVG`
mete en un `<img>`, y eso es **otro documento**, sin las propiedades
personalizadas de la página. Un `var()` allí no resuelve. Así que los colores se
**leen** del tema con `getComputedStyle` y se escriben como literales. Y como eso
se hace al dibujar, un cambio de tema lo dejaría desfasado: un `MutationObserver`
sobre `data-theme` lo redibuja. El botón de tema no emite ningún evento, así que
el atributo es la señal.

Para poder redibujar solo el canvas hubo que **partir `RenderTrees` en dos**: el
listado de definiciones hace `prepend` sobre `#definitiontree` y **no limpia**,
de modo que volver a llamarla entera habría dejado la lista duplicada.

## 2026-09-14 12:34 · El navegador radial gastaba el color en nada y dibujaba 408 etiquetas de 5 px

`analysis.html?q=口` era ilegible, y no por el tamaño de la letra.

**口 tiene 333 hijos directos**, o sea 1,08° por sector: **4,7 px de arco** a un
radio de 250. La fórmula era `Math.min(2, 70 / nodecount)`, que con 333 nodos da
`0,21em`, unos 5 px. **El glifo era más ancho que el sector en el que tenía que
caber.** Un anillo de radio 250 admite unos 130 glifos CJK; solo **11 de 1622**
componentes pasan de ahí, pero son 氵 400, 艹 358, 口 333, 木 305, 扌 280: los
radicales comunes, que es justamente lo que uno pulsa.

**El color no decía nada.** Los arcos se rellenaban con `d3.scale.category20c()`
indexado por **el nombre del padre**, así que los 333 hermanos salían del mismo
color y el anillo era una banda plana. Mientras tanto el **texto** ya se pintaba
con `d.color`, que es el rojo/fonético azul/semántico del proyecto. Ahora lo
lleva el arco, y el anillo contesta una pregunta de verdad:

| componente | hijos | semánticos | fonéticos |
|---|---|---|---|
| 口 | 333 | 327 | **6** |
| 氵 | 400 | 399 | **1** |
| 木 | 305 | 303 | **2** |

Esos seis son los que usan 口 **por su sonido**, y antes estaban escondidos en
una banda uniforme. La tabla cuenta **hijos directos**; el anillo dibuja el árbol
entero, que para 口 son 408 arcos, 323 azules y 85 rojos.

La paleta sale ahora de variables que siguen el tema claro/oscuro, en vez de
pasteles fijos con `stroke:#fff` sobre un fondo `#1a1714`.

**Se etiqueta solo lo que cabe**, medido: arco disponible, grosor del anillo y un
tope. Lo bueno salió solo. Como el arco de un nodo es proporcional a su
descendencia, la regla **selecciona los concentradores**:

    口  sin zoom     10 de 408: 召 照 可 阿 号 含 吾 哉 囊 知
    口  zoom en 可   23, todas a 22 px: 呵 哿 坷 岢 柯 河 疴 舸 苛 蚵 訶 诃 軻 …
    氵  sin zoom      5 de 440: 江 沙 溥 薄 礴

Los demás conservan color, tooltip y clic; lo único que pierden es una etiqueta
que no se leía.

Las cifras salen de dos sitios que no se hablan: una simulación aparte de la
aritmética de `partition`, y el propio fichero ejecutado contra un doble de d3.
Dan la misma lista de diez. **Lo que no he podido hacer aquí es abrirlo en un
navegador**: el `-screenshot` de este Firefox sale con 0 y no escribe nada, y no
hay otro. Así que el dibujo está comprobado por medida y por ejecución, no por
vista.

**Y el zoom estaba escrito a medias.** `stash` se llamaba y **`arcTween` estaba
definido y no se invocaba nunca**. Terminado: pulsar un nodo con descendencia lo
abre al círculo entero, pulsar el centro sube. Una hoja no tiene nada que abrir,
así que para ella el clic sigue significando «llévame a este carácter».

**Dos cosas que se calculaban para tirarlas:**

- `d3Layout(logograms[char])` se llamaba **sin dimensiones**, con lo cual usaba
  siempre su `500×500` por defecto. Las tres líneas de encima medían la ventana,
  la escribían en la consola y la descartaban. Ahora se le pasa el tamaño real
  del contenedor, que además es lo que hace que una unidad del dibujo sea un
  píxel de pantalla: la unidad en la que cada etiqueta decide si cabe.
- El tooltip se creaba con `append` en cada dibujado, acumulando un `div` por
  render. Ahora se reutiliza.

⚠️ **El árbol se guarda en vez de recalcularse.** Anotarlo cuesta **1,8 s para
口** (413 nodos), porque `getParentNodes` recorre las 9574 entradas **una vez por
nodo**. Redibujar a otro tamaño no puede pagar eso otra vez, así que el redibujado
al cambiar de pestaña y al redimensionar reutiliza el árbol ya anotado.

## 2026-09-14 12:15 · El lienzo se medía por los nudos, y el texto no cabe en un nudo

`Render` calculaba el tamaño del lienzo con `RenderContainer`, que solo conoce
**las coordenadas de los nudos**, y lo rellenaba con un margen a ojo de
`max(10 %, 30 px)`. Pero las etiquetas se anclan en esas coordenadas y salen de
ellas: una centrada sobresale media etiqueta por cada lado. **El dibujo se
salía del lienzo y el canvas lo recortaba en silencio**, sin error ni aviso.

Medido sobre los datos que la aplicación pone de verdad, que son el carácter y
su transcripción:

| árbol | lienzo antes | qué se perdía | lienzo ahora |
|---|---|---|---|
| 瀚 | 360×422 | izquierda 3 px, **arriba 21** | 374×381 |
| 蠮 | 480×493 | izquierda 43 px, **arriba 21** | 524×451 |
| 園 | 160×281 | **arriba 21**, derecha 3 px | 174×239 |

⚠️ **Los 21 px de arriba se perdían en TODOS los árboles**: es la etiqueta de la
raíz, que se dibuja sobre el vértice y por tanto por encima de la coordenada más
alta que el contenedor conocía.

**El arreglo es medir el texto.** Ahora se escribe el marcado PRIMERO, porque
escribirlo es lo que mide, y la caja sale de lo que hay dentro. El
`dynamicContainer` que el autor había dejado preparado y comentado
(`// var Container = dynamicContainer;`) era esta idea: no podía usarse porque
se rellenaba después de calcular la caja. La medida usa `measureText` de un
canvas cuando lo hay y, si no, estima a un em por carácter CJK y 0,55 por el
resto. El margen queda en 8 px, que es sitio para el trazo y nada más.

**Y de paso desaparece un fudge**: `terminalTextHeight = fontsize * 3` reservaba
tres líneas al pie pasara lo que pasara. Por eso el lienzo era más ALTO de lo
necesario a la vez que recortaba por arriba. Con la caja medida sobra.

**Tres defectos más, encontrados por el camino:**

- **Una regla CSS que no casaba con nada.** El SVG define `text.node { text-anchor: middle }`,
  pero la clase que escribe `WriteSvg` es `textanchor[1] = 'centralnode'`. La regla
  llevaba desde siempre sin aplicarse y **las etiquetas centrales caían en el
  `text-anchor: start` por defecto**, colgando a la derecha de su propio nudo.
- **Una propiedad que no existe.** `dominant-middle: baseline`, tres veces. No es
  una propiedad CSS ni un atributo SVG, así que nunca hizo nada y todo lo que
  cualquiera ha visto ya estaba en la línea de base alfabética. **Se borran en
  vez de adivinar qué querían decir**: adivinar cambiaría el dibujo, borrarlas no.
- **Atributos sin comillas.** `width=374 height=381` en el `<svg>`. En el
  navegador cuela porque el marcado pasa por `innerHTML` de un `<template>`, que
  lo parsea el analizador de HTML y lo vuelve a serializar bien; a un analizador
  de XML de verdad le revienta. Lo cazó ImageMagick al intentar rasterizarlo, no
  la lectura. Ya van entrecomillados, y con `viewBox`.

**Un camino equivocado, y por qué se deshizo.** Con etiquetas largas los
terminales se pisan, pues van a una celda de distancia. Escribí un ensanchado
automático de la celda para evitarlo... midiendo sobre un árbol de prueba que
llevaba **definiciones** en `namesubstrings`. No es lo que hay ahí:
`analysis.js` pone `namesubstrings = [transcripción]`, o sea `hàn`, `shuǐ`. Con
el dato real el ensanchado **no llega a dispararse nunca**, y en cambio podía
multiplicar por 25 el lienzo de quien sí use etiquetas largas. Retirado. La
lección es vieja y la volví a pagar: **mirar el dato antes de medir sobre él**.

## 2026-09-14 12:07 · analysis.html: el canvas se estiraba, y el texto se ajustaba con dos unidades distintas

Tres arreglos en la página, hermanos del de `binarydivision.js`:

**El canvas se deformaba.** `#tree { height: 100% }` contra un ancho intrínseco
en píxeles: el mapa de bits se estiraba hasta el alto de la caja y el ancho se
quedaba donde estaba, así que **todo árbol cuya forma no fuese la de la caja
salía aplastado o alargado**. Ahora es `max-width/max-height: 100%` con
`width/height: auto`, que escala entero y en proporción. Importa más desde hoy,
porque el lienzo ya viene del tamaño del dibujo y no de un número fijo.

**`fittext()` mezclaba unidades.** Leía un ancho en PÍXELES, calculaba una escala
y escribía el resultado en `em`, que es una fracción del tamaño del PADRE. Las
dos cosas no se refieren a lo mismo, de modo que el resultado dependía del
tamaño que el elemento llevase encima. Y como nunca reponía el valor original,
**cada redimensionado de la ventana medía una caja que él mismo acababa de
cambiar** y se desviaba un poco más. Ahora repone, lee el tamaño de la hoja de
estilo y multiplica sobre él, en píxeles.

**`lang="es"` con el contenido en inglés.** Salió al medir los pares de idioma:
la página se declaraba en castellano. Corregido a `lang="en"`.

**Y una decisión de reparto**: el tamaño de `.extra` lo declara ahora el
dibujante (`options.extraFontFraction`) y no la hoja de estilo que se le pasa.
No es cosmética: el dibujante **mide el texto** para calcular su lienzo, y no
puede leer una hoja de estilo para enterarse de cuánto encoge `.extra`. Dos
sitios diciendo «60 %» acabarían diciendo dos cosas distintas, y el que se
equivocase sería el silencioso.

## 2026-09-14 11:53 · El par de idiomas, hecho: y el enlace que lo ofrecía apuntaba a la nada

Las dos páginas en castellano del proyecto pasan a `article.es.html` y
`graphemesCulturalHints.es.html`, y los nombres sin sufijo quedan para el inglés,
como la regla de la casa pide para `README.md` / `README.es.md`. El castellano
sigue siendo el original: el inglés sale de él.

**El artículo no se retecleó, se transformó.** 2087 palabras, pero dentro hay
**109 caracteres CJK distintos** repartidos por siete árboles de descomposición,
y un carácter mal copiado ahí es un error invisible: ya pasó en este proyecto con
砼 escrito como 砹. Así que la traducción la hace un guion que **localiza los 66
bloques de prosa por índice y solo sustituye esos**, dejando pasar sin tocar todo
lo que no nombra. Lo que se comprueba después no son las palabras sino el dato:

    CJK idéntico (109 caracteres, mismos conteos) .... sí
    69 enlaces, mismos y en el mismo orden ........... sí
    castellano restante .............................. ninguno

**Y la sonda que buscaba castellano era sensible a mayúsculas**, así que dejó
pasar «Las tres columnas, grafema a grafema»: ninguna de sus palabras casaba en
minúscula. Dos bloques se colaron y los cazó la revisión posterior, no el guion.

**El hallazgo: el enlace de idioma del toolbar se dibujaba siempre.** Deducía el
nombre del otro idioma del nombre del fichero y **no comprobaba nada**, porque
desde el cliente no se puede comprobar. Resultado: de las seis páginas del
proyecto, **cuatro ofrecían una traducción que no existe**. Ahora la página
declara su pareja con `data-lang-alt` y sin ese atributo no hay enlace, que es la
única afirmación que un guion no puede equivocar.

⚠️ **Esto separa un poco más el toolbar vendorizado del que usa el sitio**, que
sigue con el convenio viejo `X.html` / `X_EN.html`, justo al revés. Se honra ese
convenio para que una página `_EN` sepa volver, pero la divergencia crece y está
contada en el `CLAUDE.md` de la raíz, §3.

**De propina, un defecto que asomó al medir**: `analysis.html` se declara
`lang="es"` y su contenido está en inglés.

## 2026-09-14 11:24 · El ejemplo de 死 se apoyaba en mnemotecnia, y se vuelve a fundar

Lo vio el usuario: «死 que representa <em>A person kneeling 匕 before a corpse 歹</em>
compone a su vez 葬…» **no es etimología, es el campo `hint`**, que makemeahanzi
escribe para quien aprende. Y hay una razón de fondo por la que no podía serlo:
⚠️ **los ideogramas no llevan campos `semantic` ni `phonetic`** —死 y 葬 son los dos
`ideographic`—, así que ahí no había etimología que citar, solo una glosa.

Lo verificable es la **contención**, y la dan dos fuentes distintas: la
descomposición n-aria dice que 葬 es `⿱艹⿱死廾` y Wikimedia dice 艹 · 死廾. Sobre eso
se puede medir, y se midió: **680 de los 1840 ideogramas (37 %) aparecen dentro de
otro grafema**, y en **664** lo confirman las dos. 死 es uno, con cinco: 屍 斃 毙 葬
薨, todos de muerte. **La coherencia se lee en las definiciones y no hace falta la
glosa.**

Queda escrito al lado, porque es la lección y no la anécdota: la descomposición
prueba que la pieza está, no prueba por qué, y las glosas del dato no se usan en
este artículo como prueba de nada. Es el mismo criterio que dejó fuera las 28
pistas culturales unas horas antes.

El artículo queda en **2087 palabras**.

## 2026-09-14 11:09 · La elección del componente fonético sí está motivada, pero no por lo que parecía

La pregunta de 1919 palabras atrás —¿por qué 鲨 escogió 沙 y no otro homófono?—
se puede hacer sobre toda la muestra en cuanto se sabe **cuántos candidatos había**,
y eso lo da la serie fonética de Karlgren: los candidatos de un grafema son los de
su serie que alguna vez se usan de componente fonético.

⭐ **Lo primero que sale es que la mitad de las veces no hubo elección.** De los 1520
casos medibles, **en el 54,6 % el grupo de candidatos tenía un solo miembro**. La
pregunta solo tiene sentido para las 690 restantes.

**Y ahí el sesgo es fuerte, con su control incluido:**

| se escoge… | observado | por azar | |
|---|---:|---:|---:|
| el que ya compone más grafemas | 78,8 % | 42,6 % | ×1,85 |
| el de menos trazos | 66,2 % | 40,7 % | ×1,63 |
| *control:* el de más trazos | 21,0 % | 42,2 % | ×0,50 |

El azar cuenta los empates, que si no se inflan las tres cifras. **La fila de
control es la que convierte esto en medición**: si el efecto fuera un artefacto,
escoger el más complicado no saldría a la mitad de lo que el azar daría.

**Así que está motivada por economía y no por significado.** Y el significado se
midió de frente, no por descarte: el fonético elegido comparte alguna palabra de
su definición con el grafema en el **2,5 %** de los casos, y un rival de su mismo
grupo en el **1,8 %**. Son cinco casos de diferencia sobre 690.

⚠️ **Y las dos cifras llevan trampa, que va escrita en el artículo al lado.**
«Componer mucho» es en parte **consecuencia** de haber sido elegido, así que lo
medido es que el sistema concentra el trabajo en pocas piezas, no que la
productividad causara nada. Y la prueba del significado solo ve el parentesco que
asoma en las palabras de la definición: no ve que 停 'detenerse' se escriba con
亭 'pabellón', que es donde uno se detiene. **El 2,5 % es un suelo.**

Tres ejemplos, comprobados uno a uno contra el dato: 哺 escoge 甫 (compone 20) y
descarta 父, que era más corto; 倚 escoge 奇 frente a 可, dos piezas igual de
corrientes y ninguna emparentada con «apoyarse»; y 儻 hace lo contrario de todo,
escogiendo 黨 —veinte trazos, compone uno— teniendo a mano 尚, de ocho trazos y
que compone veintitrés. **Es tendencia, no ley**, y el artículo lo dice con ese
tercero.

El artículo queda en **1882 palabras**, dos veces y media el original.

## 2026-09-14 11:01 · El artículo crece con lo que el taller llevaba siete años sin publicar

De 718 a **1537 palabras**, y ni una cifra tecleada: las doce que aparecen se
comprobaron contra el dato con el mismo arnés que prueba `browse.js`, y aciertan
las doce.

**Lo que más faltaba: el artículo anunciaba la recursividad gráfica y no la daba.**
Decía «la división etimológica y gráfica no siempre coinciden», daba el máximo
etimológico —4, en 礴 臟 蘩 蠮— y ahí se quedaba. El gráfico estaba calculado desde
2019 en `0OFFLINE/mi análisis/` y **nunca se publicó**: **8** por la descomposición
n-aria (儺 擲 攤 灘 癱 縮 缩 蓿 襫 躑) y **7** por la binaria de Wikimedia (擲 躑). Ahora
están los tres en una tabla, con 躑 de ejemplo de por qué no da igual cuál se use.

⭐ **Y la pregunta que el artículo dejaba abierta tiene respuesta, que es «no».**
Preguntaba por qué 鲨 escogió 沙 y no otro homófono, y aventuraba el refuerzo del
氵 que 沙 lleva dentro. Dos mediciones:

- **La elección no era entre muchos**: hay 16 grafemas que se leen *shā* y solo
  **dos sirven alguna vez de componente fonético**, 杀 y 沙.
- **El refuerzo no existe como patrón**: el fonético ya contiene al semántico en
  **138 de 6760 (2,0 %)**, y barajando los fonéticos al azar salen **183 (2,7 %)**.
  Está **por debajo del azar**. 鲨 es una coincidencia afortunada, no una regla.

Contestar que no a una hipótesis propia con una cifra vale más que dejarla en el
aire, y es lo que el dato permitía desde el principio.

**Y entra el argumento que sostenía los árboles y no estaba en el texto**: la rama
solo suena igual en chino antiguo. 各 `*kˤak` → 格 `*kˤrak` → 落 `*kə.rˤak` es una
familia; *gè, gé, luò* no lo parece. Con el precio dicho: Baxter-Sagart cubre el
35 % de la muestra, así que de dos tercios no se puede afirmar nada.

Más una sección sobre **cómo se comprueba que el fonético es fonético** —las
series de Karlgren, 1521 confirmadas contra 205 discutidas, y los 13 con las
casillas cambiadas— y dos apostillas a la definición: que **206 fonosemagramas no
declaran una de sus dos partes**, y que el radical **no** es el componente
semántico en 271 casos (举 se archiva bajo 丶 y significa con 扌).

⚠️ **Una cifra mía salió mal y la cazó la comprobación.** Escribí que 躑 tiene
divisibilidad etimológica **2** «que son 足 y 鄭», y es **1**: se parte una vez y
ahí se acaba, porque ni 足 ni 鄭 se descomponen etimológicamente. Es justo el error
que la sección denuncia, cometido dentro de la sección que lo denuncia.

⚠️ **Y un enlace apuntaba a una sección escondida.** `browse.html#bw-trees` llevaba
a un `<section hidden>`, o sea a ninguna parte, porque el panel de árboles solo se
abre pulsando la pestaña. Ahora la página **lee el `hash` al cargar** y abre el
panel que se le pide.

## 2026-09-14 10:43 · El artículo tenía un error dentro de una figura, y era del dato

**Lo vio el usuario mirando el árbol de 瀚**: en el último nivel, 龺 gān salía en
azul (semántico) y 人 rén en rojo (fonético), y no tiene sentido que el sonido de
algo que se lee *gàn* venga de *rén*. El dato lo dice así, y **el dato está mal**.

El propio dato se desmiente:

| | pinyin | chino antiguo | serie de Karlgren |
|---|---|---|---:|
| 倝 | gàn | `*[k]ˤar-s` | **0140** |
| 幹 | gàn | `*[k]ˤar-s` | **0140** |
| 翰 | hàn | `*m-kˤar-s` | **0140** |
| 干 | gàn | `*kˤar` | 0139 |
| 人 | rén | `*ni[ŋ]` | 0388 |

倝, 幹 y 翰 son **la misma serie**, 干 la contigua, y 人 no comparte con ellos ni
ataque, ni rima, ni coda. Y hay confirmación por otro camino, dentro de la misma
fuente: la pista de 倝 dice solo `sunlight`, que describe a 龺, **lo que está en
la casilla semántica**; y la de 幹 dice `Sunlight 龺 suggests "dry"; a club 人干
suggests "invade"`, donde el 人 es un garrote dibujado. **Las dos casillas están
cambiadas.**

⭐ **Y el error tiene firma, así que se puede contar.** Si el componente registrado
como *semántico* cae en la serie de Karlgren del carácter y el registrado como
*fonético* cae en otra, el reparto está invertido. De los **854** caracteres en que
los tres llevan serie, **13** son así: 勒 協 否 欿 荒 誾 謠 躅 閔 魏 鸞 鼙 齋. Es una
acusación más fuerte que el choque de Karlgren que ya se marcaba, y ahora tiene
filtro propio en `browse.html` y parámetro `?swapped=1`, que es a donde apunta la
nota del artículo.

⚠️ **倝 no está entre los trece, y por una razón que conviene entender**: 龺 no
tiene reconstrucción, así que Karlgren no puede arbitrar ese caso. Lo arbitra la
familia 干/幹. **La prueba automática encuentra menos de lo que hay**, porque
necesita dato en los tres extremos.

**El árbol del artículo no se toca.** Se dibuja del dato, y corregirlo a mano sería
apartarse de la fuente sin decirlo; lo que se añade es una nota que explica el
error, lo prueba y enlaza a los otros trece. Es la diferencia entre publicar un
dato limpio y publicar un dato con su erratas conocida.

⚠️ **Y el remedo del DOM se quedó corto cuatro veces seguidas** al probar el
parámetro de URL: le faltaban `select.options`, `window.location`, un `value` por
defecto en cada elemento y `insertAdjacentHTML`. Ninguna era un fallo del código
probado. **Un arnés incompleto no da falsos negativos silenciosos, da errores
ruidosos**, que es la propiedad por la que vale la pena tenerlo.

### Las pistas culturales se quedan como están

Se revisaron las 28 marcadas a mano en `0OFFLINE/TRABAJO/grafemas culturales.ods`
y **no se publica ninguna**. El motivo lo dio el usuario y es el correcto: el campo
`etymology.hint` de makemeahanzi es **mnemotecnia para quien aprende**, no
etimología con aparato, y las cinco entradas que la página ya tiene no citan el
`hint`: citan Wikipedia para el hueso oracular y Wiktionary para 貝 como moneda.
El caso de 倝, encontrado el mismo día, es la prueba de que esos campos se
equivocan.

## 2026-09-14 10:25 · Las fuentes dejan de ser una lista y pasan a decir en qué se contradicen

**`SOURCES.txt` acreditaba y no informaba.** Era una lista de procedencias en
texto plano, **sin enlazar desde ninguna página** desde que el pie MIT lo
sustituyó el toolbar, y acreditaba **dos de las tres fuentes**: le faltaba D3.js,
que sí estaba en el borrador del taller. Ahora es `SOURCES.md`, y de ahí sale
`sources.html`, que entra por el índice.

**Lo que cambia no es el formato, es que ahora dice cuánto se quedó fuera.**

| Fuente | Entradas | Llegan | Fuera |
|---|---:|---:|---:|
| makemeahanzi | 9574 | 9574 | 0, es el censo |
| Baxter-Sagart | 4056 | 3359 | **697** |
| Wikimedia | 21166 | 9256 | **11910** |

⭐ **Y `CompositionType` no era el operador IDS.** Llevaba 9252 entradas en el dato
vivo sin que ninguna página lo mostrara, y se daba por redundante. No lo es:
**Wikimedia nombra cada disposición con un carácter que la ejemplifica** —吅 lado a
lado, 吕 arriba-abajo, 回 rodea— donde makemeahanzi usa ⿰⿱⿲. Son dos notaciones,
así que discrepan en el **100 %** de los 9247 comparables y se contradicen en
ninguno. Al cotejarlas aparece lo interesante: 吅 y ⿰ coinciden en el **96 %**,
pero **回 y ⿵ solo en el 44 %**, o sea 258 caracteres cuya disposición dos fuentes
describen distinto más veces que igual. Nadie las había comparado.

Con eso, el documento cierra con **seis desacuerdos medidos** en vez de una lista
de URL: las dos notaciones, las 1121 incidencias entre el orden etimológico y el
gráfico (93 graves), las 205 aristas que Karlgren discute, las tres medidas de
divisibilidad, los 271 radicales que no son el componente semántico, y el
recuento de trazos, que **es una deducción y no una lectura** teniendo Wikimedia
una columna `Strokes` sin fusionar.

**La página se genera, no se copia.** `tools/build_sources.py` convierte el
Markdown, y **se niega a convertir lo que no entiende** en vez de descartarlo:
⚠️ falló a la primera con la cursiva de la cita de Baxter y Sagart, que es
exactamente lo que tenía que hacer. Un conversor que ignora en silencio convierte
un documento en un documento más corto sin avisar. Comprobado además por
recuento de fichas que **no falta ni sobra una palabra** entre el `.md` y la
página.

⚠️ **Y un espacio duro escondido.** El enlace del README decía
`See\u00a0sources` con un `U+00A0` entre las dos palabras, así que la sustitución
literal no casaba. Lo cazó el `assert` del parche; buscar por el `href` y no por
el texto lo resolvió.

### Y se borran 4,4 MB de copias exactas

El cotejo por huella de todo el repositorio encontró **38 ficheros con copia
exacta en otro sitio**. ⚠️ **Tres de los cuatro montones los hice yo anteayer y
ayer**, sin darme cuenta:

- **`0OFFLINE/tools/`** era un espejo del `tools/` de la raíz, creado durante el
  volteo, **y ya iba desfasado**: `build_stats.py` y `build_inventory.py` eran
  versiones viejas. Un espejo que envejece es peor que no tenerlo.
- **`0OFFLINE/capturas/`**, los cinco PNG que esta mañana subieron a la raíz como
  `capture1`…`capture5`.
- **`img/graphemes/0OFFLINE/癍.png`**, que rescaté del sitio a las 09:0x creyendo
  que faltaba: **ya estaba en `0OFFLINE/癍.png` desde 2019**. El rescate sobraba, y
  la regla que escribí en `build_inventory.py` para clasificarlo apuntaba a una
  ruta que no existía.
- **`0OFFLINE/data/derivedmergeddata.js`**, copia exacta del dato vivo, 4 MB.

`0OFFLINE` baja de 72 a 68 MB y **no queda ni un duplicado exacto** en el
repositorio.

## 2026-09-14 10:00 · Un nodo es una palabra, y el bosque entero cabe plegado

**El par tradicional/simplificado era dos nodos hermanos y eso decía una falsedad.**
馳 y 驰 colgaban los dos de 也 como si fueran dos caracteres emparentados, cuando
son **el mismo carácter escrito de dos maneras**. Ahora el nodo es la palabra: un
solo nodo con dos grafías, y las dos casillas eligen cuál se ve. Las dos marcadas,
`馳 驰`, un enlace por glifo; una sola, esa grafía; ninguna, el nodo desaparece.
Los hijos del nodo son la **unión** de lo que compone cada grafía.

**Fundir salió barato porque el dato acompañaba**: se midió antes y **los 602
grupos tienen exactamente dos miembros**, ninguno tres, así que la fusión nunca
tiene que arbitrar. Y la pronunciación no entra en conflicto: por construcción las
dos grafías comparten pinyin y definición, y la que lleva la lectura en chino
antiguo es la tradicional, que es la que se imprime.

⭐ **Fundir no solo resta, también crea profundidad.** Un componente semántico
cuyas dos grafías componían cada una un grafema distinto eran dos entradas planas
y pasa a ser un nodo con una generación debajo. De ahí que los árboles ofrezcan
**24** raíces semánticas y la medición del README cuente **23**: no se contradicen,
una cuenta palabras y la otra glifos. Las cuatro cifras del cambio están ahora en
el README, medidas por separado en Python y en JavaScript, y **coinciden**: 1556
componentes fonéticos son 1522 nodos, 329 semánticos son 328, y 氵 pasa de 399
hijos a 395.

**Y el selector gana una entrada que abre el bosque entero.** Hasta ahora había que
elegir un componente; ahora la primera opción lista **todos los que no compone
nadie**: 1105 en la vista fonética, 304 en la semántica. Maximales y no los 1556,
porque sobre esos **cada grafema aparece exactamente una vez**; listar todos los
componentes imprimiría 格 dos veces, dentro de 各 y otra vez como raíz propia. Van
plegados y cada rama se construye al abrirla: **35 ms** para pintar las 1105
raíces, **2 ms** para desplegar 氵 con sus 395 hijos.

⚠️ **Y un fallo que en el navegador habría sido un árbol en blanco, sin error.**
El ayudante que traduce grafema a nodo se llamaba `id`, y en el mismo ámbito
había un `for (var id in logograms)`: **el `var` del bucle pisa a la función
declarada**, así que al terminar el bucle `id` era una cadena. No es un choque que
avise, es un `TypeError` en la primera llamada y una vista vacía. Lo cazó el
remedo del DOM, que **lee los `id` del propio `browse.html`** en vez de tenerlos
escritos: si el marcado y el código dejan de ir a juego, falla en vez de probar
nada. Los once recuentos conocidos de `browse.js`, que reutiliza este mismo
índice, siguen acertando los once.

## 2026-09-14 09:19 · El patrón del fondo se veía tras las letras en las dos páginas nuevas

`style/theme.css` textura el `body` con un PNG repetido, y lo que tapa esa
textura es un `main` con fondo propio. **Esa regla no está en `common.css`, que
la cargan las cinco páginas, sino repetida en dos hojas de página**:
`articulo.css` y `graphicOutput.css`. Así que una página que no cargue ninguna de
las dos nace con el defecto, y es lo que pasó con `index.html` y `browse.html`,
las dos escritas ayer y hoy. Las dos llevaban su `<main>`: lo que faltaba no era
el elemento, era el `background-color`.

⚠️ **No es un descuido puntual, es dónde vive la regla.** Se arregla en cada
página porque `common.css` es cromo del sitio y tocarlo aquí lo bifurca, que es
justo la deuda que el `CLAUDE.md` de la raíz deja abierta en su §3. Mientras no
se decida quién sirve el cromo, **cada página nueva volverá a nacer con el patrón
detrás de las letras**, y hay que acordarse a mano. Queda anotado en el `TODO.md`.

**Y `min-height: 100vh` no se copió**, aunque `graphicOutput.css` lo lleve: en
esta casa no hay `box-sizing: border-box` en ninguna hoja, así que con relleno
sumado daría un panel más alto que la ventana y una barra de desplazamiento
permanente. `analysis.html` la tiene por eso mismo; no hacía falta repetirlo.

## 2026-09-14 09:08 · Las estadísticas al README, y `tools/` se pone al día

**Las mediciones vuelven al documento que se lee.** `ESTADISTICAS.md` se escribió
el mismo día y ya venía con su propio defecto anotado: `despliegue.yaml` excluye
`*.md`, así que no se publicaba, y encima competía con el `README.md` por ser el
sitio donde se mira una cifra. Ahora `tools/build_stats.py` no escribe un fichero
aparte, sino que **reemplaza el bloque entre `<!-- BEGIN STATS -->` y
`<!-- END STATS -->` del README** y deja intacto el resto. La garantía de que las
cifras se generan y no se teclean se conserva entera: el resto del fichero es a
mano, el bloque no.

**Y cambia de idioma, porque el fichero al que entra manda.** El `README.md` de
este proyecto está en inglés, así que las doce secciones se tradujeron en vez de
incrustarse en castellano. Se comprobó que la traducción no perdiera nada
contando **todas las cifras de los dos textos**: solo tres diferencias, y las
tres a mejor. El «83 %» del original estaba **tecleado a mano** y ahora sale de
`pct()`, que dice 83.1; y «Cuatro entradas tienen descomposición sin operador»
también estaba escrito a pelo, con la cuenta ahora generada.

⚠️ **Un fallo que solo se ve si se cuentan los grafemas.** La misma comparación
delató que 砼 U+783C se había escrito como `\u7839`, que es 砹. Un carácter
distinto, con su glifo propio, en un ejemplo sobre el hormigón. Una revisión a
ojo no lo habría visto: la lista de tres caracteres se lee igual de bien con el
equivocado dentro. Comparar **conjuntos de caracteres**, y no solo de números, es
lo que lo cazó.

⚠️ **Y dos `%%` literales llegaron a la salida.** Las líneas con `%` que no pasan
por formateo no necesitan duplicarlo, y las que sí lo necesitan están al lado.
Salió impreso «35 %% coverage» en el README.

**`readme/` deja de existir.** Sus cinco PNG suben a la raíz como `capture1.png`
a `capture5.png`, **numerados por orden de aparición en el README**, que es el
mismo criterio que ya usaba `hierarchical-diagram-builder` con su `capture.png`.
En `despliegue.yaml`, el patrón `readme/**` pasa a `capture*.png`.

**`graphemes/` se mete en `img/`**, manteniendo la carpeta, así que las cinco
figuras del artículo son ahora `img/graphemes/`. Al mudarla apareció que
**`git mv` se negaba**: la carpeta **nunca se había añadido al índice**. Los cinco
PNG rescatados del sitio el 2026-09-13 llevaban desde entonces sin versionar, y
nadie lo habría notado hasta necesitarlos.

⚠️ **Y quedaba un sexto fichero en el sitio.** `graphemes/0OFFLINE/癍.png`, 15 KB,
una figura apartada que el rescate no se llevó porque el `0OFFLINE` de esa
subcarpeta no se miró. Está ahora en `img/graphemes/0OFFLINE/`. El
`build_inventory.py` ya tenía la regla para clasificarla, escrita contra una ruta
que en el repositorio no existía: **la regla llevaba un día apuntando al vacío**.

### `tools/`: qué venía del repositorio ya actualizado y qué no

Se cotejaron los **diecisiete ficheros** que este proyecto comparte por ruta con
`hierarchical-diagram-builder`. La conclusión no es la que sugería la pregunta:
**de los cinco que divergían, solo uno estaba por detrás.**

| Fichero | Quién iba por delante |
|---|---|
| `js/binarydivision.js` | **hdb**, con tres mejoras reales |
| `js/taxogrid.js` | **phsemgram**, solo por la licencia |
| `style/common.css` | **ninguno**: son ficheros distintos, 811 líneas contra 8 |
| `style/graphicOutput.css`, `style/taxogrid.css` | **phsemgram**, que trae la copia viva del sitio |

**Las tres mejoras traídas** a `js/binarydivision.js`: `fontcolor` pasa de
`'black'` a `'currentColor'`, que es lo que hace que el diagrama siga al tema
claro u oscuro; los márgenes bajan de `max(0.2·tamaño, 100)` a
`max(0.1·tamaño, 30)`; y aparece `terminalTextHeight = fontsize · 3`, que reserva
sitio abajo para las etiquetas terminales. De paso se fue la primera de las **dos
asignaciones seguidas a `var margin`**, que era código muerto desde 2019.

⚠️ **Es un cambio visual que no se ha podido mirar**, porque aquí no hay
navegador. Con `fontsize: 18`, un árbol de 600 × 300 pasa de 840 × 500 a
720 × 414: más apretado de lado y con 54 px más de respiración abajo. Los dos
consumidores son `analysis.html` (que además **inserta el SVG vivo en el DOM**, y
es ahí donde `currentColor` sirve de algo) y `tools/binarydivision/`.

**Y el cotejo devolvió un hallazgo para el otro repositorio**: `js/taxogrid.js` y
`js/binarydivision.js` de `hierarchical-diagram-builder` **seguían estampando
`CC BY-NC`** en la cabecera, con un `LICENSE` que dice MIT desde el 2026-08-26.
Es el residuo que el `CLAUDE.md` de la raíz manda corregir en cuanto se vea.
Corregido allí; los dos ficheros son ahora **idénticos byte a byte** en los dos
repositorios, que es la única forma de que nadie tenga que volver a compararlos.

**Lo que no se ha tocado y es decisión pendiente**: `tools/binarydivision/` de
este repositorio es el **Binary Tree Diagrammer interactivo de 2019**, y el
`binarydivision.html` de la raíz de hdb ya no es esa página sino un **visor
empotrable para iframe**; lo interactivo se mudó a su `index.html`. No son la
misma página con distinta edad, así que aquí no hay nada que «actualizar»: hay
que decidir si este proyecto conserva su copia autónoma o enlaza a la desplegada,
que es **el mismo dilema del cromo del sitio** y se resuelve con él.

## 2026-09-14 08:48 · `browse.html`: siete páginas en una, y el árbol se muda

El reparto que lo ordena todo: **`analysis.html` es un carácter, `browse.html` es
el conjunto.** De ahí sale que los árboles ascendentes, que estaban de cuarta
pestaña en el visor, se hayan mudado aquí: un árbol arranca en un componente y
despliega su familia entera, y eso es una vista del corpus, no del carácter.

**Lo que absorbe:**

| Retirada | Qué la sustituye |
|---|---|
| 6 × `DataTables_static_*.html` | `browse.html?origin=…&cols=…` |
| `DataQuery.html` | la caja de «pegar una lista» |

Eran **8,1 MB de HTML generado con unas 38 000 referencias almacenadas** a un
dato que está en el mismo repositorio. Se conservan en
`0OFFLINE/tablas-estaticas-sustituidas/` con un `LEEME.md` que dice qué sustituye
a cada una. **La raíz publicable bajó de 13,4 MB a 5,3.**

**Dos maneras de elegir filas, porque contestan preguntas distintas.** Por
propiedad —dos particiones, tres medidas de profundidad, trazos y cinco
filtros— y **por enumeración**, pegando una lista. Lo segundo era `DataQuery.html`
entero y ningún filtro lo sustituye: una lista de vocabulario de un libro de
texto no es una propiedad. Lo pegado que no sea grafema se ignora, así que pegar
prosa funciona.

**Lo que ninguna tabla estática podía dar**, porque hace falta recorrer el grafo
entero: las tres divisibilidades, el papel en el sistema, el acuerdo con
Karlgren, y el par tradicional/simplificado. Y `hint`, que cubre el 93 % y solo
enseñaba la página más escondida del proyecto.

**Cómo se comprobó**, que es lo que convierte esto en medición y no en
impresión: se ejecutó `browse.init()` contra un remedo mínimo del DOM que
**descubre los `id` leyendo el propio `browse.html`**, así que si el marcado y el
código dejan de ir a juego, salta. Los **catorce filtros con cifra conocida
aciertan todos** contra `ESTADISTICAS.md`: 227 pictogramas, 271 con radical ≠
semántico, 205 que Karlgren discute, 3359 atestiguados, 4 con divisibilidad
etimológica 4, 2 con la de Wikimedia en 7.

**Decisiones que conviene tener escritas:**

- **Las columnas se ordenan siempre igual**, por el orden canónico de `COLUMNS`,
  no por el orden en que las lista un preset. Es estable y evita que la misma
  selección salga distinta según cómo se llegó a ella.
- **Se pinta a trozos de 150 filas.** 9574 `<tr>` de golpe congelan la página.
- **Los enlaces viejos sobreviven como parámetros de URL**, así que los seis
  puntos del artículo siguen apuntando a lo que querían decir:
  `browse.html?origin=pictographic&cols=etymology`.

⚠️ **Lo que esto rompe**: las siete URLs publicadas mueren en el próximo
despliegue, porque `--delete` se las lleva. Los enlaces de casa ya están
reapuntados; los de fuera, no los hay que sepamos, pero un marcador sí se rompe.

## 2026-09-14 00:30 · ESTADISTICAS.md, y se resuelve una contradicción de siete años

`tools/build_stats.py` mide el corpus entero y escribe `ESTADISTICAS.md`. **Las
cifras se generan, no se teclean**, así que el documento no puede desviarse del
dato. Doce apartados: cobertura de cada campo, las particiones, las escalas, los
filtros y las anomalías.

**Lo que resolvió al escribirlo**, y es la razón de haber medido en vez de copiar:
la nota del taller decía que la recursividad gráfica llega a **7** y mi medición
decía **8**, para los mismos caracteres. Ninguna estaba mal: **son tres medidas
distintas sobre tres fuentes distintas**, y llamarlas todas «divisibilidad» era
el error.

| Medida | Fuente | Máximo | Quién lo alcanza |
|---|---|---:|---|
| Etimológica | `etymology.semantic` + `phonetic` | **4** | 礴 臟 蘩 蠮 |
| Gráfica IDS | `decomposition`, n-aria | **8** | 儺擲攤灘癱縮缩蓿襫躑 |
| Gráfica Wikimedia | `graphicaldecomposition`, binaria | **7** | 擲 躑 |

La del artículo es la primera; la del taller era la tercera. Y explica de paso por
qué **躑 es el carácter que `analysis.html` trae puesto de fábrica**: es uno de los
dos más hondos por la medida que se estaba usando entonces.

**Lo demás que salió al medir:**

- ⭐ **El 83 % de los grafemas no compone nada.** El sistema tiene un juego de
  piezas pequeño —1556 fonéticas, 329 semánticas— y 7952 hojas.
- ⭐ **`etymology.hint` cubre el 93 %** y es prosa que explica la composición
  («A house 宀 on fire 火»). Solo lo enseñaba `DataQuery.html`, la página más
  escondida: el campo más didáctico del dato estaba donde no lo veía nadie.
- **Radical y componente semántico se solapan, ninguno contiene al otro**: 227 en
  los dos papeles, 68 solo radical, 102 solo semántico. Y divergen en 271 entradas,
  que es donde la convención del diccionario se aparta de la etimología.
- **No hay ni un caso de chino medio sin chino antiguo**: la escala de
  atestiguación es binaria en la práctica.
- **Cuatro entradas se descomponen sin operador** —丁 de 一, 乡 de 幺, 孓 de 子,
  由 de 田—. No están mal formadas: son derivación por modificación del trazo, una
  relación que el formato IDS no sabe nombrar.

**Decidido además**: la página que funde las siete se llamará **`browse.html`**, a
nombre limpio. Las URLs viejas mueren y hay que actualizar los enlaces del
artículo y del índice.

## 2026-09-14 00:14 · Los iconos CC salían enormes: el volteo se dejó las hojas

Síntoma: los iconos de licencia de la barra de artículo, a tamaño natural. Causa:
**la aplicación había empezado a servir hojas de 2019 a páginas que en producción
recibían las de 2026**.

El bloque entero de `.article-toolbar` vive en el `common.css` del sitio, que es
de 2024. Al volverse autónomo, el proyecto pasó a servir **su** `common.css`, que
es el de 2019 y no conoce la barra: sin `.toolbar-center img { height: 12px }`,
los iconos salen al tamaño del PNG.

**No era el único hueco, y buscarlo entero fue lo que mereció la pena.** Cotejando
cada clase que usan las páginas contra cada regla que define el repo salieron
**20 clases huérfanas**; tras el arreglo quedan 7, y las 7 son ganchos que el
sitio tampoco estiliza. Lo que faltaba:

| Hoja | Qué pasaba |
|---|---|
| `style/article-toolbar.css` | **Nueva.** Se extrajo del `common.css` del sitio y se vendoriza junto al `js/article-toolbar.js` que estiliza, para que el par viaje junto |
| `style/common.css` | Era la de 2019 (6 KB). Se tomó la del sitio (15 KB) |
| `style/graphicOutput.css` | Igual: la del repo era la generación anterior, con `.inputarea`, y la viva usa `.program_interface > .input_area`. **`DataQuery.html` estaba sin estilo entero** |
| `style/taxogrid.css` | Le faltaba un `user-select: none` |

**Efecto colateral que hubo que reparar**: al tomar el `graphicOutput.css` vivo,
`tools/binarydivision/binarydivision.html` perdió su `.inputarea`, que la hoja
nueva ya no define. Era una regla de una línea, `margin: 15px 0`, y se ha movido a
`tools/binarydivision/binarydivision.css`, que es de quien era.

**Lo que NO se tocó, y conviene saber por qué**: `js/common.js` y `js/taxogrid.js`
siguen siendo los del repo, que difieren de los del sitio. Ahí el reparto es otro:
el sitio define `deepFlatten` en `common.js` y el repo en `taxogrid.js`. Las dos
combinaciones son internamente coherentes y la del repo es más pequeña; mezclarlas
es lo que daba el `SyntaxError` de dos `const`.

## 2026-09-14 00:06 · Inventario del repositorio, y fuera lo que es del sitio

`0OFFLINE/inventario.html` lista **los 133 ficheros** del repositorio en una
página, con lo que es cada cosa. Lo genera `tools/build_inventory.py` y vive en
`0OFFLINE/` a propósito: indexa también el taller, y desde ahí no puede
publicarse por descuido.

Marca las dos cosas que no se ven mirando el árbol: **qué no lleva git** —lo
pregunta a `git check-ignore`, en vez de reimplementar el `.gitignore`— y qué no
publica el despliegue. Salen **60,9 MB de los 76,7 sin versionar**, todos del
taller.

**Se retiró `aboutme.html`**, que se había creado la noche anterior. Es página del
sitio, no del proyecto, igual que el `index.html` de la portada: esas piezas se
añaden al construir la web. El pie de `binarydivision.html` conserva el nombre del
autor sin enlace; el que dibuja `article-toolbar.js` queda apuntando a una página
que ya no está, y eso espera a que se decida quién sirve el cromo.

**Lo que apareció al inventariar**, y es el motivo de que un índice curado valga
más que un `ls`:

- ⭐ `0OFFLINE/mi análisis/ConclusionsGraphic2Recursivity.md` es **el resultado
  hermano y sin publicar**: la recursividad de la descomposición **gráfica** llega
  a **7**, y la alcanzan 擲 y 躑. La etimológica, la del artículo, se queda en 4.
  Comprobado contra el dato: 擲 y 躑 son en efecto los más hondos, por delante de
  蠮 y 礴. Explica de paso por qué 躑 es el carácter que `analysis.html` trae
  puesto por defecto, cosa que nadie había escrito en ninguna parte.
- `0OFFLINE/SOURCES.txt` **acredita a D3.js y el publicado no**. El borrador es más
  completo que lo que salió.
- `0OFFLINE/readme.md` es el README anterior al cambio de licencia: todavía dice
  CC BY-NC.

## 2026-09-13 23:56 · El repositorio se volteó y se vació el sitio de originales

`writing/chineseGraphemes/` pasó a ser la raíz. El repo **imitaba el árbol del
sitio** —la aplicación colgaba de `writing/chineseGraphemes/` y los recursos
compartidos estaban dos niveles arriba— y por eso `../../js/` funcionaba en los
dos sitios y `adapta:` estaba vacío. Ahora el repo es autónomo: se lleva su
`js/`, `style/`, `jsexternal/` e `img/`, sus rutas son relativas a sí mismo, y
`adapta:` **sigue** vacío, porque el despliegue coloca la raíz entera en
`writing/chineseGraphemes/` y todo resuelve igual.

**Lo que se midió, y es la razón de más peso para haberlo hecho:** el sitio
servía la aplicación con **su** `js/` y **su** `style/`, no con los del repo, y
**7 de los 12 ficheros compartidos diferían**. `js/common.js` eran 17 604 bytes
en el sitio y 1 939 en el repo; `style/common.css`, 15 289 contra 6 077. Los del
sitio son fósiles de 2019-2020 que otras páginas antiguas siguen usando. O sea
que **lo publicado y el repositorio llevaban años ejecutando código distinto** sin
que nada lo dijera. Al servir el proyecto los suyos, eso se acaba, y de paso
desaparece el choque de `deepFlatten` que obligaba a una adaptación defensiva:
ya no se cargan a la vez el `common.js` del sitio y el `taxogrid.js` del repo.

**Se trajo del sitio todo lo que quedaba**, porque esa copia va a desaparecer:

| | |
|---|---|
| 6 `DataTables_*.html` + `DataQuery.html` + `graphemesCulturalHints.html` | 8,3 MB de tablas publicadas |
| `0OFFLINE/` | **64 MB de taller**: Baxter-Sagart en `.xlsx`, la descomposición de Wikimedia, makemeahanzi con su `COPYING`, `article.md`, notas de análisis, SVG y capturas |
| `style/table.css`, `jsexternal/fitty.min.js` | dependencias vivas que el repo no tenía |
| `jsexternal/TextFit-master/` | referenciada aunque comentada; en el sitio vivía en `jsexternal/sinincorporar/` |

**Dos cosas que se encontraron rotas y llevaban años así:**

- `radialdiagram.js` del repo decía `dominant-middle`, que **no es un atributo
  SVG**. El del sitio decía `dominant-baseline`, que es el correcto. Parece una
  sustitución automática mal hecha: el fichero del repo era el más reciente por
  fecha y el equivocado por contenido. Se tomó el del sitio.
- `DataQuery.html` pedía `style/taxogram.css`, **que no existía en el sitio**:
  llevaba publicada con esa hoja en 404. Se trajo del linaje `taxogrid`, que es
  de donde salió.

**`conserva:` quedó vacío**, que era justo la métrica de si el sitio seguía
siendo fuente de algo.

**Lo que salió al revés:** se buscaba que el repositorio fuera la fuente única, y
la reorganización **crea dos copias nuevas** en vez de quitarlas.
`js/article-toolbar.js` y `style/theme.css` son cromo del sitio que usan 74
páginas, y ahora este proyecto lleva los suyos. Hoy son idénticos; en cuanto el
del sitio cambie, dejarán de serlo y nadie avisará.

## 2026-09-13 23:44 · Árboles ascendentes y exportación al editor de grafos

Cuarta pestaña en `analysis.html`, **Trees**, y un exportador al formato del
`basic_graph_editor`. Las tres vistas anteriores bajan de un carácter a sus
componentes; esta sube: un componente fonético A, los que lo usan, y los que usan
a aquellos.

**Lo que se midió, que es lo que da valor a la vista:**

| | Fonético | Semántico |
|---|---|---|
| Componentes distintos | 1556 | 329 |
| Profundidad del árbol ascendente | hasta 5 | 2 en 306 de los 329 |
| Máximo de hijos directos | 28 (令) | **399** (氵) |

**La relación semántica no es un árbol, es una clasificación.** 氵 tiene 399
hijos y ningún nieto. Por eso la vista semántica ofrece **solo los 23
componentes con profundidad real** y no los 329: dibujar una lista plana de 399
ramas de un nivel no enseña nada. Es la misma asimetría que ya decía el artículo
—la recursividad semántica es rarísima— pero ahora contada.

**Y la rama fonética suena parecido, pero solo en chino antiguo.** Es el hallazgo
que fija el orden de la interfaz:

```
各 *kˤak → 格 *kˤrak → 落 *kə.rˤak      es una familia
gè       → gé        → luò             no lo parece
```

De ahí que la pronunciación vaya delante del significado y que la reconstrucción
mande sobre el pinyin. Hay **3359 entradas con Baxter-Sagart** (35 %), pero la
cobertura sube al **69 % en los 1556 componentes que son raíz de un árbol**, que
es justo donde hace falta.

**Tres cosas que el dato no traía y hubo que deducir:**

- **`len(matches)` es el número de trazos.** No está documentado en ninguna
  parte. Se comprobó contra 13 caracteres de control (龠 = 17 ✓, 龍 = 16 ✓) y
  luego contra Baxter-Sagart: de 265 pares de variantes, **261 coinciden** en que
  el atestiguado es el de más trazos.
- **No hay campo de tradicional/simplificado.** Se detectan como hermanos bajo el
  mismo componente con el mismo pinyin y la misma definición: **602 grupos, 1204
  grafemas**. Dentro del par, el que está en Baxter-Sagart es el tradicional (265
  casos), y si no, el de más trazos (331 casos). Los ejemplares que salen son los
  correctos: 馳/驰, 黨/党, 舉/举.
- **El `GSR` de Baxter-Sagart es la serie fonética de Karlgren**, y sirve de
  verificación independiente de cada arista. De las **1727 aristas comprobables,
  1521 caen en la misma serie: el 88 %**. El 12 % restante se marca con ⚠ en vez
  de ocultarse, porque un alumno aprende ahí que esto es reconstrucción y no
  dogma.

**Lo que salió al revés de lo esperado:** se esperaba poder marcar los
neologismos como tales, y **el dato no permite decirlo**. Lo que sí se puede
afirmar es que un grafema **no está atestiguado en el corpus clásico** —ni en
Baxter-Sagart ni en Karlgren—, y ahí es donde caen 氫 'amoníaco', 烴
'hidrocarburo' y 砼 'hormigón', acuñados en el siglo XX con el mismo
procedimiento dos mil años después. La marca dice lo que se puede probar, no lo
que se sospecha.

**El grafo entero no cabe en el editor.** Son 9574 nodos y 13 726 aristas, y el
mayor que el editor ha llevado es el metro de Tokio con 216. Se exporta una
familia por fichero: la fonética mayor, 工, son 60 nodos. ⚠️ **Las semánticas sí
se pasan**: 艹 da 356 nodos, por encima de lo probado.

## El visor de fonosemantogramas

Se parte un carácter chino en su componente fonético y su componente semántico, y
se dibuja el resultado de tres maneras: árbol, rejilla de taxonomía y radial.

**Se hizo para ver la recursividad**, no para consultar caracteres: la parte
fonética de un carácter puede ser a su vez un fonosemantograma, y esa parte otra,
y la pregunta era hasta dónde llega. **La respuesta medida sobre la base de datos
es cuatro**, y solo la alcanzan 礴, 臟, 蘩 y 蠮.

Es un resultado que no se obtiene leyendo un diccionario: hace falta recorrer la
descomposición entera y contar, que es lo que hace la aplicación.
