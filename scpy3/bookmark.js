(function(){
var _pyfunc_add = function (a, b) { // nargs: 2
    if (Array.isArray(a) && Array.isArray(b)) {
        return a.concat(b);
    } return a + b;
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
var N, imports, load, patch_code;
imports = ["base/js/namespace", "base/js/events", "require", "notebook/js/tooltip", "base/js/utils"];
N = 3;
patch_code = "\n\nTooltip.Tooltip.prototype._show = function(reply){\n        /**\n         * move the bubble if it is not hidden\n         * otherwise fade it\n         */\n        this._reply = reply;\n        var content = reply.content;\n        if (!content.found) {\n            // object not found, nothing to show\n            return;\n        }\n        this.name = content.name;\n\n        // do some math to have the tooltip arrow on more or less on left or right\n        // position of the editor\n        var cm_element = $(this.code_mirror.getWrapperElement());\n        var pos1 = cm_element.position();\n        var pos2 = cm_element.closest(\"div.cell\").position();\n        var cm_pos = {top:pos1.top + pos2.top, left:pos1.left + pos2.left};\n        // anchor and head positions are local within CodeMirror element\n        var anchor = this.code_mirror.cursorCoords(false, 'local');\n        var head = this.code_mirror.cursorCoords(true, 'local');\n        // locate the target at the center of anchor, head\n        var center_left = (head.left + anchor.left) / 2;\n        // locate the left edge of the tooltip, at most 450 px left of the arrow\n        var edge_left = Math.max(center_left - 450, 0);\n        // locate the arrow at the cursor. A 24 px offset seems necessary.\n        var arrow_left = center_left - edge_left - 24;\n        \n        // locate left, top within container element\n        var left = (cm_pos.left + edge_left) + 'px';\n        var top = (cm_pos.top + head.bottom + 10) + 'px';\n\n        if (this._hidden === false) {\n            this.tooltip.animate({\n                left: left,\n                top: top\n            });\n        } else {\n            this.tooltip.css({\n                left: left\n            });\n            this.tooltip.css({\n                top: top\n            });\n        }\n        this.arrow.animate({\n            'left': arrow_left + 'px'\n        });\n        \n        this._hidden = false;\n        this.tooltip.fadeIn('fast');\n        this.text.children().remove();\n        \n        // This should support rich data types, but only text/plain for now\n        // Any HTML within the docstring is escaped by the fixConsole() method.\n        var pre = $('<pre/>').html(utils.fixConsole(content.data['text/plain']));\n        this.text.append(pre);\n        // keep scroll top to be sure to always see the first line\n        this.text.scrollTop(0);\n};\n\n\n";
load = function (Jupyter, events, require, Tooltip, utils) {
    var load_css, main, nb, next_bookmark, prev_bookmark, register_actions, run_bookmark, search_bookmark, show_message, toggle_bookmark;
    show_message = (function (message, wait) {
        var notification_widget;
        notification_widget = Jupyter.notification_area.widget("notebook");
        notification_widget.set_message(message, wait);
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

    eval(patch_code);
    load_css("./bookmark.css");
    nb = Jupyter.notebook;
    toggle_bookmark = (function (mark_id) {
        var cell, i;
        cell = nb.get_selected_cell();
        for (i = 1; i < N + 1; i += 1) {
            if (_pyfunc_equals(i, mark_id)) {
                continue;
            }
            cell.element.removeClass("cell-bookmark-" + i + "");
        }
        cell.element.toggleClass("cell-bookmark-" + mark_id + "");
        if (_pyfunc_truthy(cell.element.hasClass("cell-bookmark-" + mark_id + ""))) {
            cell.metadata.scpy3_bookmark = mark_id;
        } else {
            delete cell.metadata.scpy3_bookmark;
        }
        return null;
    }).bind(this);

    run_bookmark = (function (mark_id) {
        var cell, cells, count, dummy2_sequence, dummy3_iter;
        cells = nb.get_cells();
        count = 0;
        dummy2_sequence = cells;
        if ((typeof dummy2_sequence === "object") && (!Array.isArray(dummy2_sequence))) {
            dummy2_sequence = Object.keys(dummy2_sequence);
        }
        for (dummy3_iter = 0; dummy3_iter < dummy2_sequence.length; dummy3_iter += 1) {
            cell = dummy2_sequence[dummy3_iter];
            if ((_pyfunc_equals(cell.cell_type, "code") && _pyfunc_equals(cell.metadata.scpy3_bookmark, mark_id))) {
                cell.execute();
                count=_pyfunc_add(count, 1)
            }
        }
        show_message("" + count + " cells executed", 2000);
        return null;
    }).bind(this);

    search_bookmark = (function (step) {
        var cell, cells, dummy4_else, dummy5_sequence, dummy6_iter, i, indexes, start;
        console.log("next_bookmark");
        cells = nb.get_cells();
        start = nb.get_selected_index();
        if (_pyfunc_truthy(step > 0)) {
            indexes = _pyfunc_add((_pyfunc_range((start + 1), cells.length, 1)), _pyfunc_range(0, start, 1));
        } else {
            indexes = _pyfunc_add((_pyfunc_range((start - 1), (-1), (-1))), (_pyfunc_range((cells.length - 1), start, (-1))));
        }
        dummy4_else = true;
        dummy5_sequence = indexes;
        if ((typeof dummy5_sequence === "object") && (!Array.isArray(dummy5_sequence))) {
            dummy5_sequence = Object.keys(dummy5_sequence);
        }
        for (dummy6_iter = 0; dummy6_iter < dummy5_sequence.length; dummy6_iter += 1) {
            i = dummy5_sequence[dummy6_iter];
            cell = cells[i];
            if (_pyfunc_truthy(cell.metadata.scpy3_bookmark)) {
                nb.select(i);
                nb.scroll_to_cell(i);
                dummy4_else = false; break;
            }
        } if (dummy4_else) {
            show_message("No bookmark", 2000);
        }
        return null;
    }).bind(this);

    next_bookmark = (function () {
        search_bookmark(1);
        return null;
    }).bind(this);

    prev_bookmark = (function () {
        search_bookmark(-1);
        return null;
    }).bind(this);

    main = (function () {
        var actions, cell, dummy7_sequence, dummy8_iter;
        actions = {toggle_bookmark_1:({"help": "toogle bookmark 1", "icon": "fa-bookmark", "key": "Shift-1", handler: (function () {return toggle_bookmark(1);}).bind(this)}), toggle_bookmark_2:({"help": "toggle bookmark 2", "icon": "fa-bookmark", "key": "Shift-2", handler: (function () {return toggle_bookmark(2);}).bind(this)}), toggle_bookmark_3:({"help": "toggle bookmark 3", "icon": "fa-bookmark", "key": "Shift-3", handler: (function () {return toggle_bookmark(3);}).bind(this)}), run_cells_with_bookmark_1:({"help": "run cells with bookmark 1", "icon": "fa-play-circle", "key": "Ctrl-Shift-1", handler: (function () {return run_bookmark(1);}).bind(this)}), run_cells_with_bookmark_2:({"help": "run cells with bookmark 2", "icon": "fa-play-circle", "key": "Ctrl-Shift-2", handler: (function () {return run_bookmark(2);}).bind(this)}), run_cells_with_bookmark_3:({"help": "run cells with bookmark 3", "icon": "fa-play-circle", "key": "Ctrl-Shift-3", handler: (function () {return run_bookmark(3);}).bind(this)}), jump_to_next_bookmark:{"help": "jump to next bookmark", "icon": "fa-hand-o-right", "key": "Shift-right", handler: next_bookmark}, jump_to_previous_bookmark:{"help": "jump to previous bookmark", "icon": "fa-hand-o-left", "key": "Shift-left", handler: prev_bookmark}};
        register_actions(actions);
        dummy7_sequence = nb.get_cells();
        if ((typeof dummy7_sequence === "object") && (!Array.isArray(dummy7_sequence))) {
            dummy7_sequence = Object.keys(dummy7_sequence);
        }
        for (dummy8_iter = 0; dummy8_iter < dummy7_sequence.length; dummy8_iter += 1) {
            cell = dummy7_sequence[dummy8_iter];
            if (_pyfunc_truthy(cell.metadata.scpy3_bookmark)) {
                cell.element.addClass("cell-bookmark-" + _pyfunc_int(cell.metadata.scpy3_bookmark) + "");
            }
        }
        return null;
    }).bind(this);

    return {"load_ipython_extension": main};
};

define(imports, load);
})()