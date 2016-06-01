(function(){
var _pyfunc_add = function (a, b) { // nargs: 2
    if (Array.isArray(a) && Array.isArray(b)) {
        return a.concat(b);
    } return a + b;
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
var imports, load;
imports = ["base/js/namespace", "base/js/events", "require"];
load = function (Jupyter, events, require) {
    var load_css, main, nb, next_bookmark, prev_bookmark, search_bookmark, toggle_bookmark;
    load_css = (function (name) {
        var link;
        link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl(name);
        (document.getElementsByTagName("head")[0]).appendChild(link);
        return null;
    }).bind(this);

    load_css("./bookmark.css");
    nb = Jupyter.notebook;
    toggle_bookmark = (function () {
        var cell;
        cell = nb.get_selected_cell();
        cell.element.toggleClass("cell-bookmark");
        if (_pyfunc_truthy(cell.element.hasClass("cell-bookmark"))) {
            cell.metadata.scpy3_bookmark = true;
        } else {
            delete cell.metadata.scpy3_bookmark;
        }
        return null;
    }).bind(this);

    search_bookmark = (function (step) {
        var cell, cells, dummy1_else, dummy2_sequence, dummy3_iter, i, indexes, start;
        console.log("next_bookmark");
        cells = nb.get_cells();
        start = nb.get_selected_index();
        if (_pyfunc_truthy(step > 0)) {
            indexes = _pyfunc_add((_pyfunc_range((start + 1), cells.length, 1)), _pyfunc_range(0, start, 1));
        } else {
            indexes = _pyfunc_add((_pyfunc_range((start - 1), (-1), (-1))), (_pyfunc_range((cells.length - 1), start, (-1))));
        }
        dummy1_else = true;
        dummy2_sequence = indexes;
        if ((typeof dummy2_sequence === "object") && (!Array.isArray(dummy2_sequence))) {
            dummy2_sequence = Object.keys(dummy2_sequence);
        }
        for (dummy3_iter = 0; dummy3_iter < dummy2_sequence.length; dummy3_iter += 1) {
            i = dummy2_sequence[dummy3_iter];
            cell = cells[i];
            if (_pyfunc_truthy(cell.metadata.scpy3_bookmark)) {
                nb.select(i);
                nb.scroll_to_cell(i);
                dummy1_else = false; break;
            }
        } if (dummy1_else) {
            Jupyter.notification_area("notebook").set_message("No bookmark", 2000);
        }
        return null;
    }).bind(this);

    next_bookmark = (function () {
        search_bookmark(1);
        return null;
    }).bind(this);

    prev_bookmark = (function () {
        search_bookmark(-1);
        return null;
    }).bind(this);

    main = (function () {
        var action, actions, cell, dummy4_sequence, dummy5_sequence, dummy6_iter, km, name;
        actions = {toggle_bookmark:{"help": "", "icon": "", "key": "Alt-b", handler: toggle_bookmark}, next_bookmark:{"help": "", "icon": "", "key": "Shift-right", handler: next_bookmark}, prev_bookmark:{"help": "", "icon": "", "key": "Shift-left", handler: prev_bookmark}};
        km = Jupyter.keyboard_manager;
        dummy4_sequence = actions;
        for (name in dummy4_sequence) {
            if (!dummy4_sequence.hasOwnProperty(name)){ continue; }
            action = dummy4_sequence[name];
            km.actions.register(action, name, "scpy3");
            km.command_shortcuts.add_shortcut(action.key, "scpy3:" + name);
        }
        dummy5_sequence = nb.get_cells();
        if ((typeof dummy5_sequence === "object") && (!Array.isArray(dummy5_sequence))) {
            dummy5_sequence = Object.keys(dummy5_sequence);
        }
        for (dummy6_iter = 0; dummy6_iter < dummy5_sequence.length; dummy6_iter += 1) {
            cell = dummy5_sequence[dummy6_iter];
            if (_pyfunc_truthy(cell.metadata.scpy3_bookmark)) {
                cell.element.addClass("cell-bookmark");
            }
        }
        return null;
    }).bind(this);

    return {"load_ipython_extension": main};
};

define(imports, load);
})()