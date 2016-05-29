(function(){
var _pyfunc_truthy = function (v) {
    if (v === null || typeof v !== "object") {return v;}
    else if (v.length !== undefined) {return v.length ? v : false;}
    else if (v.byteLength !== undefined) {return v.byteLength ? v : false;} 
    else {return Object.getOwnPropertyNames(v).length ? v : false;}
};
var imports, load;
imports = ["base/js/namespace", "base/js/events"];
load = function (Jupyter, events) {
    var header, header_elements, main, maximize, normalize;
    header = jQuery("#header");
    header_elements = "#maintoolbar,#header-container,.header-bar,#menubar-container,#header";
    maximize = (function () {
        var notification;
        if (_pyfunc_truthy(header["is"](":visible"))) {
            notification = jQuery("#notification_area");
            notification.css({"position": "absolute", "width": "500px", "bottom": "0px"});
            notification.appendTo(jQuery("body"));
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
            notification.insertAfter(jQuery("#modal_indicator"));
            jQuery("#notebook").removeAttr("style");
            jQuery(header_elements).show();
            events.trigger("resize-header.Page");
        }
        return null;
    }).bind(this);

    main = (function () {
        var action, actions, dummy1_sequence, km, name;
        actions = {maximize:{"help": "", "icon": "", "key": "Ctrl-up", handler: maximize}, normalize:{"help": "", "icon": "", "key": "Ctrl-down", handler: normalize}};
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

    return {"load_ipython_extension": main};
};

define(imports, load);
})()