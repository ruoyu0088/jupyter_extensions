(function(){
var _pyfunc_truthy = function (v) {
    if (v === null || typeof v !== "object") {return v;}
    else if (v.length !== undefined) {return v.length ? v : false;}
    else if (v.byteLength !== undefined) {return v.byteLength ? v : false;}
    else if (v.constructor !== Object) {return true;}
    else {return Object.getOwnPropertyNames(v).length ? v : false;}
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
var imports, load;
imports = ["base/js/namespace", "base/js/events"];
load = function (Jupyter, events) {
    var header, header_elements, main, maximize, normalize, register_actions;
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

    header = jQuery("#header");
    header_elements = "#maintoolbar,#header-container,.header-bar,#menubar-container,#header";
    maximize = (function () {
        var body, info, notification;
        if (_pyfunc_truthy(header["is"](":visible"))) {
            body = jQuery("body");
            notification = jQuery("#notification_area");
            notification.css({"position": "absolute", "width": "500px", "bottom": "0px"});
            notification.appendTo(body);
            info = jQuery("<div id=\"scpy3-maximize-info\"></div>");
            info.css({"position": "absolute", "width": "500px", "bottom": "0px", "right": "20px"});
            info.appendTo(body);
            jQuery("#kernel_indicator").appendTo(info);
            jQuery("#readonly-indicator").appendTo(info);
            jQuery("#modal_indicator").appendTo(info);
            jQuery("#notebook").css({"padding-top": "0px"});
            jQuery(header_elements).hide();
            events.trigger("resize-header.Page");
        }
        return null;
    }).bind(this);

    normalize = (function () {
        var notification;
        if ((!_pyfunc_truthy(header["is"](":visible")))) {
            notification = jQuery("#notification_area");
            notification.removeAttr("style");
            jQuery("#kernel_indicator").insertAfter(jQuery("button.navbar-toggle"));
            jQuery("#readonly-indicator").insertAfter(jQuery("#kernel_indicator"));
            jQuery("#modal_indicator").insertAfter(jQuery("#readonly-indicator"));
            notification.insertAfter(jQuery("#modal_indicator"));
            jQuery("#scpy3-maximize-info").remove();
            jQuery("#notebook").removeAttr("style");
            jQuery(header_elements).show();
            events.trigger("resize-header.Page");
        }
        return null;
    }).bind(this);

    main = (function () {
        var actions;
        actions = {maximize_edit_area:{"help": "maximize edit area", "icon": "fa-caret-square-o-up", "key": "Ctrl-up", handler: maximize}, restore_edit_area_to_normal:{"help": "restore edit area to normal", "icon": "fa-caret-square-o-down", "key": "Ctrl-down", handler: normalize}};
        register_actions(actions);
        return null;
    }).bind(this);

    return {"load_ipython_extension": main};
};

define(imports, load);
})()