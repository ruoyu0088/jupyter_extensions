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
    else if (v.constructor !== Object) {return true;}
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

    unload_css = (function (names) {
        var el, href, name, stub2_seq, stub3_itr, stub4_seq, stub5_itr, stub6_seq, stub7_itr, to_remove;
        if ((({}).toString.call(names).match(/\s([a-zA-Z]+)/)[1].toLowerCase() === 'string')) {
            names = [names];
        }
        to_remove = [];
        stub4_seq = jQuery("link").toArray();
        if ((typeof stub4_seq === "object") && (!Array.isArray(stub4_seq))) {
            stub4_seq = Object.keys(stub4_seq);
        }
        for (stub5_itr = 0; stub5_itr < stub4_seq.length; stub5_itr += 1) {
            el = stub4_seq[stub5_itr];
            href = el.getAttribute("href");
            stub2_seq = names;
            if ((typeof stub2_seq === "object") && (!Array.isArray(stub2_seq))) {
                stub2_seq = Object.keys(stub2_seq);
            }
            for (stub3_itr = 0; stub3_itr < stub2_seq.length; stub3_itr += 1) {
                name = stub2_seq[stub3_itr];
                if ((_pyfunc_contains("scpy3", href) && _pyfunc_contains(name, href))) {
                    _pymeth_append.call(to_remove, el);
                    break;
                }
            }
        }
        stub6_seq = to_remove;
        if ((typeof stub6_seq === "object") && (!Array.isArray(stub6_seq))) {
            stub6_seq = Object.keys(stub6_seq);
        }
        for (stub7_itr = 0; stub7_itr < stub6_seq.length; stub7_itr += 1) {
            el = stub6_seq[stub7_itr];
            el.parentNode.removeChild(el);
        }
        return null;
    }).bind(this);

    set_metadata = (function (target, key, value) {
        var meta;
        meta = target.metadata;
        if ((!_pyfunc_contains("scpy3", meta))) {
            meta.scpy3 = {};
        }
        meta.scpy3[key] = value;
        return null;
    }).bind(this);

    show_dialog = (function (title, body, open_callback, buttons) {
        var button, buttons_setting, callback, dialog_settings, stub10_tgt, stub8_seq, stub9_itr;
        open_callback = (open_callback === undefined) ? null: open_callback;
        buttons = (buttons === undefined) ? null: buttons;
        dialog_settings = {"notebook": Jupyter.notebook, "keyboard_manager": Jupyter.keyboard_manager, "title": title, "body": body};
        if ((open_callback !== null)) {
            dialog_settings["open"] = open_callback;
        }
        if ((buttons !== null)) {
            buttons_setting = {};
            stub8_seq = buttons;
            if ((typeof stub8_seq === "object") && (!Array.isArray(stub8_seq))) {
                stub8_seq = Object.keys(stub8_seq);
            }
            for (stub9_itr = 0; stub9_itr < stub8_seq.length; stub9_itr += 1) {
                stub10_tgt = stub8_seq[stub9_itr];
                button = stub10_tgt[0]; callback = stub10_tgt[1];
                buttons_setting[button] = {"class": "btn-primary", "click": callback};
            }
            dialog_settings["buttons"] = buttons_setting;
        }
        dialog.modal(dialog_settings);
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

    load_css = (function (name) {
        var link;
        link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl(name);
        (document.getElementsByTagName("head")[0]).appendChild(link);
        return null;
    }).bind(this);

    make_selector = (function (label, options) {
        var el, item, stub11_seq, stub12_itr;
        el = jQuery("<select/>");
        el.addClass("form-control");
        _pymeth_append.call(el, jQuery("<optgroup label = \"" + label + ":\">"));
        stub11_seq = options;
        if ((typeof stub11_seq === "object") && (!Array.isArray(stub11_seq))) {
            stub11_seq = Object.keys(stub11_seq);
        }
        for (stub12_itr = 0; stub12_itr < stub11_seq.length; stub12_itr += 1) {
            item = stub11_seq[stub12_itr];
            _pymeth_append.call(el, ((jQuery("<option/>").attr("value", item)).text(item)));
        }
        return el;
    }).bind(this);

    make_table = (function (defs) {
        var data, get_values, items, stub13_seq, stub14_itr, stub15_tgt, table, td, title, tr, type_, widget;
        items = {};
        table = new T("table");
        stub13_seq = defs;
        if ((typeof stub13_seq === "object") && (!Array.isArray(stub13_seq))) {
            stub13_seq = Object.keys(stub13_seq);
        }
        for (stub14_itr = 0; stub14_itr < stub13_seq.length; stub14_itr += 1) {
            stub15_tgt = stub13_seq[stub14_itr];
            title = stub15_tgt[0]; type_ = stub15_tgt[1]; data = stub15_tgt[2];
            tr = (new T("tr")).appendTo(table);
            if (_pyfunc_equals(type_, "selector")) {
                ((new T("td")).appendTo(tr)).html(title + ":");
                td = (new T("td")).appendTo(tr);
                widget = make_selector(title, data).appendTo(td);
                widget.val(get_option(_pymeth_lower.call(title)));
            }
            items[title] = widget;
        }
        get_values = (function () {
            var item, key, res, stub16_seq;
            res = {};
            stub16_seq = items;
            for (key in stub16_seq) {
                if (!stub16_seq.hasOwnProperty(key)){ continue; }
                item = stub16_seq[key];
                res[key] = item.val();
            }
            return res;
        }).bind(this);

        return {"table": table, "items": items, "get_values": get_values};
    }).bind(this);

    get_metadata = (function (target, key) {
        var meta;
        meta = target.metadata;
        if ((!_pyfunc_contains("scpy3", meta))) {
            return null;
        }
        if ((!_pyfunc_contains(key, meta.scpy3))) {
            return null;
        }
        return meta.scpy3[key];
    }).bind(this);

    T = (function (tagname) {
        var args, child, el, klass, stub17_, stub18_seq, stub19_itr;
        args = Array.prototype.slice.call(arguments).slice(1);
        klass = null;
        if (_pyfunc_contains(".", tagname)) {
            stub17_ = _pymeth_split.call(tagname, ".");
            tagname = stub17_[0];klass = stub17_[1];
        }
        el = jQuery("<" + tagname + "/>");
        if ((klass !== null)) {
            el.addClass(klass);
        }
        stub18_seq = args;
        if ((typeof stub18_seq === "object") && (!Array.isArray(stub18_seq))) {
            stub18_seq = Object.keys(stub18_seq);
        }
        for (stub19_itr = 0; stub19_itr < stub18_seq.length; stub19_itr += 1) {
            child = stub18_seq[stub19_itr];
            _pymeth_append.call(el, child);
        }
        return el;
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
        if ((!_pyfunc_contains("theme", options))) {
            options["theme"] = "default";
        }
        if ((!_pyfunc_contains("transition", options))) {
            options["transition"] = "slide";
        }
        if ((!_pyfunc_contains("speed", options))) {
            options["speed"] = "default";
        }
        return options[name];
    }).bind(this);

    config_dialog = (function () {
        var defs, on_ok, tab;
        defs = [["Theme", "selector", Themes], ["Transition", "selector", Transitions], ["Speed", "selector", Speeds]];
        tab = make_table(defs);
        on_ok = (function () {
            var key, metadata, nb, stub20_seq, val;
            nb = Jupyter.notebook;
            metadata = get_metadata(nb, "slide");
            if ((metadata === null)) {
                metadata = {};
            }
            stub20_seq = tab.get_values();
            for (key in stub20_seq) {
                if (!stub20_seq.hasOwnProperty(key)){ continue; }
                val = stub20_seq[key];
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
            if ((_pymeth_startswith.call(cell.get_text(), "#%slide"))) {
                return true;
            }
        }
        return get_level(cell) <= 6;
    }).bind(this);

    end_slide = (function () {
        var cell_index, el, idx, idx2, nb, stub21_seq, stub22_itr;
        nb = Jupyter.notebook;
        stub21_seq = jQuery(".reveal [src-cell]").toArray();
        if ((typeof stub21_seq === "object") && (!Array.isArray(stub21_seq))) {
            stub21_seq = Object.keys(stub21_seq);
        }
        for (stub22_itr = 0; stub22_itr < stub21_seq.length; stub22_itr += 1) {
            el = stub21_seq[stub22_itr];
            el = jQuery(el);
            idx = _pyfunc_int(el.attr("src-cell"));
            idx2 = _pyfunc_int(el.attr("output-area"));
            el.appendTo(_pymeth_find.call((nb.get_cell(idx).element), (".output_area:eq(" + idx2 + ")")));
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
        var cell, cell_text, cells, cnt_section, cnt_subsection, el_reveal, el_section, el_slides, el_subsection, idx, nb, on_ready, process_code, process_markdown, selected_index, stub26_seq, stub27_itr, stub28_tgt;
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
                var el, idx2, stub23_seq, stub24_itr, stub25_tgt;
                stub23_seq = _pyfunc_enumerate((_pymeth_find.call(cell.element, ".output_area").toArray()));
                if ((typeof stub23_seq === "object") && (!Array.isArray(stub23_seq))) {
                    stub23_seq = Object.keys(stub23_seq);
                }
                for (stub24_itr = 0; stub24_itr < stub23_seq.length; stub24_itr += 1) {
                    stub25_tgt = stub23_seq[stub24_itr];
                    idx2 = stub25_tgt[0]; el = stub25_tgt[1];
                    (((jQuery(el).children()).attr("src-cell", idx)).attr("output-area", idx2)).appendTo(el_subsection);
                }
                return null;
            }).bind(this);

            _append_code_html = (function (err, code_html) {
                jQuery(code_html).appendTo(el_subsection);
                _append_code_output();
                return null;
            }).bind(this);

            code = _pymeth_strip.call(cell.get_text());
            if ((!_pymeth_startswith.call(code, "#%hide"))) {
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

        stub26_seq = _pyfunc_enumerate(cells);
        if ((typeof stub26_seq === "object") && (!Array.isArray(stub26_seq))) {
            stub26_seq = Object.keys(stub26_seq);
        }
        for (stub27_itr = 0; stub27_itr < stub26_seq.length; stub27_itr += 1) {
            stub28_tgt = stub26_seq[stub27_itr];
            idx = stub28_tgt[0]; cell = stub28_tgt[1];
            cell_text = cell.get_text();
            if ((_pymeth_startswith.call(cell_text, "#%skip") || _pymeth_startswith.call(cell_text, "<!---skip") || (_pyfunc_equals(_pymeth_strip.call(cell_text), "")))) {
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