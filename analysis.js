/************************************************
Displays data & diagrams
for chinese grapheme decomposition

2019 Alejandro Rojo Gualix

MIT license
see LICENSE at the repository root
*************************************************/

var useIPA = false;



var hreflogograms = function (expr, hrefquery, target = '_blank') {
    // return expr.join('');
    if (typeof expr === 'string' || expr instanceof String) expr = expr.split(''); // convert to array
    var output = '';

    if (hrefquery === undefined) {
        output = '<span class="logogram">' + expr.join('</span><span class="logogram">') + '</span>'; // Divide characters for onclick events
    } else {
        for (var n = 0; n < expr.length; n++) {
            var link = `<a class="logogram" href="${hrefquery}${expr[n]}" target="_blank">${expr[n]}</a>`;
            output += link;
        }
    }
    return output;
}

/**************************************************************
 *                  IDS GRAPHICAL DECOMPOSITION
 **************************************************************/
//#region

var IDSchars = {
    "⿲": {
        "arity": 3
    },
    "⿳": {
        "arity": 3
    },
    "⿰": {
        "arity": 2
    },
    "⿱": {
        "arity": 2
    },
    "⿴": {
        "arity": 2
    },
    "⿵": {
        "arity": 2
    },
    "⿶": {
        "arity": 2
    },
    "⿷": {
        "arity": 2
    },
    "⿸": {
        "arity": 2
    },
    "⿹": {
        "arity": 2
    },
    "⿺": {
        "arity": 2
    },
    "⿻": {
        "arity": 2
    }
}
/*
  IDS Prefix notation
  example: 鳝 = ⿰⿱⿱⺈⿵⿰丨冂⿱⿻一丨一一⿱⿱⿰丶丷羊⿱⿱⿰丶丷一⿱⿰丨冂一
 
  str: opera sobre una string
  output: string
*/
// "舅": {"decomposition":"⿱臼男"
var GetIDSstring = function (str) {
    //var IDSstring= GetIDSstringRecursive(str).join('');
    var GetIDSstringRecursive = function (str) {

        //if (!Array.isArray(str)) str = str.split();
        if (str == '') return;
        var lg = logograms[str];
        if (lg === undefined || !('decomposition' in lg)) return undefined;
        if (lg.decomposition == '？') return [str];

        var output = [];
        var decomparray = lg.decomposition.split('');
        for (var n = 0; n < decomparray.length; n++) {
            var item = decomparray[n];
            if (item != '') {
                if (item in IDSchars) { // or /[⿰⿱⿲⿳⿴⿵⿶⿷⿸⿹⿺⿻]/.test(item); // regex boolean 
                    output = output.concat(item);
                } else if (item == '？') {
                    output = output.concat(item);
                } else {
                    var rv = GetIDSstringRecursive(item);
                    if (rv === undefined) {
                        output = output.concat(item);// terminal o sin representación en el diccionario
                    } else {
                        /*
                        concat no modifica, flatten
                        push modifica, nested
                        */
                        output.push(rv);
                    }
                }
            }
        }

        // console.log(str, decomparray, output);
        return output;
    }

    var IDSstring = deepFlatten(GetIDSstringRecursive(str)).join('');
    if (!PrefixNotationCheck(IDSstring, IDSchars)) alert('Error en la expresión\n' + IDSstring);

    console.log('GetIDSstring', IDSstring);
    return IDSstring;
}

// if (decompstring[0] == '⿲' || decompstring[0] == '⿳') alert('División ternaria no implementada');


//#endregion  
/**************************************************************
 *                      OBJECT PARSING
 **************************************************************/
//#region


// Data from Wikimedia
var getWikimedialogograms = function (lg) {
    if (lg === undefined) return undefined;
    if (!('graphicaldecomposition' in lg)) return undefined;
    var edges = [];
    if ('LeftComponent' in lg.graphicaldecomposition && lg.graphicaldecomposition.LeftComponent !== undefined) edges.push(
        { typeof: 'Left', source: lg.id, target: lg.graphicaldecomposition.LeftComponent });
    if ('RightComponent' in lg.graphicaldecomposition && lg.graphicaldecomposition.RightComponent !== undefined) edges.push(
        { typeof: 'Right', source: lg.id, target: lg.graphicaldecomposition.RightComponent });

    return edges.length > 0 ? edges : undefined;
}

var getChildNodes = function (lg) {
    if (lg === undefined) return undefined;
    if (!('etymology' in lg)) return undefined;
    var edges = [];
    if ('semantic' in lg.etymology && lg.etymology.semantic !== undefined) edges.push(
        { typeof: 'semantic', source: lg.id, target: lg.etymology.semantic });
    if ('phonetic' in lg.etymology && lg.etymology.phonetic !== undefined) edges.push(
        { typeof: 'phonetic', source: lg.id, target: lg.etymology.phonetic });

    // Check components order and reverses if needed from the default sem-phon
    if (lg.etymology.order !== undefined && lg.etymology.order == 'phon-sem') edges.reverse();

    return edges.length > 0 ? edges : undefined;
}
var getParentNodes = function (lg) {
    if (lg === undefined) return undefined;

    var edges = [];
    for (const [key, value] of Object.entries(logograms)) {
        if (!(/[举榉櫸舉]/.test(key))) { // PRoblemas recursión 舉-> idem 舉

            var childedges = getChildNodes(value);
            if (childedges !== undefined) {
                for (var n = 0; n < childedges.length; n++) {
                    if (childedges[n].target == lg.id) {
                        // console.log(lg.id + ' found in ' + key);
                        edges.push(
                            { typeof: childedges[n].typeof, source: lg.id, target: key });
                        //{ typeof: childedges[n].typeof, source: lg.id, target: key });
                    }
                }
            }

        }
    }

    return edges.length > 0 ? edges : undefined;
}


/* Annotations
    IPA
    frequency
    visual
        color

    links
    children [] 
        children {} RECURSION
        -> divisibility RECURSION
        -> family RECURSION

    parents [] RECURSION
        parents {} RECURSION
*/


var EdgeAnnotation = function (lg, edge) {
    if (edge.typeof == 'semantic') {
        lg.color = 'blue';
    } else if (edge.typeof == 'phonetic') {
        lg.color = 'red';
    } else {
        console.log('ERROR', 'EdgeAnnotation', edge.typeof);
    }

}
var GetPronunciation = function (lg) {
    if ('BaxterSagart' in lg) return lg.BaxterSagart.py;
    if ('BaxterSagart' in lg) return lg.BaxterSagart.OC;

    return lg.pinyin.join(', ');
    return "";
}
var AdditionalAnnotation = function (lg) {
    var pinyin = GetPronunciation(lg);
    var ipa = undefined;//pinyin2ipa(pinyin, { toneMarker: 'chaoletter', superscript: true });
    var transcription = useIPA ? ipa || pinyin : pinyin;// if IPA enabled use ipa whether ipa data exists, else use pinyin
    lg.namesubstrings = [transcription];
}


/*
Anota recursividad
 
id: string
fextractdata: function that extracts binary tuple
copynode: boolean, reference or value, adicionalmente incorpora descendencia
*/
// ¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡ TEN EN CUENTA QUE TAMBIŃE PUEDES DEVOLVER UN NUEVO OBJETO, SIN MODIFICAR NADA
var RecursiveAnnotation = function (id, fextractdata = getChildNodes, copynode = false) {
    if (id == '') return undefined;
    var source = logograms[id];
    if (source === undefined) return undefined;

    // ONE NODE PER OCCURRENCE, not one per logogram, which is what `copynode`
    // has always promised in its own comment above and never did.
    //
    // These graphs are not trees. A logogram can descend from the same radical
    // by two different roads: 啊 takes 口 straight, as its meaning, and again
    // through 阿, its sound, which contains 口 as well. Four of 口's 413
    // relatives do that (呵 啊 唔 囔), and 哥 is 可 twice over on the way down.
    // Annotating the shared entry made both occurrences THE SAME OBJECT, and
    // whatever wrote to it last won: d3's partition layout stamps x and y on
    // each node as it walks, so the second visit moved the first one's arc.
    // 啊 came out at 206 degrees while its parent 阿 sat between 33 and 39,
    // floating with nothing around it.
    //
    // A shallow copy is enough: what gets written per occurrence is the
    // annotation (color, family, divisibility, children, namesubstrings), and
    // everything read from the entry -- the definition, the etymology, the
    // readings -- is only read. It also gives each occurrence its own COLOUR,
    // which the shared object could not have: 啊 reaches 口 by meaning and 阿
    // by sound, and both arcs used to take whichever was written last. Measured
    // before: blue in both places. Now red under 阿 and blue under 口, which is
    // the distinction the whole diagram exists to show.
    var lg = copynode ? Copy(source) : source;

    AdditionalAnnotation(lg);
    // recursion attributes
    lg.divisibility = 0;
    lg.family = [id];//flat array
    delete lg.children;
    var children = [];

    var edges = fextractdata(lg); // IMPORTANT: data extraction function
    if (edges === undefined || edges.length == 0) return lg; // no divisibility info
    lg.links = edges;
    for (var n = 0; n < edges.length; n++) {
        var edge = edges[n];
        if (edge.target != null) {//"*" // == y no ===, con lo cuál es válido para null y undefined
            var sublg = RecursiveAnnotation(edge.target, fextractdata, copynode);
            if (sublg !== undefined) { // exists

                lg.family.push(...sublg.family); //... flatten
                lg.divisibility = Math.max(lg.divisibility, sublg.divisibility);
                EdgeAnnotation(sublg, edge);
                children.push(sublg);
            }
        }
    }

    lg.divisibility += 1;
    // console.log('RecursiveAnnotation', id, lg.divisibility, edges);
    if (copynode && children.length > 0) {
        lg.children = children;
    } else {
        delete lg.children;
    }
    return lg;
}
var IsRecursive = function (id, fextractdata = getChildNodes) {
    if (id == '') return undefined;
    var lg = logograms[id];
    if (lg === undefined) return undefined;

    var edges = fextractdata(lg); // IMPORTANT: data extraction function
    return (!(edges === undefined || edges.length == 0))
}


var Copy = function (obj) {
    var copiedobj = {};
    for (const [key, value] of Object.entries(obj)) {
        copiedobj[key] = value; // shallow copy
    }
    return copiedobj;
}


//#endregion  
