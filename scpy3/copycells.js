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
var _pymeth_append = function (x) { // nargs: 1
    if (!Array.isArray(this)) return this.append.apply(this, arguments);
    this.push(x);
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
var _pymeth_split = function (sep, count) { // nargs: 0, 1 2
    if (this.constructor !== String) return this.split.apply(this, arguments);
    if (sep === '') {var e = Error('empty sep'); e.name='ValueError'; throw e;}
    sep = (sep === undefined) ? /\s/ : sep;
    count = Math.max(0, (count === undefined) ? 1e20 : count);
    var parts = this.split(sep);
    var limit = Math.max(0, count);
    var res = parts.slice(0, limit);
    if (count < parts.length) res.push(parts.slice(limit).join(sep));
    return res;
};
var _pymeth_startswith = function (x) { // nargs: 1
    if (this.constructor !== String) return this.startswith.apply(this, arguments);
    return this.indexOf(x) == 0;
};
var imports, load;
imports = ["base/js/namespace", "services/config", "base/js/utils"];
load = function (Jupyter, configmod, utils) {
    var T, base_url, config, copy_config, get_level, main, show_message, typeahead_form;
    show_message = (function (message, wait) {
        var notification_widget;
        notification_widget = Jupyter.notification_area.widget("notebook");
        notification_widget.set_message(message, wait);
        return null;
    }).bind(this);

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

    typeahead_form = (function () {
        var before_close, container, field, form, input_, mod, nb, on_show, search_button;
        nb = Jupyter.notebook;
        form = new T("form");
        container = new T("div.typeahead-container");
        field = new T("div.typeahead-field");
        input_ = (new T("input")).attr("type", "search");
        search_button = (new T("button", new T("span.typeahead-search-icon"))).attr("type", "submit");
        _pymeth_append.call(field, (new T("span.typeahead-query", input_)));
        _pymeth_append.call(field, (new T("span.typeahead-button", search_button)));
        _pymeth_append.call(container, field);
        _pymeth_append.call(form, container);
        mod = new T("div.modal cmd-palette", new T("div.modal-dialog", new T("div.modal-content", new T("div.modal-body", form))));
        mod.modal({"show": false, "backdrop": true});
        on_show = (function () {
            var focus;
            focus = (function () {
                input_.focus();
                return null;
            }).bind(this);

            setTimeout(focus, 100);
            return null;
        }).bind(this);

        mod.on("show.bs.modal", on_show);
        nb.keyboard_manager.disable();
        before_close = (function () {
            var cell;
            if (_pyfunc_truthy(before_close.ok)) {
                return null;
            }
            cell = nb.get_selected_cell();
            if (_pyfunc_truthy(cell)) {
                cell.select();
            }
            if (_pyfunc_truthy(nb.keyboard_manager)) {
                nb.keyboard_manager.enable();
                nb.keyboard_manager.command_mode();
            }
            before_close.ok = true;
            return null;
        }).bind(this);

        mod.on("hide.bs.modal", before_close);
        return [mod, input_];
    }).bind(this);

    T = (function (tagname) {
        var args, child, dummy1_, dummy2_sequence, dummy3_iter, el, klass;
        args = Array.prototype.slice.call(arguments).slice(1);
        klass = null;
        if (_pyfunc_truthy(_pyfunc_contains(".", tagname))) {
            dummy1_ = _pymeth_split.call(tagname, ".");
            tagname = dummy1_[0];klass = dummy1_[1];
        }
        el = jQuery("<" + tagname + "/>");
        if ((klass !== null)) {
            el.addClass(klass);
        }
        dummy2_sequence = args;
        if ((typeof dummy2_sequence === "object") && (!Array.isArray(dummy2_sequence))) {
            dummy2_sequence = Object.keys(dummy2_sequence);
        }
        for (dummy3_iter = 0; dummy3_iter < dummy2_sequence.length; dummy3_iter += 1) {
            child = dummy2_sequence[dummy3_iter];
            _pymeth_append.call(el, child);
        }
        return el;
    }).bind(this);

    base_url = utils.get_body_data("baseUrl");
    config = new configmod.ConfigSection("scpy3_copycells", {"base_url": base_url});
    config.load();
    copy_config = new configmod.ConfigWithDefaults(config, {"cells": []});
    main = (function () {
        var action, actions, append_cells, copy_cells, dummy9_sequence, key, km, paste_cells, paste_selected_cell, select_section_cells;
        select_section_cells = (function (event) {
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

        copy_cells = (function (event) {
            var cells, json, nb;
            nb = Jupyter.notebook;
            cells = nb.get_selected_cells();
            json = (function list_comprehenson () {var res = [];var cell, iter0, i0;iter0 = cells;if ((typeof iter0 === "object") && (!Array.isArray(iter0))) {iter0 = Object.keys(iter0);}for (i0=0; i0<iter0.length; i0++) {cell = iter0[i0];{res.push(cell.toJSON());}}return res;}).apply(this);
            copy_config.set("cells", json);
            show_message("" + json.length + " cells copied", 2000);
            return null;
        }).bind(this);

        paste_cells = (function (event) {
            var insert_cells, nb;
            nb = Jupyter.notebook;
            insert_cells = (function (cells_json) {
                var cell, cell_json, current_cell, dummy4_sequence, dummy5_iter, i;
                current_cell = nb.get_selected_cell();
                dummy4_sequence = cells_json;
                if ((typeof dummy4_sequence === "object") && (!Array.isArray(dummy4_sequence))) {
                    dummy4_sequence = Object.keys(dummy4_sequence);
                }
                for (dummy5_iter = 0; dummy5_iter < dummy4_sequence.length; dummy5_iter += 1) {
                    cell_json = dummy4_sequence[dummy5_iter];
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

        append_cells = (function (event) {
            var append_cells, nb;
            nb = Jupyter.notebook;
            append_cells = (function (cells_json) {
                var cells, json;
                cells = nb.get_selected_cells();
                json = (function list_comprehenson () {var res = [];var cell, iter0, i0;iter0 = cells;if ((typeof iter0 === "object") && (!Array.isArray(iter0))) {iter0 = Object.keys(iter0);}for (i0=0; i0<iter0.length; i0++) {cell = iter0[i0];{res.push(cell.toJSON());}}return res;}).apply(this);
                _pymeth_extend.call(cells_json, json);
                copy_config.set("cells", cells_json);
                show_message("" + json.length + " cells appended, total " + cells_json.length + " cells", 2000);
                return null;
            }).bind(this);

            _pymeth_get.call(copy_config, "cells").then(append_cells);
            return null;
        }).bind(this);

        paste_selected_cell = (function (event) {
            var dummy6_, input_, mod, on_submit, show_clipboard;
            dummy6_ = typeahead_form();
            mod = dummy6_[0];input_ = dummy6_[1];
            input_.attr("id", "scpy3-paste-typeahead");
            on_submit = (function (node, query, result, result_count) {
                var cell;
                console.log(node, query, result, result_count);
                mod.modal("hide");
                cell = Jupyter.notebook.insert_cell_below(result.cell.cell_type);
                cell.fromJSON(result.cell);
                cell.focus_cell();
                return null;
            }).bind(this);

            show_clipboard = (function (cells) {
                var cell, dummy7_sequence, dummy8_iter, src;
                src = {"Clipboard": {"data": [], "display": "display"}};
                dummy7_sequence = cells;
                if ((typeof dummy7_sequence === "object") && (!Array.isArray(dummy7_sequence))) {
                    dummy7_sequence = Object.keys(dummy7_sequence);
                }
                for (dummy8_iter = 0; dummy8_iter < dummy7_sequence.length; dummy8_iter += 1) {
                    cell = dummy7_sequence[dummy8_iter];
                    _pymeth_append.call(src.Clipboard.data, {"display": cell.source.slice(0,80), "cell": cell, "group": "Clipboard"});
                }
                input_.typeahead({"emptyTemplate": "Clipboard is empty", "maxItem": 100, "group": ["group", "{{group}}"], "minLength": 0, "searchOnFocus": true, "hint": true, "mustSelectItem": true, "template": "<pre style=\"background-color:transparent;border:none;\">{{display}} ...</pre>", "source": src, "callback": {"onSubmit": on_submit, "onClickAfter": on_submit}});
                mod.modal("show");
                return null;
            }).bind(this);

            _pymeth_get.call(copy_config, "cells").then(show_clipboard);
            return null;
        }).bind(this);

        actions = {select_section_cells:{"help": " selected section cells", "icon": "fa-recycle", "help_index": "", "key": "Alt-s", "handler": select_section_cells}, copy_cells:{"help": " copy selected  cells", "icon": "fa-recycle", "help_index": "", "key": "Alt-c", "handler": copy_cells}, paste_cells:{"help": " paste cells", "icon": "fa-recycle", "help_index": "", "key": "Alt-v", "handler": paste_cells}, paste_selected_cell:{"key": "Alt-Shift-v", "handler": paste_selected_cell}, append_cells:{"help": " append cells", "icon": "fa-recycle", "help_index": "", "key": "Alt-a", "handler": append_cells}};
        km = Jupyter.keyboard_manager;
        dummy9_sequence = actions;
        for (key in dummy9_sequence) {
            if (!dummy9_sequence.hasOwnProperty(key)){ continue; }
            action = dummy9_sequence[key];
            km.actions.register(action, key, "scpy3");
            km.command_shortcuts.add_shortcut(action.key, "scpy3:" + key);
        }
        return null;
    }).bind(this);

    return {"load_ipython_extension": main};
};

define(imports, load);
})()