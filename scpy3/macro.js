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
var _pymeth_get = function (key, d) { // nargs: 1 2
    if (this.constructor !== Object) return this.get.apply(this, arguments);
    if (this[key] !== undefined) {return this[key];}
    else if (d !== undefined) {return d;}
    else {return null;}
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
var default_macros, imports, load, macros_to_text, text_to_macros;
default_macros = {"1": "\u2776", "2": "\u2777", "3": "\u2778", "4": "\u2779", "5": "\u277a", "6": "\u277b", "7": "\u277c", "8": "\u277d", "9": "\u277e", "fig": "![](/files/images/.png \"\")", "next": "`ref:fig-next`", "prev": "`ref:fig-prev`", "tip": "> **TIP**\n\n> ", "source": "> **SOURCE**\n\n> ", "warning": "> **WARNING**\n\n> ", "question": "> **QUESTION**\n\n> ", "link": "> **LINK**\n\n> \n\n> "};
macros_to_text = function (macros) {
    return JSON.stringify(macros, null, 2);
};

text_to_macros = function (text) {
    return JSON.parse(text);
};

load = function (Jupyter, dialog, configmod, utils) {
    var base_url, config, key_handler, macros_config, main, on_ok, register_actions, show_macro_box;
    register_actions = (function (actions, target) {
        var action, dummy1_sequence, key, km;
        target = (target === undefined) ? "command": target;
        km = Jupyter.keyboard_manager;
        dummy1_sequence = actions;
        for (key in dummy1_sequence) {
            if (!dummy1_sequence.hasOwnProperty(key)){ continue; }
            action = dummy1_sequence[key];
            key = _pymeth_replace.call(key, "_", "-");
            km.actions.register(action, key, "scpy3");
            km[target + "_shortcuts"].add_shortcut(action.key, "scpy3:" + key);
        }
        return null;
    }).bind(this);

    base_url = utils.get_body_data("baseUrl");
    config = new configmod.ConfigSection("scpy3_macros", {"base_url": base_url});
    config.load();
    macros_config = new configmod.ConfigWithDefaults(config, {"macros": default_macros});
    on_ok = (function (text) {
        var macros;
        macros = text_to_macros(text);
        macros_config.set("macros", macros);
        return null;
    }).bind(this);

    show_macro_box = (function (macros) {
        var css_textarea, el_br, el_dialog, el_info, el_textarea, info, on_click, on_open, settings, title;
        title = "Define Macros";
        info = "Define Macros";
        el_dialog = jQuery("<div/>");
        el_info = jQuery("<p/>").text(info);
        el_br = jQuery("<br/>");
        css_textarea = {"font-size": "12px", "width": "90%", "font-family": "monospace"};
        el_textarea = ((jQuery("<textarea/>").css(css_textarea)).attr("rows", "10")).val(macros_to_text(macros));
        _pymeth_append.call(el_dialog, el_info);
        _pymeth_append.call(el_dialog, el_br);
        _pymeth_append.call(el_dialog, el_textarea);
        on_click = (function () {
            var text;
            text = el_textarea.val();
            on_ok(text);
            return null;
        }).bind(this);

        on_open = (function () {
            el_textarea.focus();
            return null;
        }).bind(this);

        settings = {"keyboard_manager": Jupyter.notebook.keyboard_manager, "title": title, "body": el_dialog, "buttons": {"ok": {"class": "btn-primary", "click": on_click}}, "open": on_open};
        dialog.modal(settings);
        return null;
    }).bind(this);

    key_handler = (function (event) {
        var cm, cursor, index, line, process;
        cm = Jupyter.notebook.get_selected_cell().code_mirror;
        cursor = cm.getCursor();
        line = cm.getLine(cursor.line);
        index = cursor.ch - 1;
        process = (function (macros) {
            var cmd, index, info;
            index = cursor.ch - 1;
            while (index >= 0) {
                if (_pyfunc_equals(line[index], "$")) {
                    cmd = line.slice(index + 1,cursor.ch);
                    info = {"line": cursor.line, "ch": index};
                    if (_pyfunc_equals(cmd, "")) {
                        show_macro_box(macros);
                    } else if (_pyfunc_truthy(_pyfunc_contains(cmd, macros))) {
                        cm.replaceRange(macros[cmd], info, cursor);
                    }
                    return null;
                }
                index -= 1;
            }
            index = cursor.ch - 1;
            while (index >= 0) {
                cmd = line.slice(index,cursor.ch);
                if (_pyfunc_truthy(_pyfunc_contains(cmd, macros))) {
                    info = {"line": cursor.line, "ch": index};
                    cm.replaceRange(macros[cmd], info, cursor);
                    return null;
                }
                index -= 1;
            }
            return null;
        }).bind(this);

        _pymeth_get.call(macros_config, "macros").then(process);
        return true;
    }).bind(this);

    main = (function () {
        var actions;
        actions = {expand_macro:({"help": "expand macro", "key": "Alt-m", "handler": (function (event) {return key_handler(Jupyter, event);}).bind(this)})};
        register_actions(actions, "edit");
        return null;
    }).bind(this);

    return {"load_ipython_extension": main};
};

imports = ["base/js/namespace", "base/js/dialog", "services/config", "base/js/utils"];
define(imports, load);
})()