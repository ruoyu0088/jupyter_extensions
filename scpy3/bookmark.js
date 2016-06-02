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
var _pyfunc_int = function (x) { // nargs: 1
    return x<0 ? Math.ceil(x): Math.floor(x);
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
var N, imports, load;
imports = ["base/js/namespace", "base/js/events", "require"];
N = 3;
load = function (Jupyter, events, require) {
    var load_css, main, nb, next_bookmark, prev_bookmark, run_bookmark, search_bookmark, show_message, toggle_bookmark;
    load_css = (function (name) {
        var link;
        link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl(name);
        (document.getElementsByTagName("head")[0]).appendChild(link);
        return null;
    }).bind(this);

    show_message = (function (message, wait) {
        var notification_widget;
        notification_widget = Jupyter.notification_area.widget("notebook");
        notification_widget.set_message(message, wait);
        return null;
    }).bind(this);

    load_css("./bookmark.css");
    nb = Jupyter.notebook;
    toggle_bookmark = (function (mark_id) {
        var cell, i;
        cell = nb.get_selected_cell();
        for (i = 1; i < N + 1; i += 1) {
            if (_pyfunc_equals(i, mark_id)) {
                continue;
            }
            cell.element.removeClass("cell-bookmark-" + i + "");
        }
        cell.element.toggleClass("cell-bookmark-" + mark_id + "");
        if (_pyfunc_truthy(cell.element.hasClass("cell-bookmark-" + mark_id + ""))) {
            cell.metadata.scpy3_bookmark = mark_id;
        } else {
            delete cell.metadata.scpy3_bookmark;
        }
        return null;
    }).bind(this);

    run_bookmark = (function (mark_id) {
        var cell, cells, count, dummy1_sequence, dummy2_iter;
        cells = nb.get_cells();
        count = 0;
        dummy1_sequence = cells;
        if ((typeof dummy1_sequence === "object") && (!Array.isArray(dummy1_sequence))) {
            dummy1_sequence = Object.keys(dummy1_sequence);
        }
        for (dummy2_iter = 0; dummy2_iter < dummy1_sequence.length; dummy2_iter += 1) {
            cell = dummy1_sequence[dummy2_iter];
            if ((_pyfunc_equals(cell.cell_type, "code") && _pyfunc_equals(cell.metadata.scpy3_bookmark, mark_id))) {
                cell.execute();
                count=_pyfunc_add(count, 1)
            }
        }
        show_message("" + count + " cells executed", 2000);
        return null;
    }).bind(this);

    search_bookmark = (function (step) {
        var cell, cells, dummy3_else, dummy4_sequence, dummy5_iter, i, indexes, start;
        console.log("next_bookmark");
        cells = nb.get_cells();
        start = nb.get_selected_index();
        if (_pyfunc_truthy(step > 0)) {
            indexes = _pyfunc_add((_pyfunc_range((start + 1), cells.length, 1)), _pyfunc_range(0, start, 1));
        } else {
            indexes = _pyfunc_add((_pyfunc_range((start - 1), (-1), (-1))), (_pyfunc_range((cells.length - 1), start, (-1))));
        }
        dummy3_else = true;
        dummy4_sequence = indexes;
        if ((typeof dummy4_sequence === "object") && (!Array.isArray(dummy4_sequence))) {
            dummy4_sequence = Object.keys(dummy4_sequence);
        }
        for (dummy5_iter = 0; dummy5_iter < dummy4_sequence.length; dummy5_iter += 1) {
            i = dummy4_sequence[dummy5_iter];
            cell = cells[i];
            if (_pyfunc_truthy(cell.metadata.scpy3_bookmark)) {
                nb.select(i);
                nb.scroll_to_cell(i);
                dummy3_else = false; break;
            }
        } if (dummy3_else) {
            show_message("No bookmark", 2000);
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
        var action, actions, cell, dummy6_sequence, dummy7_sequence, dummy8_iter, km, name;
        actions = {toggle_bookmark_1:({"help": "", "icon": "", "key": "Shift-1", handler: (function () {return toggle_bookmark(1);}).bind(this)}), toggle_bookmark_2:({"help": "", "icon": "", "key": "Shift-2", handler: (function () {return toggle_bookmark(2);}).bind(this)}), toggle_bookmark_3:({"help": "", "icon": "", "key": "Shift-3", handler: (function () {return toggle_bookmark(3);}).bind(this)}), run_bookmark_1:({"help": "", "icon": "", "key": "Ctrl-Shift-1", handler: (function () {return run_bookmark(1);}).bind(this)}), run_bookmark_2:({"help": "", "icon": "", "key": "Ctrl-Shift-2", handler: (function () {return run_bookmark(2);}).bind(this)}), run_bookmark_3:({"help": "", "icon": "", "key": "Ctrl-Shift-3", handler: (function () {return run_bookmark(3);}).bind(this)}), next_bookmark:{"help": "", "icon": "", "key": "Shift-right", handler: next_bookmark}, prev_bookmark:{"help": "", "icon": "", "key": "Shift-left", handler: prev_bookmark}};
        km = Jupyter.keyboard_manager;
        dummy6_sequence = actions;
        for (name in dummy6_sequence) {
            if (!dummy6_sequence.hasOwnProperty(name)){ continue; }
            action = dummy6_sequence[name];
            km.actions.register(action, name, "scpy3");
            km.command_shortcuts.add_shortcut(action.key, "scpy3:" + name);
        }
        dummy7_sequence = nb.get_cells();
        if ((typeof dummy7_sequence === "object") && (!Array.isArray(dummy7_sequence))) {
            dummy7_sequence = Object.keys(dummy7_sequence);
        }
        for (dummy8_iter = 0; dummy8_iter < dummy7_sequence.length; dummy8_iter += 1) {
            cell = dummy7_sequence[dummy8_iter];
            if (_pyfunc_truthy(cell.metadata.scpy3_bookmark)) {
                cell.element.addClass("cell-bookmark-" + _pyfunc_int(cell.metadata.scpy3_bookmark) + "");
            }
        }
        return null;
    }).bind(this);

    return {"load_ipython_extension": main};
};

define(imports, load);
})()