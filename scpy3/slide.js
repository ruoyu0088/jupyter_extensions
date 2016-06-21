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
var _pyfunc_enumerate = function (iter) { // nargs: 1
    var i, res=[];
    if ((typeof iter==="object") && (!Array.isArray(iter))) {iter = Object.keys(iter);}
    for (i=0; i<iter.length; i++) {res.push([i, iter[i]]);}
    return res;
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
var _pymeth_lower = function () { // nargs: 0
    if (this.constructor !== String) return this.lower.apply(this, arguments);
    return this.toLowerCase();
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
    var T, config_dialog, end_slide, get_level, get_metadata, get_option, header_flag, is_new_section, is_new_subsection, load_css, main, make_selector, make_table, register_actions, revealjs_loaded, set_metadata, show_dialog, start_section, start_slide, toc_flag, unload_css;
    unload_css = (function (names) {
        var dummy1_sequence, dummy2_iter, dummy3_sequence, dummy4_iter, dummy5_sequence, dummy6_iter, el, href, name, to_remove;
        if ((({}).toString.call(names).match(/\s([a-zA-Z]+)/)[1].toLowerCase() === 'string')) {
            names = [names];
        }
        to_remove = [];
        dummy3_sequence = jQuery("link").toArray();
        if ((typeof dummy3_sequence === "object") && (!Array.isArray(dummy3_sequence))) {
            dummy3_sequence = Object.keys(dummy3_sequence);
        }
        for (dummy4_iter = 0; dummy4_iter < dummy3_sequence.length; dummy4_iter += 1) {
            el = dummy3_sequence[dummy4_iter];
            href = el.getAttribute("href");
            dummy1_sequence = names;
            if ((typeof dummy1_sequence === "object") && (!Array.isArray(dummy1_sequence))) {
                dummy1_sequence = Object.keys(dummy1_sequence);
            }
            for (dummy2_iter = 0; dummy2_iter < dummy1_sequence.length; dummy2_iter += 1) {
                name = dummy1_sequence[dummy2_iter];
                if (((_pyfunc_truthy(_pyfunc_contains("scpy3", href))) && (_pyfunc_truthy(_pyfunc_contains(name, href))))) {
                    _pymeth_append.call(to_remove, el);
                    break;
                }
            }
        }
        dummy5_sequence = to_remove;
        if ((typeof dummy5_sequence === "object") && (!Array.isArray(dummy5_sequence))) {
            dummy5_sequence = Object.keys(dummy5_sequence);
        }
        for (dummy6_iter = 0; dummy6_iter < dummy5_sequence.length; dummy6_iter += 1) {
            el = dummy5_sequence[dummy6_iter];
            el.parentNode.removeChild(el);
        }
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

    set_metadata = (function (target, key, value) {
        var meta;
        meta = target.metadata;
        if (_pyfunc_truthy(!_pyfunc_contains("scpy3", meta))) {
            meta.scpy3 = {};
        }
        meta.scpy3[key] = value;
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

    show_dialog = (function (title, body, open_callback, buttons) {
        var button, buttons_setting, callback, dialog_settings, dummy7_sequence, dummy8_iter, dummy9_target;
        open_callback = (open_callback === undefined) ? null: open_callback;
        buttons = (buttons === undefined) ? null: buttons;
        dialog_settings = {"notebook": Jupyter.notebook, "keyboard_manager": Jupyter.keyboard_manager, "title": title, "body": body};
        if ((open_callback !== null)) {
            dialog_settings["open"] = open_callback;
        }
        if ((buttons !== null)) {
            buttons_setting = {};
            dummy7_sequence = buttons;
            if ((typeof dummy7_sequence === "object") && (!Array.isArray(dummy7_sequence))) {
                dummy7_sequence = Object.keys(dummy7_sequence);
            }
            for (dummy8_iter = 0; dummy8_iter < dummy7_sequence.length; dummy8_iter += 1) {
                dummy9_target = dummy7_sequence[dummy8_iter];
                button = dummy9_target[0]; callback = dummy9_target[1];
                buttons_setting[button] = {"class": "btn-primary", "click": callback};
            }
            dialog_settings["buttons"] = buttons_setting;
        }
        dialog.modal(dialog_settings);
        return null;
    }).bind(this);

    make_selector = (function (label, options) {
        var dummy10_sequence, dummy11_iter, el, item;
        el = jQuery("<select/>");
        el.addClass("form-control");
        _pymeth_append.call(el, jQuery("<optgroup label = \"" + label + ":\">"));
        dummy10_sequence = options;
        if ((typeof dummy10_sequence === "object") && (!Array.isArray(dummy10_sequence))) {
            dummy10_sequence = Object.keys(dummy10_sequence);
        }
        for (dummy11_iter = 0; dummy11_iter < dummy10_sequence.length; dummy11_iter += 1) {
            item = dummy10_sequence[dummy11_iter];
            _pymeth_append.call(el, ((jQuery("<option/>").attr("value", item)).text(item)));
        }
        return el;
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
        var action, dummy12_sequence, key, km;
        target = (target === undefined) ? "command": target;
        km = Jupyter.keyboard_manager;
        dummy12_sequence = actions;
        for (key in dummy12_sequence) {
            if (!dummy12_sequence.hasOwnProperty(key)){ continue; }
            action = dummy12_sequence[key];
            key = _pymeth_replace.call(key, "_", "-");
            km.actions.register(action, key, "scpy3");
            km[target + "_shortcuts"].add_shortcut(action.key, "scpy3:" + key);
        }
        return null;
    }).bind(this);

    T = (function (tagname) {
        var args, child, dummy13_, dummy14_sequence, dummy15_iter, el, klass;
        args = Array.prototype.slice.call(arguments).slice(1);
        klass = null;
        if (_pyfunc_truthy(_pyfunc_contains(".", tagname))) {
            dummy13_ = _pymeth_split.call(tagname, ".");
            tagname = dummy13_[0];klass = dummy13_[1];
        }
        el = jQuery("<" + tagname + "/>");
        if ((klass !== null)) {
            el.addClass(klass);
        }
        dummy14_sequence = args;
        if ((typeof dummy14_sequence === "object") && (!Array.isArray(dummy14_sequence))) {
            dummy14_sequence = Object.keys(dummy14_sequence);
        }
        for (dummy15_iter = 0; dummy15_iter < dummy14_sequence.length; dummy15_iter += 1) {
            child = dummy14_sequence[dummy15_iter];
            _pymeth_append.call(el, child);
        }
        return el;
    }).bind(this);

    make_table = (function (defs) {
        var data, dummy16_sequence, dummy17_iter, dummy18_target, get_values, items, table, td, title, tr, type_, widget;
        items = {};
        table = T("table");
        dummy16_sequence = defs;
        if ((typeof dummy16_sequence === "object") && (!Array.isArray(dummy16_sequence))) {
            dummy16_sequence = Object.keys(dummy16_sequence);
        }
        for (dummy17_iter = 0; dummy17_iter < dummy16_sequence.length; dummy17_iter += 1) {
            dummy18_target = dummy16_sequence[dummy17_iter];
            title = dummy18_target[0]; type_ = dummy18_target[1]; data = dummy18_target[2];
            tr = T("tr").appendTo(table);
            if (_pyfunc_equals(type_, "selector")) {
                (T("td").appendTo(tr)).html(title + ":");
                td = T("td").appendTo(tr);
                widget = make_selector(title, data).appendTo(td);
                widget.val(get_option(_pymeth_lower.call(title)));
            }
            items[title] = widget;
        }
        get_values = (function () {
            var dummy19_sequence, item, key, res;
            res = {};
            dummy19_sequence = items;
            for (key in dummy19_sequence) {
                if (!dummy19_sequence.hasOwnProperty(key)){ continue; }
                item = dummy19_sequence[key];
                res[key] = item.val();
            }
            return res;
        }).bind(this);

        return {"table": table, "items": items, "get_values": get_values};
    }).bind(this);

    require((function list_comprehenson () {var res = [];var url, iter0, i0;iter0 = revealjs;if ((typeof iter0 === "object") && (!Array.isArray(iter0))) {iter0 = Object.keys(iter0);}for (i0=0; i0<iter0.length; i0++) {url = iter0[i0];{res.push(require.toUrl(url));}}return res;}).apply(this), revealjs_loaded);
    header_flag = null;
    toc_flag = null;
    start_section = null;
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
        var defs, on_ok, tab;
        defs = [["Theme", "selector", Themes], ["Transition", "selector", Transitions], ["Speed", "selector", Speeds]];
        tab = make_table(defs);
        on_ok = (function () {
            var dummy20_sequence, key, metadata, nb, val;
            nb = Jupyter.notebook;
            metadata = get_metadata(nb, "slide");
            if ((metadata === null)) {
                metadata = {};
            }
            dummy20_sequence = tab.get_values();
            for (key in dummy20_sequence) {
                if (!dummy20_sequence.hasOwnProperty(key)){ continue; }
                val = dummy20_sequence[key];
                metadata[_pymeth_lower.call(key)] = val;
            }
            set_metadata(nb, "slide", metadata);
            return null;
        }).bind(this);

        show_dialog("Reveal.js configuration", tab.table, null, [["Ok", on_ok]]);
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
        var cell_index, dummy21_sequence, dummy22_iter, el, idx, nb;
        nb = Jupyter.notebook;
        dummy21_sequence = jQuery(".reveal [src-cell]").toArray();
        if ((typeof dummy21_sequence === "object") && (!Array.isArray(dummy21_sequence))) {
            dummy21_sequence = Object.keys(dummy21_sequence);
        }
        for (dummy22_iter = 0; dummy22_iter < dummy21_sequence.length; dummy22_iter += 1) {
            el = dummy21_sequence[dummy22_iter];
            el = jQuery(el);
            idx = _pyfunc_int(el.attr("src-cell"));
            el.appendTo(_pymeth_find.call((nb.get_cell(idx).element), ".output_area"));
        }
        cell_index = _pyfunc_int((jQuery("section.present:last").attr("cellid")));
        nb.keyboard_manager.enable();
        unload_css("reveal.js/css/reveal.css");
        unload_css("reveal.js/css/theme/" + get_option("theme") + ".css");
        unload_css("slide.css");
        jQuery(".reveal").remove();
        if (_pyfunc_truthy(header_flag)) {
            jQuery("#header").show();
        }
        if (_pyfunc_truthy(toc_flag)) {
            jQuery("#scpy3-toc").show();
        }
        jQuery("#site").show();
        nb.select(cell_index);
        nb.scroll_to_cell(cell_index);
        return null;
    }).bind(this);

    start_slide = (function () {
        var cell, cell_text, cells, cnt_section, cnt_subsection, dummy23_sequence, dummy24_iter, dummy25_target, el_reveal, el_section, el_slides, el_subsection, idx, nb, on_ready, process_code, process_markdown, selected_index;
        nb = Jupyter.notebook;
        nb.keyboard_manager.disable();
        load_css("./reveal.js/css/reveal.css");
        load_css("./reveal.js/css/theme/" + get_option("theme") + ".css");
        load_css("./slide.css");
        header_flag = (jQuery("#header")["is"])(":visible");
        toc_flag = (jQuery("#scpy3-toc")["is"])(":visible");
        jQuery("#header").hide();
        jQuery("#site").hide();
        jQuery("#scpy3-toc").hide();
        cells = nb.get_cells();
        el_reveal = T("div.reveal").appendTo(jQuery("body"));
        el_reveal.addClass("reveal-theme-" + get_option("theme") + "");
        el_slides = T("div.slides").appendTo(el_reveal);
        el_section = null;
        el_subsection = null;
        cnt_section = -1;
        cnt_subsection = -1;
        selected_index = nb.get_selected_index();
        start_section = [0, 0];
        process_code = (function (idx, cell) {
            var _append_code_html, _append_code_output, code, mdcode;
            _append_code_output = (function () {
                var el;
                el = _pymeth_find.call(cell.element, ".output_area");
                (el.children().attr("src-cell", idx)).appendTo(el_subsection);
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

        process_markdown = (function (idx, cell) {
            var el;
            el = _pymeth_find.call(cell.element, ".rendered_html").clone();
            el.children().appendTo(el_subsection);
            return null;
        }).bind(this);

        dummy23_sequence = _pyfunc_enumerate(cells);
        if ((typeof dummy23_sequence === "object") && (!Array.isArray(dummy23_sequence))) {
            dummy23_sequence = Object.keys(dummy23_sequence);
        }
        for (dummy24_iter = 0; dummy24_iter < dummy23_sequence.length; dummy24_iter += 1) {
            dummy25_target = dummy23_sequence[dummy24_iter];
            idx = dummy25_target[0]; cell = dummy25_target[1];
            cell_text = cell.get_text();
            if (((_pyfunc_truthy(_pymeth_startswith.call(cell_text, "#%skip"))) || (_pyfunc_truthy(_pymeth_startswith.call(cell_text, "<!---skip"))) || ((_pyfunc_equals(_pymeth_strip.call(cell_text), ""))))) {
                continue;
            }
            if (_pyfunc_truthy(is_new_section(cell))) {
                el_section = T("section").appendTo(el_slides);
                cnt_section=_pyfunc_add(cnt_section, 1)
                cnt_subsection = -1;
            }
            if (_pyfunc_truthy(is_new_subsection(cell))) {
                el_subsection = T("section").appendTo(el_section);
                cnt_subsection=_pyfunc_add(cnt_subsection, 1)
            }
            if (_pyfunc_equals(selected_index, idx)) {
                start_section = [cnt_section, cnt_subsection];
                console.log(start_section);
            }
            if ((el_subsection !== null)) {
                if (_pyfunc_equals(cell.cell_type, "markdown")) {
                    process_markdown(idx, cell);
                } else if (_pyfunc_equals(cell.cell_type, "code")) {
                    process_code(idx, cell);
                }
                if ((_pyfunc_equals(el_subsection.attr("cellid"), undefined))) {
                    el_subsection.attr("cellid", idx);
                }
            }
        }
        Reveal.initialize({"controls": true, "progress": true, "history": true, "center": true, "transition": get_option("transition"), "transitionSpeed": get_option("speed"), "keyboard": {81: end_slide}});
        on_ready = (function (event) {
            Reveal.layout();
            Reveal.slide(start_section[0], start_section[1], 0);
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