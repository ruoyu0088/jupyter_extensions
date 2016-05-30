(function(){
var _pyfunc_add = function (a, b) { // nargs: 2
    if (Array.isArray(a) && Array.isArray(b)) {
        return a.concat(b);
    } return a + b;
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
var _pyfunc_range = function (start, end, step) {
var i, res = [];
    var val = start;
    var n = (end - start) / step;
    for (i=0; i<n; i++) {
        res.push(val);
        val += step;
    }
    return res;
};
var _pyfunc_truthy = function (v) {
    if (v === null || typeof v !== "object") {return v;}
    else if (v.length !== undefined) {return v.length ? v : false;}
    else if (v.byteLength !== undefined) {return v.byteLength ? v : false;} 
    else {return Object.getOwnPropertyNames(v).length ? v : false;}
};
var _pymeth_endswith = function (x) { // nargs: 1
    if (this.constructor !== String) return this.endswith.apply(this, arguments);
    return this.lastIndexOf(x) == this.length - x.length;
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
var _pymeth_startswith = function (x) { // nargs: 1
    if (this.constructor !== String) return this.startswith.apply(this, arguments);
    return this.indexOf(x) == 0;
};
var imports, load;
imports = ["base/js/namespace", "base/js/events", "require", "./jquery.side.menu"];
load = function (Jupyter, events, require, _) {
    var goto_head, handle_resize, is_head_cell, load_css, main, mark_head, nb, next_head, prev_head, remove_last_ch, toc, toggle_toc, update_marker, update_toc, update_toc_top;
    load_css = (function (name) {
        var link;
        link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl(name);
        (document.getElementsByTagName("head")[0]).appendChild(link);
        return null;
    }).bind(this);

    is_head_cell = (function (cell) {
        return _pyfunc_equals(cell.cell_type, "markdown") && (_pyfunc_truthy(_pymeth_startswith.call(cell.get_text(), "#")));
    }).bind(this);

    load_css("./side-menu.css");
    toc = jQuery("<div id=\"scpy3-toc\"></div>");
    toc.css({"position": "absolute", "width": "250px", "top": "0px", "right": "0px", "bottom": "0px", "background-color": "rgba(128,128,128,0.1)"});
    toc.appendTo(jQuery("body"));
    toc.hide();
    nb = Jupyter.notebook;
    remove_last_ch = (function (index, el) {
        var text, title;
        el = jQuery(el);
        text = el.html();
        if ((_pyfunc_truthy(text) && (_pyfunc_truthy(_pymeth_endswith.call(text, "\u00b6"))))) {
            el.html(text.slice(0,-1));
        }
        title = el.attr("title");
        if ((_pyfunc_truthy(title) && (_pyfunc_truthy(_pymeth_endswith.call(title, "\u00b6"))))) {
            el.attr("title", title.slice(0,-1));
        }
        return null;
    }).bind(this);

    update_toc = (function () {
        if (_pyfunc_truthy(toc["is"](":visible"))) {
            update_toc_top();
            jQuery("#scpy3-toc").empty();
            Jupyter.notebook.element.sideMenu({container: "#scpy3-toc", hs: ["h1", "h2", "h3", "h4", "h5"]});
            _pymeth_find.call(toc, "span").each(remove_last_ch);
        }
        return null;
    }).bind(this);

    update_toc_top = (function () {
        toc.css("top", "" + (jQuery("#header").height()) + "px");
        _pymeth_find.call(toc, ".side-menu").height(toc.height() - 20);
        return null;
    }).bind(this);

    update_marker = (function () {
        var c, cell, i, side_menu, start;
        side_menu = nb.element.data("sideMenu");
        if ((!_pyfunc_truthy(side_menu))) {
            return null;
        }
        start = nb.get_selected_index();
        cell = null;
        for (i = start; i > -1; i += -1) {
            c = nb.get_cell(i);
            if (_pyfunc_truthy(is_head_cell(c))) {
                cell = c;
                break;
            }
        }
        if ((cell !== null)) {
            mark_head(cell);
        }
        return null;
    }).bind(this);

    toggle_toc = (function () {
        toc.toggle();
        update_toc();
        update_toc_top();
        handle_resize();
        return null;
    }).bind(this);

    mark_head = (function (cell) {
        var id_, side_menu;
        side_menu = nb.element.data("sideMenu");
        if ((!_pyfunc_truthy(side_menu))) {
            return null;
        }
        id_ = (_pymeth_find.call(cell.element, ".rendered_html").children(0)).attr("id");
        side_menu.showPosition(id_);
        return null;
    }).bind(this);

    goto_head = (function (step) {
        var cell, i;
        i = nb.get_selected_index();
        while (true) {
            i=_pyfunc_add(i, step)
            cell = nb.get_cell(i);
            if ((cell === null)) {
                break;
            }
            if (_pyfunc_truthy(is_head_cell(cell))) {
                nb.select(i);
                nb.scroll_to_cell(i);
                mark_head(cell);
                break;
            }
        }
        return null;
    }).bind(this);

    prev_head = (function () {
        goto_head(-1);
        return null;
    }).bind(this);

    next_head = (function () {
        goto_head(1);
        return null;
    }).bind(this);

    handle_resize = (function () {
        var diff, el_cell, el_right_edge, nc, new_padding, padding_left, win_width;
        if (_pyfunc_truthy(toc["is"](":visible"))) {
            el_cell = Jupyter.notebook.get_cell(0).element;
            el_right_edge = _pyfunc_add(el_cell.width(), (el_cell.offset().left));
            win_width = jQuery(window).width();
            diff = 260 - (win_width - el_right_edge);
            nc = jQuery("#notebook-container");
            new_padding = _pyfunc_add((parseInt(nc.css("padding-right"))), diff);
            padding_left = parseInt(nc.css("padding-left"));
            new_padding = Math.max(new_padding, padding_left);
            nc.css("padding-right", new_padding);
        } else {
            nc = jQuery("#notebook-container");
            nc.css("padding-right", nc.css("padding-left"));
        }
        return null;
    }).bind(this);

    main = (function () {
        var action, actions, dummy1_sequence, km, name;
        actions = {toggle_toc:{"help": "", "icon": "", "key": "Alt-t", "handler": toggle_toc}, prev_head:{"handler": prev_head, "key": "Ctrl-left"}, next_head:{"handler": next_head, "key": "Ctrl-right"}};
        km = Jupyter.keyboard_manager;
        dummy1_sequence = actions;
        for (name in dummy1_sequence) {
            if (!dummy1_sequence.hasOwnProperty(name)){ continue; }
            action = dummy1_sequence[name];
            km.actions.register(action, name, "scpy3");
            km.command_shortcuts.add_shortcut(action.key, "scpy3:" + name);
        }
        return null;
    }).bind(this);

    events.on("create.Cell", update_toc);
    events.on("delete.Cell", update_toc);
    events.on("select.Cell", update_marker);
    events.on("resize-header.Page", update_toc_top);
    events.on("command_mode.Notebook", update_toc);
    jQuery(window).resize(handle_resize);
    events.on("theme-changed.scpy3", update_toc_top);
    return {"load_ipython_extension": main};
};

define(imports, load);
})()