/* Zoomable sunburst of one grapheme's relatives, on d3 v3.
   2019- Alejandro Rojo Gualix

   Based on http://bl.ocks.org/WilliamQLiu/76ae20060e19bf42d774

   Three things this used to get wrong, and what replaced them:

   - COLOUR SAID NOTHING. Arcs were filled from d3.scale.category20c() keyed on
     the PARENT's name, so every sibling came out the same colour: 口 has 333
     children and the ring was one flat band. Meanwhile the label was already
     being painted with d.color, which is the red/phonetic - blue/semantic
     distinction this whole project is about. Now the arc carries it too, so
     the ring answers a real question: of 口's 333 children only SIX use it for
     its sound. Those six are the interesting ones and they are now visible.

   - EVERY LABEL WAS DRAWN, at `Math.min(2, 70 / nodecount)` em. With 333 nodes
     that is 0.21em, about 5px, in a sector 4.7px wide: the glyph was wider
     than the slot it had to sit in. A ring of radius 250 holds about 130 CJK
     glyphs legibly, and no font size fixes the 134th. Now a label is drawn
     only where there is room for it, measured; the rest stay reachable by
     hover, which already shows a tooltip, and by click.

   - IT NEVER ZOOMED, though half of it was written: `stash` was called and
     `arcTween` was defined and never invoked. Clicking a node with children
     now opens it to the full circle, which is what gives the crowded cases
     the room they need. Clicking the middle goes back up.
*/

var d3Layout = function (root, width = 500, height = 500) {

    var radius = Math.min(width, height) / 2;

    var host = d3.select("#radialdiagram");
    host.selectAll("svg, .rd-zoom").remove();

    // The size in pixels as well as the viewBox, and the same number in both.
    // Without it the stylesheet's caps decided the rendered size: a 656-unit
    // viewBox came out 611px tall, so one unit was 0.93px and every label was
    // 7% smaller than the code that placed it believed. That premise -- one
    // unit inside the drawing is one pixel on screen -- is what lets glyphSize
    // decide in pixels whether a character fits.
    var svgRoot = host.append("svg")
        .attr("width", 2 * radius).attr("height", 2 * radius)
        .attr("viewBox", `${-radius} ${-radius} ${2 * radius} ${2 * radius}`);
    var svg = svgRoot.append("g");
    // Everything that is GEOMETRY hangs off the stage and is scaled with it.
    // Everything that is TEXT is counter-scaled by 1/k inside it, so it keeps
    // one size on screen. That asymmetry is the whole point: it is what makes
    // labels appear as the arcs grow. If the type scaled too, the ratio between
    // a glyph and the arc holding it would never change and not one new
    // character would ever show, however far in you went.
    var stage = svg.append("g").attr("class", "stage");

    var k = 1;                                  // current magnification

    // Normalised layout plus scales, which is what makes zooming possible: the
    // zoom is a transition of the scales' domains, not a re-layout.
    var x = d3.scale.linear().range([0, 2 * Math.PI]);
    var y = d3.scale.sqrt().range([0, radius]);

    var partition = d3.layout.partition()
        .sort(null)
        .size([1, 1])
        .value(function (d) { return 1; });

    var arc = d3.svg.arc()
        .startAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
        .endAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
        .innerRadius(function (d) { return Math.max(0, y(d.y)); })
        .outerRadius(function (d) { return Math.max(0, y(d.y + d.dy)); });

    // How much of the radius the middle keeps, whatever the tree's depth.
    var HOLE = 0.5;

    var nodes = partition.nodes(root);
    reband(nodes);
    var focus = root;

    // d3 gives every level the same slice of the value range, which the sqrt
    // scale above turns into the same AREA per level. That is the sunburst
    // convention and these trees break it, because they are very wide and very
    // shallow: 口 has 329 relatives at the first level, 75 at the second and
    // EIGHT at the third, and that third was getting a quarter of the disc to
    // draw eight sectors in. On screen it did not read as a ring at all, but as
    // a few hairs sticking out past the edge of the drawing.
    //
    // It also left the hole to be whatever the division happened to leave over,
    // so the same centre text sat in a hole of 71% of the radius on a one-level
    // tree and 50% on a three-level one. One level is the commonest shape by
    // far -- 5474 of the 6966 characters that decompose at all -- and there the
    // text filled a third of the width of its own hole while the ring was a rim.
    //
    // So: the hole is fixed, and each level gets a share of the rest in
    // proportion to the SQUARE ROOT of what it holds. The square root and not
    // the count, because the count alone leaves the deepest ring three pixels
    // wide, and a ring nobody can see is a level deleted rather than a level
    // made smaller.
    function reband(nodes) {
        var deepest = 0, census = [];
        nodes.forEach(function (d) {
            deepest = Math.max(deepest, d.depth);
            census[d.depth] = (census[d.depth] || 0) + 1;
        });
        if (!deepest) return;
        var total = 0;
        for (var i = 1; i <= deepest; i++) total += Math.sqrt(census[i]);
        // Fractions of the RADIUS first, then squared, because `y` is a sqrt
        // scale: a ring edge wanted at f*radius is the value f*f.
        var edge = [0, HOLE * HOLE], acc = 0;
        for (var i = 1; i <= deepest; i++) {
            acc += Math.sqrt(census[i]);
            var f = HOLE + (1 - HOLE) * acc / total;
            edge.push(f * f);
        }
        nodes.forEach(function (d) {
            d.y = edge[d.depth];
            d.dy = edge[d.depth + 1] - edge[d.depth];
        });
    }

    // Define the div for the tooltip
    // Its own class as well as .tooltip: the rules that make it visible again
    // are scoped to rd-tip, so loading this stylesheet cannot un-hide someone
    // else's tooltip on some other page.
    var div = d3.select("body").select("div.rd-tip");
    if (div.empty()) {
        div = d3.select("body").append("div").attr("class", "tooltip rd-tip").style("opacity", 0);
    }

    var group = stage.selectAll("g.slice")
        .data(nodes)
        .enter().append("g")
        .attr("class", function (d) { return d.depth ? "slice node" : "slice root"; });

    var path = group.append("path")
        .attr("d", arc)
        // The class, not an inline fill: the stylesheet owns the palette, so it
        // can follow the light/dark theme the rest of the page follows.
        .attr("class", function (d) {
            if (!d.depth) return "arc";
            return d.color === "red" ? "arc phon" : d.color === "blue" ? "arc sem" : "arc";
        })
        .on("mouseover", function (d) {
            if (d.depth) d3.select(this).classed("hot", true);
            div.transition().duration(200).style("opacity", .9);
            // For a sector too narrow to carry its character, this is the only
            // place that says which character it is. So it also says what the
            // arc's colour means, rather than leaving the reader to remember.
            var role = d.color === "red" ? "phonetic" : d.color === "blue" ? "semantic" : "";
            div.html(`
              <table>
                <tbody>
                  <tr>
                    <th rowspan="3">${d.id}</th>
                    <td>${d.definition}</td>
                  </tr>
                  <tr class="phon">
                    <td>${d.pinyin}</td>
                  </tr>
                  <tr class="role">
                    <td>${role}</td>
                  </tr>
                </tbody>
              </table>`)
            placeTip(d3.event.pageX, d3.event.pageY);
        })
        .on("mouseout", function () {
            div.transition().duration(500).style("opacity", 0);
            d3.select(this).classed("hot", false);
        })
        .on("click", function (d) {
            // A drag that happens to finish on a sector is not a click on it.
            if (d3.event.defaultPrevented) return;
            if (!d.depth) { centreClick(); return; }
            // A node with children can be opened; a leaf has nothing to open,
            // so for a leaf the click still means "take me to this character".
            if (d.children && d.children.length) zoomTo(d);
            else window.open('?q=' + d.name);
        });

    // Keeps the box inside the window, for two reasons. Near the right or the
    // bottom edge it used to run off the screen; and being positioned against
    // the document rather than the panel, a box hanging past the bottom
    // STRETCHED the page, which is one of the ways a diagram that fits its own
    // panel still managed to raise a scrollbar.
    function placeTip(pageX, pageY) {
        var node = div.node();
        // Measured from the origin first: the box is shrink-to-fit, so asking
        // its width where it is about to sit would measure a narrower box.
        node.style.left = "0px";
        node.style.top = "0px";
        var w = node.offsetWidth, h = node.offsetHeight, pad = 14;
        var de = document.documentElement;
        var minX = window.pageXOffset + 2, minY = window.pageYOffset + 2;
        var maxX = window.pageXOffset + de.clientWidth - w - 2;
        var maxY = window.pageYOffset + de.clientHeight - h - 2;
        node.style.left = Math.max(minX, Math.min(pageX + pad, maxX)) + "px";
        node.style.top = Math.max(minY, Math.min(pageY - 28, maxY)) + "px";
    }

    // ── Labels around the ring ────────────────────────────────────────────────

    var label = group.filter(function (d) { return d.depth > 0; })
        .append("text")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("pointer-events", "none")
        .text(function (d) { return d.name; });

    // The middle: the focused character, big, with its reading and definition.
    var centre = stage.append("g").attr("class", "centre").on("click", centreClick);
    var centreHit = centre.append("circle").attr("r", 1).attr("class", "centre-hit");
    // Created once and rewritten, not appended on every redraw: appending would
    // stack a new <title> on each zoom and the browser reads the first one.
    var centreTip = centreHit.append("title");
    var centreText = centre.append("text").attr("text-anchor", "middle");

    function centreClick() {
        // At the top there is nowhere to go back to, so the middle keeps its
        // old job of opening the character chooser.
        if (focus === root) $('#logogramselectionModal').css('display', 'block');
        else zoomTo(focus.parent || root);
    }

    // How much room a label has, in the same units as the viewBox. Both
    // dimensions matter: the arc it sits on, and the thickness of its ring.
    var MIN_GLYPH = 9;
    var MAX_GLYPH = 22;

    function drawLabels() {
        label
            // scale(1/k) undoes the stage's magnification for this one element,
            // so the glyph lands at `glyphSize` screen pixels whatever k is.
            .attr("transform", function (d) {
                return "translate(" + arc.centroid(d) + ") scale(" + (1 / k) + ")";
            })
            .style("font-size", function (d) { return glyphSize(d) + "px"; })
            .style("display", function (d) { return glyphSize(d) ? null : "none"; });
    }

    function glyphSize(d) {
        var a0 = Math.max(0, Math.min(2 * Math.PI, x(d.x)));
        var a1 = Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)));
        var r0 = Math.max(0, y(d.y)), r1 = Math.max(0, y(d.y + d.dy));
        if (r1 <= r0 || a1 <= a0) return 0;
        // Times k: the room a label has is what the reader sees, not what the
        // untransformed drawing measures.
        var alongTheRing = (a1 - a0) * (r0 + r1) / 2 * k;
        var acrossTheRing = (r1 - r0) * k;
        var size = Math.min(alongTheRing * 0.85, acrossTheRing * 0.85, MAX_GLYPH);
        return size >= MIN_GLYPH ? size : 0;      // 0 means: no room, do not draw
    }

    function drawCentre() {
        var d = focus;
        // The disc covers the focused node's OWN ring, because the middle is
        // where that node is shown, as a character and not as an arc. Sizing it
        // to anything else leaves a bare band between the text and the first
        // ring of children.
        var r = Math.max(0, y(focus.y + focus.dy));
        centre.select("circle").attr("r", Math.max(12, r));
        centre.attr("class", focus === root ? "centre" : "centre zoomed");
        var defs = (d.definition || '').split(';').join('</tspan><tspan x="0px" dy="1.4em">');
        centreText.html(`
                <tspan class="logogram" x="0px">${d.id}</tspan>
                <tspan class="phon" x="0px" dy="2.4em">${d.pinyin}</tspan>
                <tspan x="0px" dy="1.4em">${defs}</tspan>`)
            .attr("y", -radius * 0.12);
        fitCentre(Math.max(12, r));
        centreTip.text(focus === root ? "Choose another character" : "Back to " +
            ((focus.parent && focus.parent.id) || root.id));
        scaleCentre();
    }

    // Kept apart from drawCentre because this one runs on every wheel notch and
    // that one re-parses a lump of markup.
    function scaleCentre() {
        centreText.attr("transform", "scale(" + (centreFit / k) + ")");
    }

    // The text belongs INSIDE the hole and not on the first ring. Its size is
    // set in em by the stylesheet and its width depends on how long the
    // definition is, which is nothing to do with how big the hole is: measured
    // across three characters at the same radius, the block came out 33%, 53%
    // and 77% of the width of its own hole. This only ever shrinks it, so the
    // look stays the one the stylesheet asks for and the long definitions are
    // the only ones that give ground.
    var centreFit = 1;
    function fitCentre(hole) {
        centreFit = 1;
        centreText.attr("transform", null);
        var b = centreText.node().getBBox();
        if (!b.width || !b.height) return;          // hidden panel: nothing to measure
        var far = 0;
        [[b.x, b.y], [b.x + b.width, b.y],
         [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].forEach(function (p) {
            far = Math.max(far, Math.sqrt(p[0] * p[0] + p[1] * p[1]));
        });
        if (far > 0) centreFit = Math.min(1, hole * 0.92 / far);
    }

    // ── Zoom ──────────────────────────────────────────────────────────────────

    function zoomTo(d) {
        focus = d;
        // Opening a branch puts the magnification back to 1. The angles are
        // about to be redistributed, so wherever the reader had panned to stops
        // meaning anything the moment the transition starts.
        if (zoom) { zoom.scale(1).translate([0, 0]); }
        k = 1;
        stage.attr("transform", null);
        if (typeof level !== "undefined") level.text("1\u00d7");
        host.classed("rd-zoomed", false);
        label.style("display", "none");          // no text while the arcs move
        path.transition()
            .duration(700)
            .attrTween("d", arcTween(d))
            .each("end", function (e, i) { if (i === 0) { drawLabels(); drawCentre(); } });
    }

    // Interpolate the scales' domains, not the arcs: that is what makes the
    // whole ring open out instead of each sector sliding on its own.
    function arcTween(d) {
        var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
            yd = d3.interpolate(y.domain(), [d.y, 1]),
            yr = d3.interpolate(y.range(), [d.y ? radius * 0.18 : 0, radius]);
        return function (node, i) {
            return i
                ? function () { return arc(node); }
                : function (t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(node); };
        };
    }

    // ── Magnification: wheel to come closer, drag to move ─────────────────────

    var MAX_ZOOM = 6;

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, MAX_ZOOM])
        .on("zoom", applyZoom);

    svgRoot.call(zoom).on("dblclick.zoom", null);

    function applyZoom() {
        k = zoom.scale();
        clampPan();
        stage.attr("transform", "translate(" + zoom.translate() + ") scale(" + k + ")");
        drawLabels();
        scaleCentre();
        level.text(Math.round(k * 10) / 10 + "\u00d7");
        host.classed("rd-zoomed", k > 1.01);
    }

    // Keeps the drawing over the viewport. The picture spans [-radius, radius]
    // and so does the viewBox, so covering it means the magnified edges stay
    // outside: |t| <= radius * (k - 1). At k = 1 that pins the pan to zero,
    // which is right -- there is nowhere to go when the whole circle is in view.
    // Without this, a drag can push the diagram off the screen and leave the
    // reader with a blank panel and no way of knowing what happened.
    function clampPan() {
        var limit = radius * (k - 1);
        var t = zoom.translate();
        zoom.translate([
            Math.max(-limit, Math.min(limit, t[0])),
            Math.max(-limit, Math.min(limit, t[1]))
        ]);
    }

    // The middle of a ring is a HOLE, and zooming about the middle of the view
    // therefore walks straight into nothing: from 2x on, the ring is entirely
    // off screen and the reader is left looking at blank. The wheel escapes
    // this on its own, because it zooms towards the pointer, but a button has
    // no pointer to aim at. So the buttons aim at the ring: they keep whatever
    // part of it the reader is already looking at, and at 1x, where that is the
    // hole and no direction is better than another, they take the top.
    function aimAtRing(p) {
        var inner = y(focus.y + focus.dy);       // where the rings begin
        var mid = (inner + radius) / 2;
        var d = Math.sqrt(p[0] * p[0] + p[1] * p[1]);
        if (d >= inner) return p;                // already looking at a ring
        if (d < 1) return [0, -mid];             // dead centre, so: upwards
        return [p[0] / d * mid, p[1] / d * mid];
    }

    // Keep the drawing point p in the middle of the view: p * k + t = 0.
    function setScale(next) {
        next = Math.max(1, Math.min(MAX_ZOOM, next));
        var t = zoom.translate(), k0 = zoom.scale();
        var p = aimAtRing([-t[0] / k0, -t[1] / k0]);
        zoom.scale(next).translate([-p[0] * next, -p[1] * next]);
        applyZoom();
    }

    function resetZoom() {
        zoom.scale(1).translate([0, 0]);
        applyZoom();
    }

    // Buttons, because a wheel that magnifies is invisible until someone tries
    // it, and because this one also stops the page scrolling under the pointer.
    var controls = host.append("div").attr("class", "rd-zoom");
    var button = function (label, title, fn) {
        controls.append("button").attr("type", "button").attr("title", title)
            .text(label).on("click", fn);
    };
    button("+", "Closer", function () { setScale(zoom.scale() * 1.6); });
    button("\u2212", "Further", function () { setScale(zoom.scale() / 1.6); });
    button("\u27f2", "Back to the whole circle", resetZoom);
    var level = controls.append("span").attr("class", "rd-level").text("1\u00d7");

    drawLabels();
    drawCentre();

    return { zoomOut: function () { zoomTo(root); }, reset: resetZoom };
}
