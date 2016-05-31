(function(){
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
var _pymeth_extend = function (x) { // nargs: 1
    if (!Array.isArray(this)) return this.extend.apply(this, arguments);
    this.push.apply(this, x);   
};
var _pymeth_get = function (key, d) { // nargs: 1 2
    if (this.constructor !== Object) return this.get.apply(this, arguments);
    if (this[key] !== undefined) {return this[key];}
    else if (d !== undefined) {return d;}
    else {return null;}
};
var _pymeth_lstrip = function (chars) { // nargs: 0 1
    if (this.constructor !== String) return this.lstrip.apply(this, arguments);
    chars = (chars === undefined) ? ' \t\r\n' : chars;
    for (var i=0; i<this.length; i++) {
        if (chars.indexOf(this[i]) < 0) return this.slice(i);
    } return '';
};
var _pymeth_startswith = function (x) { // nargs: 1
    if (this.constructor !== String) return this.startswith.apply(this, arguments);
    return this.indexOf(x) == 0;
};
var imports, load;
imports = ["base/js/namespace", "services/config", "base/js/utils"];
load = function (Jupyter, configmod, utils) {
    var base_url, config, copy_config, get_level, main;
    get_level = (function (cell) {
        var level, text;
        if ((!_pyfunc_equals(cell.cell_type, "markdown"))) {
            return 1000;
        }
        text = cell.get_text();
        if (_pyfunc_truthy(_pymeth_startswith.call(text, "#"))) {
            level = text.length - (_pymeth_lstrip.call(text, "#").length);
            return level;
        }
        return 1000;
    }).bind(this);

    base_url = utils.get_body_data("baseUrl");
    config = new configmod.ConfigSection("scpy3_copycells", {"base_url": base_url});
    config.load();
    copy_config = new configmod.ConfigWithDefaults(config, {"cells": []});
    main = (function () {
        var action, actions, append_handler, copy_handler, dummy3_sequence, key, km, paste_handler, select_handler, show_mssage;
        show_mssage = (function (message) {
            var notification_widget;
            notification_widget = Jupyter.notification_area.widget("notebook");
            notification_widget.set_message(message, 2000);
            return null;
        }).bind(this);

        select_handler = (function (event) {
            var cell, current_level, nb;
            nb = Jupyter.notebook;
            cell = nb.get_selected_cell();
            current_level = get_level(cell);
            if (_pyfunc_truthy(current_level < 10)) {
                while (true) {
                    cell.select();
                    cell = nb.get_next_cell(cell);
                    if ((cell === null)) {
                        break;
                    }
                    if (_pyfunc_truthy(get_level(cell) <= current_level)) {
                        break;
                    }
                }
            }
            return null;
        }).bind(this);

        copy_handler = (function (event) {
            var cells, json, nb;
            nb = Jupyter.notebook;
            cells = nb.get_selected_cells();
            json = (function list_comprehenson () {var res = [];var cell, iter0, i0;iter0 = cells;if ((typeof iter0 === "object") && (!Array.isArray(iter0))) {iter0 = Object.keys(iter0);}for (i0=0; i0<iter0.length; i0++) {cell = iter0[i0];{res.push(cell.toJSON());}}return res;}).apply(this);
            copy_config.set("cells", json);
            show_mssage("" + json.length + " cells copied");
            return null;
        }).bind(this);

        paste_handler = (function (event) {
            var insert_cells, nb;
            nb = Jupyter.notebook;
            insert_cells = (function (cells_json) {
                var cell, cell_json, current_cell, dummy1_sequence, dummy2_iter, i;
                current_cell = nb.get_selected_cell();
                dummy1_sequence = cells_json;
                if ((typeof dummy1_sequence === "object") && (!Array.isArray(dummy1_sequence))) {
                    dummy1_sequence = Object.keys(dummy1_sequence);
                }
                for (dummy2_iter = 0; dummy2_iter < dummy1_sequence.length; dummy2_iter += 1) {
                    cell_json = dummy1_sequence[dummy2_iter];
                    cell = nb.insert_cell_below(cell_json.cell_type);
                    cell.fromJSON(cell_json);
                    cell.focus_cell();
                }
                for (i = 0; i < cells_json.length; i += 1) {
                    current_cell = nb.get_next_cell(current_cell);
                    current_cell.select();
                }
                return null;
            }).bind(this);

            _pymeth_get.call(copy_config, "cells").then(insert_cells);
            return null;
        }).bind(this);

        append_handler = (function (event) {
            var append_cells, nb;
            nb = Jupyter.notebook;
            append_cells = (function (cells_json) {
                var cells, json;
                cells = nb.get_selected_cells();
                json = (function list_comprehenson () {var res = [];var cell, iter0, i0;iter0 = cells;if ((typeof iter0 === "object") && (!Array.isArray(iter0))) {iter0 = Object.keys(iter0);}for (i0=0; i0<iter0.length; i0++) {cell = iter0[i0];{res.push(cell.toJSON());}}return res;}).apply(this);
                _pymeth_extend.call(cells_json, json);
                copy_config.set("cells", cells_json);
                show_mssage("" + json.length + " cells appended, total " + cells_json.length + " cells");
                return null;
            }).bind(this);

            _pymeth_get.call(copy_config, "cells").then(append_cells);
            return null;
        }).bind(this);

        actions = {select_section_cells:{"help": " selected section cells", "icon": "fa-recycle", "help_index": "", "key": "Alt-s", "handler": select_handler}, copy_cells:{"help": " copy selected  cells", "icon": "fa-recycle", "help_index": "", "key": "Alt-c", "handler": copy_handler}, paste_cells:{"help": " paste cells", "icon": "fa-recycle", "help_index": "", "key": "Alt-v", "handler": paste_handler}, append_cells:{"help": " append cells", "icon": "fa-recycle", "help_index": "", "key": "Alt-a", "handler": append_handler}};
        km = Jupyter.keyboard_manager;
        dummy3_sequence = actions;
        for (key in dummy3_sequence) {
            if (!dummy3_sequence.hasOwnProperty(key)){ continue; }
            action = dummy3_sequence[key];
            km.actions.register(action, key, "scpy3");
            km.command_shortcuts.add_shortcut(action.key, "scpy3:" + key);
        }
        return null;
    }).bind(this);

    return {"load_ipython_extension": main};
};

define(imports, load);
})()