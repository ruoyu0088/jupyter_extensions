(function(){
var _pyfunc_truthy = function (v) {
    if (v === null || typeof v !== "object") {return v;}
    else if (v.length !== undefined) {return v.length ? v : false;}
    else if (v.byteLength !== undefined) {return v.byteLength ? v : false;} 
    else {return Object.getOwnPropertyNames(v).length ? v : false;}
};
var _pymeth_endswith = function (x) { // nargs: 1
    if (this.constructor !== String) return this.endswith.apply(this, arguments);
    return this.lastIndexOf(x) == this.length - x.length;
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
var imports, load;
imports = ["base/js/namespace", "base/js/events", "require", "./jquery.side.menu"];
load = function (Jupyter, events, require, _) {
    var load_css, main, remove_last_ch, toc, toggle_toc, update_toc;
    load_css = (function (name) {
        var link;
        link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl(name);
        (document.getElementsByTagName("head")[0]).appendChild(link);
        return null;
    }).bind(this);

    load_css("./side-menu.css");
    toc = jQuery("<div id=\"scpy3-toc\"></div>");
    toc.css({"position": "absolute", "width": "200px", "top": "120px", "right": "0px", "height": "600px", "background-color": "rgba(128,128,128,0.1)"});
    toc.appendTo(jQuery("body"));
    toc.hide();
    remove_last_ch = (function (index, el) {
        var text, title;
        el = jQuery(el);
        text = el.html();
        if ((_pyfunc_truthy(text) && (_pyfunc_truthy(_pymeth_endswith.call(text, "\u00b6"))))) {
            el.html(text.slice(0,-1));
        }
        title = el.attr("title");
        if ((_pyfunc_truthy(title) && (_pyfunc_truthy(_pymeth_endswith.call(title, "\u00b6"))))) {
            el.attr("title", title.slice(0,-1));
        }
        return null;
    }).bind(this);

    update_toc = (function () {
        console.log("update toc");
        if (_pyfunc_truthy(toc["is"](":visible"))) {
            jQuery("#scpy3-toc").empty();
            Jupyter.notebook.element.sideMenu({container: "#scpy3-toc", hs: ["h2", "h3", "h4", "h5"]});
            _pymeth_find.call(toc, "span").each(remove_last_ch);
        }
        return null;
    }).bind(this);

    toggle_toc = (function () {
        toc.toggle();
        update_toc();
        return null;
    }).bind(this);

    main = (function () {
        var action, actions, dummy1_sequence, km, name;
        actions = {toggle_toc:{"help": "", "icon": "", "key": "Alt-t", handler: toggle_toc}};
        km = Jupyter.keyboard_manager;
        dummy1_sequence = actions;
        for (name in dummy1_sequence) {
            if (!dummy1_sequence.hasOwnProperty(name)){ continue; }
            action = dummy1_sequence[name];
            km.actions.register(action, name, "scpy3");
            km.command_shortcuts.add_shortcut(action.key, "scpy3:" + name);
        }
        return null;
    }).bind(this);

    events.on("create.Cell", update_toc);
    events.on("delete.Cell", update_toc);
    events.on("command_mode.Notebook", update_toc);
    return {"load_ipython_extension": main};
};

define(imports, load);
})()