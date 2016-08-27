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
    else if (v.constructor !== Object) {return true;}
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
var _pymeth_replace = function (s1, s2, count) {  // nargs: 2 3
    if (this.constructor !== String) return this.replace.apply(this, arguments);
    var i = 0, i2, parts = [];
    count = (count === undefined) ? 1e20 : count;
    while (count > 0) {
        i2 = this.indexOf(s1, i);
        if (i2 >= 0) {
            parts.push(this.slice(i, i2));
            parts.push(s2);
            i = i2 + s1.length;
            count -= 1;
        } else break;
    }
    parts.push(this.slice(i));
    return parts.join('');
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
    var T, base_url, config, copy_config, get_level, main, register_actions, show_message, typeahead_form;
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
        if (_pymeth_startswith.call(text, "#")) {
            level = text.length - (_pymeth_lstrip.call(text, "#").length);
            return level;
        }
        return 1000;
    }).bind(this);

    register_actions = (function (actions, target) {
        var action, key, km, stub1_seq;
        target = (target === undefined) ? "command": target;
        km = Jupyter.keyboard_manager;
        stub1_seq = actions;
        for (key in stub1_seq) {
            if (!stub1_seq.hasOwnProperty(key)){ continue; }
            action = stub1_seq[key];
            key = _pymeth_replace.call(key, "_", "-");
            km.actions.register(action, key, "scpy3");
            km[target + "_shortcuts"].add_shortcut(action.key, "scpy3:" + key);
        }
        return null;
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
        var args, child, el, klass, stub2_, stub3_seq, stub4_itr;
        args = Array.prototype.slice.call(arguments).slice(1);
        klass = null;
        if (_pyfunc_contains(".", tagname)) {
            stub2_ = _pymeth_split.call(tagname, ".");
            tagname = stub2_[0];klass = stub2_[1];
        }
        el = jQuery("<" + tagname + "/>");
        if ((klass !== null)) {
            el.addClass(klass);
        }
        stub3_seq = args;
        if ((typeof stub3_seq === "object") && (!Array.isArray(stub3_seq))) {
            stub3_seq = Object.keys(stub3_seq);
        }
        for (stub4_itr = 0; stub4_itr < stub3_seq.length; stub4_itr += 1) {
            child = stub3_seq[stub4_itr];
            _pymeth_append.call(el, child);
        }
        return el;
    }).bind(this);

    base_url = utils.get_body_data("baseUrl");
    config = new configmod.ConfigSection("scpy3_copycells", {"base_url": base_url});
    config.load();
    copy_config = new configmod.ConfigWithDefaults(config, {"cells": []});
    main = (function () {
        var actions, append_cells, copy_cells, paste_cells, paste_selected_cell, select_section_cells;
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
                var cell, cell_json, current_cell, i, stub5_seq, stub6_itr;
                current_cell = nb.get_selected_cell();
                stub5_seq = cells_json;
                if ((typeof stub5_seq === "object") && (!Array.isArray(stub5_seq))) {
                    stub5_seq = Object.keys(stub5_seq);
                }
                for (stub6_itr = 0; stub6_itr < stub5_seq.length; stub6_itr += 1) {
                    cell_json = stub5_seq[stub6_itr];
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
            var input_, mod, on_submit, show_clipboard, stub7_;
            stub7_ = typeahead_form();
            mod = stub7_[0];input_ = stub7_[1];
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
                var cell, src, stub8_seq, stub9_itr;
                src = {"Clipboard": {"data": [], "display": "display"}};
                stub8_seq = cells;
                if ((typeof stub8_seq === "object") && (!Array.isArray(stub8_seq))) {
                    stub8_seq = Object.keys(stub8_seq);
                }
                for (stub9_itr = 0; stub9_itr < stub8_seq.length; stub9_itr += 1) {
                    cell = stub8_seq[stub9_itr];
                    _pymeth_append.call(src.Clipboard.data, {"display": cell.source.slice(0,80), "cell": cell, "group": "Clipboard"});
                }
                input_.typeahead({"emptyTemplate": "Clipboard is empty", "maxItem": 100, "group": ["group", "{{group}}"], "minLength": 0, "searchOnFocus": true, "hint": true, "mustSelectItem": true, "template": "<pre style=\"background-color:transparent;border:none;\">{{display}} ...</pre>", "source": src, "callback": {"onSubmit": on_submit, "onClickAfter": on_submit}});
                mod.modal("show");
                return null;
            }).bind(this);

            _pymeth_get.call(copy_config, "cells").then(show_clipboard);
            return null;
        }).bind(this);

        actions = {select_all_cells_in_current_section:{"help": "select all cells in current section", "icon": "fa-header", "key": "Alt-s", "handler": select_section_cells}, copy_selected_cells_to_clipboard:{"help": "copy selected cells to clipboard", "icon": "fa-files-o", "key": "Alt-c", "handler": copy_cells}, paste_cells_from_clipboard:{"help": "paste cells from clipboard", "icon": "fa-clipboard", "key": "Alt-v", "handler": paste_cells}, paste_selected_cell_from_clipboard:{"help": "paste selected cell from clipboard", "key": "Alt-Shift-v", "handler": paste_selected_cell}, append_selected_cells_to_clipboard:{"help": "append selected cells to clipboard", "icon": "fa-plus-square", "key": "Alt-a", "handler": append_cells}};
        register_actions(actions);
        return null;
    }).bind(this);

    return {"load_ipython_extension": main};
};

define(imports, load);
})()