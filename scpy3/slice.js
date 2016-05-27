(function(){
var _pyfunc_add = function (a, b) { // nargs: 2
    if (Array.isArray(a) && Array.isArray(b)) {
        return a.concat(b);
    } return a + b;
};
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
var _pymeth_endswith = function (x) { // nargs: 1
    if (this.constructor !== String) return this.endswith.apply(this, arguments);
    return this.lastIndexOf(x) == this.length - x.length;
};
var _pymeth_get = function (key, d) { // nargs: 1 2
    if (this.constructor !== Object) return this.get.apply(this, arguments);
    if (this[key] !== undefined) {return this[key];}
    else if (d !== undefined) {return d;}
    else {return null;}
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
var _pymeth_strip = function (chars) { // nargs: 0 1
    if (this.constructor !== String) return this.strip.apply(this, arguments);
    chars = (chars === undefined) ? ' \t\r\n' : chars;
    var i, s1 = this, s2 = '', s3 = '';
    for (i=0; i<s1.length; i++) {
        if (chars.indexOf(s1[i]) < 0) {s2 = s1.slice(i); break;}
    } for (i=s2.length-1; i>=0; i--) {
        if (chars.indexOf(s2[i]) < 0) {s3 = s2.slice(0, i+1); break;}
    } return s3;
};
var T, dummy_slices, imports, load;
imports = ["base/js/namespace", "base/js/dialog", "services/config", "base/js/utils"];
dummy_slices = function (n) {
    var i, item, slices;
    slices = [];
    for (i = 0; i < n; i += 1) {
        item = {"name": "name " + i + "", "group": "group " + (i % 10) + "", "code": "print(" + i + ")\nprint(" + i + " + 1)"};
        _pymeth_append.call(slices, item);
    }
    return slices;
};

T = function (tagname) {
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
};

load = function (Jupyter, dialog, configmod, utils) {
    var config, main, show_dialog, slice_config;
    config = new configmod.ConfigSection("scpy3_slices", {base_url: utils.get_body_data("baseUrl")});
    config.load();
    slice_config = new configmod.ConfigWithDefaults(config, {"slices": {}});
    show_dialog = (function (title, body, open_callback, buttons) {
        var button, buttons_setting, callback, dialog_settings, dummy4_sequence, dummy5_iter, dummy6_target;
        open_callback = (open_callback === undefined) ? null: open_callback;
        buttons = (buttons === undefined) ? null: buttons;
        dialog_settings = {"notebook": Jupyter.notebook, "keyboard_manager": Jupyter.keyboard_manager, "title": title, "body": body};
        if ((open_callback !== null)) {
            dialog_settings["open"] = open_callback;
        }
        if ((buttons !== null)) {
            buttons_setting = {};
            dummy4_sequence = buttons;
            if ((typeof dummy4_sequence === "object") && (!Array.isArray(dummy4_sequence))) {
                dummy4_sequence = Object.keys(dummy4_sequence);
            }
            for (dummy5_iter = 0; dummy5_iter < dummy4_sequence.length; dummy5_iter += 1) {
                dummy6_target = dummy4_sequence[dummy5_iter];
                button = dummy6_target[0]; callback = dummy6_target[1];
                buttons_setting[button] = {"class": "btn-primary", "click": callback};
            }
            dialog_settings["buttons"] = buttons_setting;
        }
        dialog.modal(dialog_settings);
        return null;
    }).bind(this);

    main = (function () {
        var action, actions, dummy9_sequence, km, load_slice, name, save_cell_as_slice;
        km = Jupyter.keyboard_manager;
        save_cell_as_slice = (function () {
            var cell, code, el_body, el_code, el_name, nb, on_ok, on_open;
            nb = Jupyter.notebook;
            cell = nb.get_selected_cell();
            code = cell.get_text();
            on_open = (function () {
                el_name.focus();
                return null;
            }).bind(this);

            on_ok = (function () {
                var add_slice, code, dummy7_, group, name, text;
                text = el_name.val();
                if (_pyfunc_truthy(_pyfunc_contains(":", text))) {
                    dummy7_ = _pymeth_split.call(text, ":");
                    group = dummy7_[0];name = dummy7_[1];
                } else {
                    group = "default";
                    name = text;
                }
                group = _pymeth_strip.call(group);
                name = _pymeth_strip.call(name);
                code = el_code.text();
                add_slice = (function (slices) {
                    slices[_pyfunc_add((group + ":"), name)] = {"name": name, "group": group, "code": code};
                    slice_config.set("slices", slices);
                    return null;
                }).bind(this);

                _pymeth_get.call(slice_config, "slices").then(add_slice);
                return null;
            }).bind(this);

            el_name = T("input");
            el_code = T("pre").text(code);
            el_body = T("div", el_name, jQuery("<br/>"), el_code);
            show_dialog("Save as Slice", el_body, on_open, [["Ok", on_ok]]);
            return null;
        }).bind(this);

        load_slice = (function () {
            var before_close, container, field, form, input_, mod, nb, on_mouse_enter, on_mouse_leave, on_navigate_after, on_result, on_show, on_submit, search_button, show_search;
            nb = Jupyter.notebook;
            form = T("form");
            container = T("div.typeahead-container");
            field = T("div.typeahead-field");
            input_ = T("input").attr("type", "search");
            search_button = (T("button", T("span.typeahead-search-icon"))).attr("type", "submit");
            _pymeth_append.call(field, T("span.typeahead-query", input_));
            _pymeth_append.call(field, T("span.typeahead-button", search_button));
            _pymeth_append.call(container, field);
            _pymeth_append.call(form, container);
            mod = T("div.modal cmd-palette", T("div.modal-dialog", T("div.modal-content", T("div.modal-body", form))));
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
                console.log("before_close");
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
            on_submit = (function (node, query, result, result_count) {
                var cell, code;
                mod.modal("hide");
                cell = nb.get_selected_cell();
                if ((!_pyfunc_equals(cell.cell_type, "code"))) {
                    cell = nb.insert_cell_below("code");
                }
                code = cell.get_text();
                if ((!_pyfunc_truthy(_pymeth_endswith.call(code, "\n")))) {
                    code=_pyfunc_add(code, "\n")
                }
                cell.set_text(_pyfunc_add(code, result.code));
                cell.select();
                return null;
            }).bind(this);

            on_result = (function (node, query, result, result_count) {
                return null;
            }).bind(this);

            on_mouse_enter = (function (node, a, item, event) {
                var pre;
                pre = jQuery("pre", a);
                pre.text(item.code);
                return null;
            }).bind(this);

            on_mouse_leave = (function (node, a, item, event) {
                var pre;
                pre = jQuery("pre", a);
                pre.text(item.firstline);
                return null;
            }).bind(this);

            on_navigate_after = (function (node, lis, a, item, query, event) {
                console.log(node, lis, a, item, query, event);
                return null;
            }).bind(this);

            show_search = (function (slices) {
                var dummy8_sequence, group, item, src;
                src = {};
                dummy8_sequence = slices;
                for (item in dummy8_sequence) {
                    if (!dummy8_sequence.hasOwnProperty(item)){ continue; }
                    item = dummy8_sequence[item];
                    group = item["group"];
                    if (_pyfunc_truthy(!_pyfunc_contains(group, src))) {
                        src[group] = {"data": [], "display": "display"};
                    }
                    _pymeth_append.call((src[group]["data"]), {"display": item.name, "group": item.group, "code": item.code, "firstline": _pymeth_split.call(item.code, "\n")[0]});
                }
                input_.typeahead({"emptyTemplate": "No result", "maxItem": 1000, "minLength": 0, "hint": true, "group": ["group", "{{group}}"], "searchOnFocus": true, "mustSelectItem": true, "template": "{{display}}<br/><pre>{{firstline}}</pre>", "order": "asc", "source": src, "callback": {"onSubmit": on_submit, "onClickAfter": on_submit, "onResult": on_result, "onMouseEnter": on_mouse_enter, "onMouseLeave": on_mouse_leave, "onNavigateAfter": on_navigate_after}, "debug": true});
                mod.modal("show");
                return null;
            }).bind(this);

            _pymeth_get.call(slice_config, "slices").then(show_search);
            return null;
        }).bind(this);

        actions = {save_cell_as_slice:{"help": "", "icon": "", "key": "Alt-i", handler: save_cell_as_slice}, load_slice:{"help": "", "icon": "", "key": "Alt-l", handler: load_slice}};
        dummy9_sequence = actions;
        for (name in dummy9_sequence) {
            if (!dummy9_sequence.hasOwnProperty(name)){ continue; }
            action = dummy9_sequence[name];
            km.actions.register(action, name, "scpy3");
            km.command_shortcuts.add_shortcut(action.key, "scpy3:" + name);
        }
        return null;
    }).bind(this);

    return {"load_ipython_extension": main};
};

define(imports, load);
})()