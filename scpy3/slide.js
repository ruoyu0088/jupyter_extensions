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
var Speeds, Themes, Transitions, imports, load, revealjs;
imports = ["base/js/namespace", "base/js/dialog", "services/config", "base/js/utils", "components/marked/lib/marked", "require"];
revealjs = ["./reveal.js/lib/js/head.min.js", "./reveal.js/js/reveal.js"];
Themes = ["default", "beige", "blood", "night", "serif", "simple", "sky", "solarized"];
Transitions = ["none", "fade", "slide", "convex", "concave", "zoom"];
Speeds = ["default", "slow", "fast"];
load = function (Jupyter, dialog, configmod, utils, marked, require) {
    var T, config_dialog, end_slide, get_level, get_metadata, get_option, header_flag, is_new_section, is_new_subsection, load_css, main, make_selector, register_actions, revealjs_loaded, set_metadata, show_dialog, start_slide, unload_css;
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

    unload_css = (function (names) {
        var dummy4_sequence, dummy5_iter, dummy6_sequence, dummy7_iter, dummy8_sequence, dummy9_iter, el, href, name, to_remove;
        if ((({}).toString.call(names).match(/\s([a-zA-Z]+)/)[1].toLowerCase() === 'string')) {
            names = [names];
        }
        to_remove = [];
        dummy6_sequence = jQuery("link").toArray();
        if ((typeof dummy6_sequence === "object") && (!Array.isArray(dummy6_sequence))) {
            dummy6_sequence = Object.keys(dummy6_sequence);
        }
        for (dummy7_iter = 0; dummy7_iter < dummy6_sequence.length; dummy7_iter += 1) {
            el = dummy6_sequence[dummy7_iter];
            href = el.getAttribute("href");
            dummy4_sequence = names;
            if ((typeof dummy4_sequence === "object") && (!Array.isArray(dummy4_sequence))) {
                dummy4_sequence = Object.keys(dummy4_sequence);
            }
            for (dummy5_iter = 0; dummy5_iter < dummy4_sequence.length; dummy5_iter += 1) {
                name = dummy4_sequence[dummy5_iter];
                if (((_pyfunc_truthy(_pyfunc_contains("scpy3", href))) && (_pyfunc_truthy(_pyfunc_contains(name, href))))) {
                    _pymeth_append.call(to_remove, el);
                    break;
                }
            }
        }
        dummy8_sequence = to_remove;
        if ((typeof dummy8_sequence === "object") && (!Array.isArray(dummy8_sequence))) {
            dummy8_sequence = Object.keys(dummy8_sequence);
        }
        for (dummy9_iter = 0; dummy9_iter < dummy8_sequence.length; dummy9_iter += 1) {
            el = dummy8_sequence[dummy9_iter];
            el.parentNode.removeChild(el);
        }
        return null;
    }).bind(this);

    set_metadata = (function (target, key, value) {
        var meta;
        meta = target.metadata;
        if (_pyfunc_truthy(!_pyfunc_contains("scpy3", meta))) {
            meta.scpy3 = {};
        }
        meta.scpy3[key] = value;
        return null;
    }).bind(this);

    show_dialog = (function (title, body, open_callback, buttons) {
        var button, buttons_setting, callback, dialog_settings, dummy10_sequence, dummy11_iter, dummy12_target;
        open_callback = (open_callback === undefined) ? null: open_callback;
        buttons = (buttons === undefined) ? null: buttons;
        dialog_settings = {"notebook": Jupyter.notebook, "keyboard_manager": Jupyter.keyboard_manager, "title": title, "body": body};
        if ((open_callback !== null)) {
            dialog_settings["open"] = open_callback;
        }
        if ((buttons !== null)) {
            buttons_setting = {};
            dummy10_sequence = buttons;
            if ((typeof dummy10_sequence === "object") && (!Array.isArray(dummy10_sequence))) {
                dummy10_sequence = Object.keys(dummy10_sequence);
            }
            for (dummy11_iter = 0; dummy11_iter < dummy10_sequence.length; dummy11_iter += 1) {
                dummy12_target = dummy10_sequence[dummy11_iter];
                button = dummy12_target[0]; callback = dummy12_target[1];
                buttons_setting[button] = {"class": "btn-primary", "click": callback};
            }
            dialog_settings["buttons"] = buttons_setting;
        }
        dialog.modal(dialog_settings);
        return null;
    }).bind(this);

    get_metadata = (function (target, key) {
        var meta;
        meta = target.metadata;
        if (_pyfunc_truthy(!_pyfunc_contains("scpy3", meta))) {
            return null;
        }
        if (_pyfunc_truthy(!_pyfunc_contains(key, meta.scpy3))) {
            return null;
        }
        return meta.scpy3[key];
    }).bind(this);

    make_selector = (function (label, options) {
        var dummy13_sequence, dummy14_iter, el, item;
        el = jQuery("<select/>");
        el.addClass("form-control");
        _pymeth_append.call(el, jQuery("<optgroup label = \"" + label + ":\">"));
        dummy13_sequence = options;
        if ((typeof dummy13_sequence === "object") && (!Array.isArray(dummy13_sequence))) {
            dummy13_sequence = Object.keys(dummy13_sequence);
        }
        for (dummy14_iter = 0; dummy14_iter < dummy13_sequence.length; dummy14_iter += 1) {
            item = dummy13_sequence[dummy14_iter];
            _pymeth_append.call(el, ((jQuery("<option/>").attr("value", item)).text(item)));
        }
        return el;
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

    load_css = (function (name) {
        var link;
        link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl(name);
        (document.getElementsByTagName("head")[0]).appendChild(link);
        return null;
    }).bind(this);

    register_actions = (function (actions, target) {
        var action, dummy15_sequence, key, km;
        target = (target === undefined) ? "command": target;
        km = Jupyter.keyboard_manager;
        dummy15_sequence = actions;
        for (key in dummy15_sequence) {
            if (!dummy15_sequence.hasOwnProperty(key)){ continue; }
            action = dummy15_sequence[key];
            key = _pymeth_replace.call(key, "_", "-");
            km.actions.register(action, key, "scpy3");
            km[target + "_shortcuts"].add_shortcut(action.key, "scpy3:" + key);
        }
        return null;
    }).bind(this);

    require((function list_comprehenson () {var res = [];var url, iter0, i0;iter0 = revealjs;if ((typeof iter0 === "object") && (!Array.isArray(iter0))) {iter0 = Object.keys(iter0);}for (i0=0; i0<iter0.length; i0++) {url = iter0[i0];{res.push(require.toUrl(url));}}return res;}).apply(this), revealjs_loaded);
    header_flag = null;
    get_option = (function (name) {
        var options;
        options = get_metadata(Jupyter.notebook, "slide");
        if ((options === null)) {
            options = {};
        }
        if (_pyfunc_truthy(!_pyfunc_contains("theme", options))) {
            options["theme"] = "default";
        }
        if (_pyfunc_truthy(!_pyfunc_contains("transition", options))) {
            options["transition"] = "slide";
        }
        if (_pyfunc_truthy(!_pyfunc_contains("speed", options))) {
            options["speed"] = "default";
        }
        return options[name];
    }).bind(this);

    config_dialog = (function () {
        var dlg_body, el_speed, el_theme, el_transition, on_ok;
        dlg_body = T("div");
        el_theme = make_selector("Theme", Themes).appendTo(jQuery("<p>Theme:</p>").appendTo(dlg_body));
        el_transition = make_selector("Transition", Transitions).appendTo(jQuery("<p>Transition:</p>").appendTo(dlg_body));
        el_speed = make_selector("Speed", Speeds).appendTo(jQuery("<p>Speed:</p>").appendTo(dlg_body));
        el_theme.val(get_option("theme"));
        el_transition.val(get_option("transition"));
        el_speed.val(get_option("speed"));
        on_ok = (function () {
            var metadata, nb;
            nb = Jupyter.notebook;
            metadata = get_metadata(nb, "slide");
            if ((metadata === null)) {
                metadata = {};
            }
            metadata["theme"] = el_theme.val();
            metadata["transition"] = el_transition.val();
            metadata["speed"] = el_speed.val();
            set_metadata(nb, "slide", metadata);
            return null;
        }).bind(this);

        show_dialog("Reveal.js configuration", dlg_body, null, [["Ok", on_ok]]);
        return null;
    }).bind(this);

    revealjs_loaded = (function () {
        console.log("revealjs loaded");
        return null;
    }).bind(this);

    is_new_section = (function (cell) {
        return get_level(cell) <= 2;
    }).bind(this);

    is_new_subsection = (function (cell) {
        if (_pyfunc_equals(cell.cell_type, "code")) {
            if (_pyfunc_truthy(_pymeth_startswith.call(cell.get_text(), "#%slide"))) {
                return true;
            }
        }
        return get_level(cell) <= 6;
    }).bind(this);

    end_slide = (function () {
        var nb;
        nb = Jupyter.notebook;
        nb.keyboard_manager.enable();
        unload_css("reveal.js/css/reveal.css");
        unload_css("reveal.js/css/theme/" + get_option("theme") + ".css");
        unload_css("slide.css");
        jQuery(".reveal").remove();
        if (_pyfunc_truthy(header_flag)) {
            jQuery("#header").show();
        }
        jQuery("#site").show();
        return null;
    }).bind(this);

    start_slide = (function () {
        var cell, cells, dummy16_sequence, dummy17_iter, el_reveal, el_section, el_slides, el_subsection, nb, on_ready, process_code, process_markdown;
        nb = Jupyter.notebook;
        nb.keyboard_manager.disable();
        load_css("./reveal.js/css/reveal.css");
        load_css("./reveal.js/css/theme/" + get_option("theme") + ".css");
        load_css("./slide.css");
        header_flag = (jQuery("#header")["is"])(":visible");
        jQuery("#header").hide();
        jQuery("#site").hide();
        cells = nb.get_cells();
        el_reveal = T("div.reveal").appendTo(jQuery("body"));
        el_slides = T("div.slides").appendTo(el_reveal);
        el_section = null;
        el_subsection = null;
        process_code = (function (cell) {
            var _append_code_html, _append_code_output, code, mdcode;
            _append_code_output = (function () {
                var el;
                el = _pymeth_find.call(cell.element, ".output_area").clone();
                (el.children().attr("class", "")).appendTo(el_subsection);
                return null;
            }).bind(this);

            _append_code_html = (function (err, code_html) {
                jQuery(code_html).appendTo(el_subsection);
                _append_code_output();
                return null;
            }).bind(this);

            code = _pymeth_strip.call(cell.get_text());
            if ((!_pyfunc_truthy(_pymeth_startswith.call(code, "#%hide")))) {
                mdcode = "```python\n" + code + "\n```";
                marked(mdcode, _append_code_html);
            } else {
                _append_code_output();
            }
            return null;
        }).bind(this);

        process_markdown = (function (cell) {
            var el;
            el = _pymeth_find.call(cell.element, ".rendered_html").clone();
            el.children().appendTo(el_subsection);
            return null;
        }).bind(this);

        dummy16_sequence = cells;
        if ((typeof dummy16_sequence === "object") && (!Array.isArray(dummy16_sequence))) {
            dummy16_sequence = Object.keys(dummy16_sequence);
        }
        for (dummy17_iter = 0; dummy17_iter < dummy16_sequence.length; dummy17_iter += 1) {
            cell = dummy16_sequence[dummy17_iter];
            if (_pyfunc_truthy(is_new_section(cell))) {
                el_section = T("section").appendTo(el_slides);
            }
            if (_pyfunc_truthy(is_new_subsection(cell))) {
                el_subsection = T("section").appendTo(el_section);
            }
            if ((el_subsection !== null)) {
                if (_pyfunc_equals(cell.cell_type, "markdown")) {
                    process_markdown(cell);
                } else if (_pyfunc_equals(cell.cell_type, "code")) {
                    process_code(cell);
                }
            }
        }
        Reveal.initialize({"controls": true, "progress": true, "history": true, "center": true, "transition": get_option("transition"), "keyboard": {81: end_slide}});
        on_ready = (function (event) {
            Reveal.layout();
            Reveal.slide(0, 0, 0);
            return null;
        }).bind(this);

        Reveal.addEventListener("ready", on_ready);
        return null;
    }).bind(this);

    main = (function () {
        var actions;
        actions = {start_slide:{"help": "save current cell as slice", "icon": "fa-bar-chart-o", "key": "p", handler: start_slide}, configure_slide_options:{"help": "configure slide options", "key": "Alt-p", handler: config_dialog}};
        register_actions(actions);
        return null;
    }).bind(this);

    return {"load_ipython_extension": main};
};

define(imports, load);
})()