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
var imports, load, themes;
imports = ["base/js/namespace", "require", "base/js/events"];
themes = ["default", "oceans16", "grade3", "space-legos", "doc-white", "doc-black"];
load = function (Jupyter, require, events) {
    var get_metadata, load_css, main, set_metadata, unload_css;
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

    set_metadata = (function (target, key, value) {
        var meta;
        meta = target.metadata;
        if (_pyfunc_truthy(!_pyfunc_contains("scpy3", meta))) {
            meta.scpy3 = {};
        }
        meta.scpy3[key] = value;
        return null;
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

    load_css("./style.css");
    main = (function () {
        var dummy7_sequence, dummy8_iter, on_theme_changed, select, set_theme, theme;
        on_theme_changed = (function () {
            var theme;
            theme = select.val();
            unload_css(themes.slice(1));
            if ((!_pyfunc_equals(theme, "default"))) {
                load_css("./themes/" + theme + ".css");
            }
            set_metadata(Jupyter.notebook, "theme", theme);
            events.trigger("theme-changed.scpy3");
            return null;
        }).bind(this);

        select = jQuery("<select/>").attr("id", "scpy3-theme-selector");
        select.addClass("form-control select-xs");
        _pymeth_append.call(select, jQuery("<optgroup label = \"Themes:\">"));
        dummy7_sequence = themes;
        if ((typeof dummy7_sequence === "object") && (!Array.isArray(dummy7_sequence))) {
            dummy7_sequence = Object.keys(dummy7_sequence);
        }
        for (dummy8_iter = 0; dummy8_iter < dummy7_sequence.length; dummy8_iter += 1) {
            theme = dummy7_sequence[dummy8_iter];
            _pymeth_append.call(select, ((jQuery("<option/>").attr("value", theme)).text(theme)));
        }
        select.change(on_theme_changed);
        _pymeth_append.call(Jupyter.toolbar.element, select);
        set_theme = (function () {
            var theme;
            theme = get_metadata(Jupyter.notebook, "theme");
            console.log(theme);
            if ((theme !== null)) {
                select.val(theme);
                on_theme_changed();
            }
            return null;
        }).bind(this);

        events.on("notebook_loaded.Notebook", set_theme);
        set_theme();
        return null;
    }).bind(this);

    return {"load_ipython_extension": main};
};

define(imports, load);
})()