# Análisis de logogramas chinos

**La escritura china no es una galería de dibujitos.** De los 9574 caracteres
medidos aquí, **227 son dibujos de lo que significan: el 2,4 %.** Casi tres
cuartas partes son otra cosa, y mejor: un componente elegido por lo que
*significa*, soldado a un componente elegido por lo que *sonaba*. No es un
dibujo, es una ecuación de dos términos.

Y como cada término es a su vez un carácter, las ecuaciones **se anidan**.
[蠮](https://alerojorela.neocities.org/writing/chineseGraphemes/analysis.html?q=%E8%A0%AE)
es una abeja: 虫 «insecto» para el sentido, 翳 para el sonido. 翳 es a su vez
羽 + 殹, 殹 es 殳 + 医, y 医 es 矢 + 匸: cinco niveles hasta que la cadena se
acaba. Cuatro caracteres de todo el conjunto llegan tan hondo, y esta aplicación
se escribió para dibujarlos.

Coge un carácter, lo desarma, desarma sus partes y enseña el resultado de tres
maneras a la vez: un árbol, una rejilla anidada y un anillo ampliable con todos
los parientes del carácter, hacia arriba tanto como hacia abajo. 9574 grafemas,
6966 de ellos compuestos de sonido y sentido, con reconstrucción del chino
antiguo para 3359.

[![descomposición de la abeja 蠮, anidada cuatro veces](./capture_decomposition_蠮.png)](https://alerojorela.neocities.org/writing/chineseGraphemes/analysis.html?q=%E8%A0%AE&tab=decomposition)

fig. [蠮](https://alerojorela.neocities.org/writing/chineseGraphemes/analysis.html?q=%E8%A0%AE) (abeja), uno de los cuatro caracteres más profundos del conjunto. **Todas las capturas de este README son enlaces**: al pulsar una, el visor abre ese carácter en la pestaña desde la que se tomó la imagen

## Pictograma, ideograma, logograma, fonosemantograma

Cuatro palabras que se usan como si fueran una. Lo que las separa es **a qué
apunta el signo**:

| | Apunta a | Así que lo puede leer |
|---|---|---|
| **pictograma** | una cosa, pareciéndose a ella | cualquiera, en cualquier lengua |
| **ideograma** | una idea, por convenio | cualquiera que conozca el convenio: ⚠, ☮, 🚭 |
| **logograma** | una **palabra** de una lengua concreta, sonido incluido | solo quien habla esa lengua |

**Un pictograma no es un logograma, y un ideograma tampoco.** Apuntan a cosas y a
ideas; un logograma apunta a una palabra. Una señal de tráfico no es escritura, y
esa es toda la diferencia.

Todo carácter chino en uso hoy **es** un logograma: representa una palabra, tiene
una lectura, y nadie puede pronunciarlo sin saber chino. Lo que describen las
clases tradicionales no es, por tanto, lo que un carácter *es*, sino cómo se
**diseñó** en su día. El dato lo dice en un campo, `etymology.type`:

| Diseño | Entradas | Proporción | Qué se hizo |
|---|---:|---:|---|
| **pictográfico** | 227 | 2,4 % | se dibujó la cosa: [木](https://alerojorela.neocities.org/writing/chineseGraphemes/analysis.html?q=%E6%9C%A8) «un árbol», [口](https://alerojorela.neocities.org/writing/chineseGraphemes/analysis.html?q=%E5%8F%A3) «una boca abierta» |
| **ideográfico** | 1840 | 19,2 % | se juntaron significados: [林](https://alerojorela.neocities.org/writing/chineseGraphemes/analysis.html?q=%E6%9E%97) «dos árboles que representan un bosque», [灾](https://alerojorela.neocities.org/writing/chineseGraphemes/analysis.html?q=%E7%81%BE) «una casa 宀 ardiendo 火» |
| **fonosemántico** | 6966 | 72,8 % | una parte para el sentido, otra para el sonido |
| *sin declarar* | 541 | 5,7 % | |

La tercera fila es de donde viene el nombre de esta aplicación. Un
**fonosemantograma** (形声字) empareja un componente **semántico**, que dice
aproximadamente de qué trata la palabra, con uno **fonético**, que dice
aproximadamente cómo sonaba. Dos advertencias a las que el resto de este README
dedica su tiempo:

- **El sonido no es el sonido de hoy.** El componente fonético registró una
  pronunciación de hace dos o tres mil años. En mandarín moderno una familia
  fonética puede ser 各 *gè*, 格 *gé*, 洛 *luò*: al oído, ninguna familia. Por eso
  se imprime primero la reconstrucción del chino antiguo y después el pinyin.
- **Las dos relaciones no tienen la misma forma.** La fonética es una genealogía y
  va honda; la semántica es una clasificación y va ancha. 氵 tiene 395 hijos y
  ningún nieto.

## Árboles de composición, y el editor de grafos

**Decomposition** baja del carácter a sus componentes, dibujado de tres maneras a
la vez. **Family** va en las dos direcciones: hacia abajo, de qué está hecho el
carácter, y hacia arriba, desde un componente a los caracteres que lo usan y a
los que usan aquellos.

```
各 *kˤak      individual; each, every
  格 *kˤrak     form, pattern, standard
  洛 luò        a river in Shanxi
    落 *kə.rˤak   to fall, to drop
```

**La rama solo suena parecida en chino antiguo.** En pinyin se lee gè, gé, luò:
ninguna familia. Por eso la pronunciación va antes que el significado y por eso la
reconstrucción de Baxter-Sagart manda sobre el pinyin: es la prueba, y la glosa es
el comentario. 3359 entradas llevan Baxter-Sagart, y la cobertura sube al 69 % en
los 1556 componentes que encabezan un árbol.

Las dos vistas **no son simétricas, y lo dice el dato**: la relación fonética es
una genealogía (hasta 5 de profundidad, 28 hijos directos como mucho), mientras
que la semántica es una clasificación (304 de sus 328 componentes tienen
profundidad 2, y 氵 solo tiene 395 hijos sin ningún nieto). Por eso el selector
ofrece, en la vista semántica, solo los **24 componentes con profundidad de
verdad**.

**Un nodo es una palabra, no una grafía.** La escritura tradicional y la
simplificada de la misma palabra son un nodo con dos grafías, y las dos casillas
eligen cuál se enseña: las dos, cualquiera de ellas o, con las dos vacías, el nodo
desaparece. Hasta el 2026-09-14 eran dos nodos hermanos, lo que afirmaba un
parentesco donde hay un carácter escrito dos veces. Contar palabras en vez de
grafías es lo que hace que los árboles digan 1522 componentes fonéticos donde
[las mediciones](#el-dato-medido) dicen 1556.

**O abrir el bosque entero.** La primera entrada del selector quita la raíz única
y lista todo componente que no componga nada más: 1105 en la vista fonética, 304
en la semántica. Plegado, para que pinte de golpe; cada uno despliega su rama al
pulsarlo. Raíces maximales y no las 1556, porque sobre esas cada grafema aparece
exactamente una vez: listar todos los componentes imprimiría 格 dos veces, dentro
de 各 y otra vez como raíz propia.

Lo que marca el árbol:

| Marca | Significado |
|---|---|
| Grafema ámbar | No atestiguado en el corpus clásico, que es donde caen las acuñaciones del siglo XX: 氫 hidrógeno, 烴 hidrocarburo, 砼 hormigón |
| ⚠ en una arista | El GSR de Karlgren pone los dos caracteres en series fonéticas distintas. El 88 % de las aristas comprobables concuerdan; estas son el 12 % en discusión |
| Dos grafías, la segunda atenuada | Un par de variantes, un nodo. La escritura tradicional es la que lleva al lado la lectura impresa. Detectado, no declarado: el dato no tiene ese campo |

`tools/graph_export.py` escribe las mismas relaciones en el formato que lee
[basic_graph_editor](https://github.com/alerojorela/basic_graph_editor), una
familia por fichero, con `tools/editor-config.json` para las categorías y los
rótulos emergentes:

```bash
python3 tools/graph_export.py --families 12 --out ../basic_graph_editor/samples
python3 tools/graph_export.py --kind semantic --root 艹 --out graphs
```

El grafo entero son 9574 nodos y no cabe: lo mayor que el editor ha llevado
probado son 216 nodos. Las familias fonéticas se quedan en 60 como techo; las
semánticas tampoco caben (艹 son 356).

## Interfaz

<p>Este es el código de color de los componentes <span style="color: blue">semánticos</span> y <span style="color: red">fonéticos</span></p>

[![呵 desarmado: 口 como sentido en azul, 可 como sonido en rojo, y 可 abierto a su vez un nivel más](./capture_decomposition_呵.png)](https://alerojorela.neocities.org/writing/chineseGraphemes/analysis.html?q=%E5%91%B5&tab=decomposition)

fig. [呵](https://alerojorela.neocities.org/writing/chineseGraphemes/analysis.html?q=%E5%91%B5) hē (regañar): 口 «boca» da el sentido, 可 kě da el sonido, y 可 es a su vez un compuesto, 口 para el sonido sobre 丁 para el sentido. Los mismos dos colores hasta el fondo

[![el diagrama radial de los caracteres construidos sobre 口](./capture_family.png)](https://alerojorela.neocities.org/writing/chineseGraphemes/analysis.html?q=%E5%8F%A3&tab=family)

fig. La pestaña Family dibuja un diagrama radial interactivo (con d3.js). Enseña los descendientes, pero también los ascendientes: los logogramas que contienen al elegido

Al pulsar sobre el logograma actual se abre el recorrido por radicales y por
componentes semánticos

[![el selector de radicales, abierto sobre la pestaña Family de 見](./capture_family_radicals.png)](https://alerojorela.neocities.org/writing/chineseGraphemes/analysis.html?q=%E8%A6%8B&tab=family)

## Recorrer el conjunto entero

`browse.html` es el conjunto; `analysis.html` es un carácter. De ese reparto sale
dónde va cada cosa.

Dos maneras de elegir filas, porque contestan preguntas distintas:

- **Por propiedad.** Dos particiones de verdad (origen y disposición), tres
  medidas de divisibilidad, los trazos y cinco filtros. Cada número que hay detrás
  de un control está medido en [El dato, medido](#el-dato-medido), más abajo.
- **Por enumeración.** Se pega una lista de caracteres y solo sobreviven esos.
  Ningún filtro sustituye a esto: la lista de vocabulario de un libro de texto no
  es una propiedad. Lo que se pegue y no sea un grafema se ignora, así que pegar
  prosa funciona.

Las columnas se eligen, con preajustes para estudio, etimología, sonido y forma, y
las filas filtradas se copian como TSV. Los enlaces viejos sobreviven como
parámetros de la URL: `browse.html?origin=pictographic&cols=etymology`.

Los **árboles de composición** viven aquí también, por la misma razón: un árbol
empieza en un componente y despliega su familia entera, que es una vista del
conjunto.

<!-- BEGIN STATS -->
<!-- Lo genera tools/build_stats.py. No se edita entre las marcas. -->
## El dato, medido

⚠️ **Pendiente.** Las doce secciones de cifras las escribe
`tools/build_stats.py`, que hoy solo sabe inglés: son 190 literales y 8 KB de
prosa, 58 de ellos con formato. Mientras el generador no aprenda castellano, las
cifras están en [el README inglés](README.md#the-dataset-measured), y esta
sección se queda vacía a propósito, para que se note.
<!-- END STATS -->

## Disposición

La aplicación vive en la raíz del repositorio y es **autónoma**: se lleva su
propio `js/`, `style/`, `jsexternal/` e `img/`, así que las mismas rutas
relativas resuelven tanto si se abre `index.html` desde el disco como si se llega
a él por el sitio. No toma nada prestado de la página que lo aloja.

| | |
|---|---|
| `index.html` | La puerta, con la lista de todas las páginas |
| `analysis.html` | El visor, un carácter cada vez, en dos pestañas. La URL dice cuál y cuál: `?q=蠮` elige el carácter y `&tab=family` elige la pestaña (`decomposition` es la de por defecto, y un nombre desconocido se ignora en vez de discutirlo) |
| `browse.html` | El conjunto entero: filtros, columnas elegidas y los árboles de composición |
| `article.html` | El artículo. `article.es.html` es el original castellano del que se tradujo |
| `graphemesCulturalHints.html` | Las pistas culturales, leídas del mismo dato. El original castellano está en `graphemesCulturalHints.es.html` |
| `data/` | `derivedmergeddata.js`, 9574 entradas |
| `img/graphemes/` | Las figuras que usa el artículo |
| `capture*.png` | Las capturas que enseña este README. No se despliegan |
| `tools/` | `build_stats.py`, `build_inventory.py`, `graph_export.py`, la configuración del editor y la herramienta de división binaria |
| `0OFFLINE/` | El taller: fuentes crudas, borradores y notas de análisis. Ni se publica ni se versiona |

## Fuentes

[`SOURCES.md`](SOURCES.md), y lo mismo como página en `sources.html`: las tres
fuentes, sus licencias, cuánto de cada una no llegó al dato y los siete sitios en
los que se contradicen.

## Pendiente

Mejorar el escalado del texto

Añadir una pestaña de ejemplos con oraciones relacionadas con los componentes del
logograma

Obtener el dato de orientación: ⿰ o ⿱

Mejorar el selector de logogramas: multiselección

------

2019 Alejandro Rojo Gualix

MIT, ver [LICENSE](LICENSE). La atribución es la única condición.
