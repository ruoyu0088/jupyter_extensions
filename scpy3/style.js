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
var _pymeth_append = function (x) { // nargs: 1
    if (!Array.isArray(this)) return this.append.apply(this, arguments);
    this.push(x);
};
var imports, load, themes;
imports = ["base/js/namespace", "require", "base/js/events"];
themes = ["default", "oceans16", "grade3", "space-legos", "doc-white", "doc-black"];
load = function (Jupyter, require, events) {
    var get_metadata, load_css, main, set_metadata, unload_css;
    unload_css = (function (names) {
        var el, href, name, stub1_seq, stub2_itr, stub3_seq, stub4_itr, stub5_seq, stub6_itr, to_remove;
        if ((({}).toString.call(names).match(/\s([a-zA-Z]+)/)[1].toLowerCase() === 'string')) {
            names = [names];
        }
        to_remove = [];
        stub3_seq = jQuery("link").toArray();
        if ((typeof stub3_seq === "object") && (!Array.isArray(stub3_seq))) {
            stub3_seq = Object.keys(stub3_seq);
        }
        for (stub4_itr = 0; stub4_itr < stub3_seq.length; stub4_itr += 1) {
            el = stub3_seq[stub4_itr];
            href = el.getAttribute("href");
            stub1_seq = names;
            if ((typeof stub1_seq === "object") && (!Array.isArray(stub1_seq))) {
                stub1_seq = Object.keys(stub1_seq);
            }
            for (stub2_itr = 0; stub2_itr < stub1_seq.length; stub2_itr += 1) {
                name = stub1_seq[stub2_itr];
                if ((_pyfunc_contains("scpy3", href) && _pyfunc_contains(name, href))) {
                    _pymeth_append.call(to_remove, el);
                    break;
                }
            }
        }
        stub5_seq = to_remove;
        if ((typeof stub5_seq === "object") && (!Array.isArray(stub5_seq))) {
            stub5_seq = Object.keys(stub5_seq);
        }
        for (stub6_itr = 0; stub6_itr < stub5_seq.length; stub6_itr += 1) {
            el = stub5_seq[stub6_itr];
            el.parentNode.removeChild(el);
        }
        return null;
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

    load_css = (function (name) {
        var link;
        link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl(name);
        (document.getElementsByTagName("head")[0]).appendChild(link);
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

    load_css("./style.css");
    main = (function () {
        var on_theme_changed, select, set_theme, stub7_seq, stub8_itr, theme;
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
        stub7_seq = themes;
        if ((typeof stub7_seq === "object") && (!Array.isArray(stub7_seq))) {
            stub7_seq = Object.keys(stub7_seq);
        }
        for (stub8_itr = 0; stub8_itr < stub7_seq.length; stub8_itr += 1) {
            theme = stub7_seq[stub8_itr];
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