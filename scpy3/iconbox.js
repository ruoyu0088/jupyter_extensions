(function(){
var _pyfunc_contains = function contains (a, b) { // nargs: 2
    if (b == null) {
    } else if (Array.isArray(b)) {
        for (var i=0; i<b.length; i++) {if (_pyfunc_equals(a, b[i]))
                                           return true;}
        return false;
    } else if (b.constructor === Object) {
        for (var k in b) {if (a == k) return true;}
        return false;
    } else if (b.constructor == String) {
        return b.indexOf(a) >= 0;
    } var e = Error('Not a container: ' + b); e.name='TypeError'; throw e;
};
var _pyfunc_equals = function equals (a, b) { // nargs: 2
    if (a == null || b == null) {
    } else if (Array.isArray(a) && Array.isArray(b)) {
        var i = 0, iseq = a.length == b.length;
        while (iseq && i < a.length) {iseq = equals(a[i], b[i]); i+=1;}
        return iseq;
    } else if (a.constructor === Object && b.constructor === Object) {
        var akeys = Object.keys(a), bkeys = Object.keys(b);
        akeys.sort(); bkeys.sort();
        var i=0, k, iseq = equals(akeys, bkeys);
        while (iseq && i < akeys.length) {k=akeys[i]; iseq = equals(a[k], b[k]); i+=1;}
        return iseq;
    } return a == b;
};
var _pyfunc_truthy = function (v) {
    if (v === null || typeof v !== "object") {return v;}
    else if (v.length !== undefined) {return v.length ? v : false;}
    else if (v.byteLength !== undefined) {return v.byteLength ? v : false;} 
    else {return Object.getOwnPropertyNames(v).length ? v : false;}
};
var _pymeth_append = function (x) { // nargs: 1
    if (!Array.isArray(this)) return this.append.apply(this, arguments);
    this.push(x);
};
var _pymeth_find = function (x, start, stop) { // nargs: 1 2 3
    if (this.constructor !== String) return this.find.apply(this, arguments);
    start = (start === undefined) ? 0 : start;
    stop = (stop === undefined) ? this.length : stop;
    start = Math.max(0, ((start < 0) ? this.length + start : start));
    stop = Math.min(this.length, ((stop < 0) ? this.length + stop : stop));
    var i = this.slice(start, stop).indexOf(x);
    if (i >= 0) return i + start;
    return -1;
};
var block_types, imports, load;
imports = ["base/js/namespace", "require"];
block_types = {"TIP": "fa-lightbulb-o", "WARNING": "fa-warning", "LINK": "fa-link", "SOURCE": "fa-file-text", "QUESTION": "fa-question"};
load = function (Jupyter, require) {
    var format_block, main, on_create_cell;
    format_block = (function (cell, evt) {
        var content, el, first_output, mark, output, td_first, wrap;
        cell = evt.cell;
        if ((!_pyfunc_equals(cell.cell_type, "markdown"))) {
            return null;
        }
        el = cell.element;
        output = _pymeth_find.call(el, "div.text_cell_render");
        first_output = output.children();
        if ((_pyfunc_equals(first_output.prop("tagName"), "BLOCKQUOTE"))) {
            mark = _pymeth_find.call(first_output, "p strong").text();
            console.log(mark);
            if ((_pyfunc_equals(mark, "") && ((!_pyfunc_equals(first_output.attr("class"), "icon_box"))))) {
                wrap = jQuery("<div/>").addClass("scpy3-info-box");
                wrap.html(cell.get_rendered());
                output.html(wrap);
            } else if (_pyfunc_truthy(_pyfunc_contains(mark, block_types))) {
                content = _pymeth_find.call(output, "p:not(:first)");
                first_output.addClass("icon_box");
                first_output.html("<table class=\"icon_box\"><tr><td class=\"first-column\"></td><td></td></tr></table>");
                td_first = _pymeth_find.call(first_output, "td:first");
                td_first.html("<div class=\"fa large_font " + block_types[mark] + "\"></div>");
                _pymeth_append.call(_pymeth_find.call(first_output, "td:last"), content);
            }
        }
        return null;
    }).bind(this);

    on_create_cell = (function (notebook, evt) {
        var cell, index;
        cell = evt.cell;
        index = evt.index;
        cell.events.on("rendered.MarkdownCell", format_block);
        return null;
    }).bind(this);

    main = (function () {
        var cell, dummy1_sequence, dummy2_iter, load_css;
        load_css = (function (name) {
            var link;
            link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = require.toUrl(name);
            (document.getElementsByTagName("head")[0]).appendChild(link);
            return null;
        }).bind(this);

        load_css("./iconbox.css");
        jQuery([Jupyter.events]).on("create.Cell", on_create_cell);
        dummy1_sequence = Jupyter.notebook.get_cells();
        if ((typeof dummy1_sequence === "object") && (!Array.isArray(dummy1_sequence))) {
            dummy1_sequence = Object.keys(dummy1_sequence);
        }
        for (dummy2_iter = 0; dummy2_iter < dummy1_sequence.length; dummy2_iter += 1) {
            cell = dummy1_sequence[dummy2_iter];
            cell.events.on("rendered.MarkdownCell", format_block);
            format_block(cell, {"cell": cell});
        }
        return null;
    }).bind(this);

    return {"load_ipython_extension": main};
};

define(imports, load);
})()