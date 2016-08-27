(function(){
var _pyfunc_add = function (a, b) { // nargs: 2
    if (Array.isArray(a) && Array.isArray(b)) {
        return a.concat(b);
    } return a + b;
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
var _pyfunc_mult = function (a, b) { // nargs: 2
    if ((typeof a === 'number') + (typeof b === 'number') === 1) {
        if (a.constructor === String) return _pymeth_repeat.call(a, b);
        if (b.constructor === String) return _pymeth_repeat.call(b, a);
        if (Array.isArray(b)) {var t=a; a=b; b=t;}
        if (Array.isArray(a)) {
            var res = []; for (var i=0; i<b; i++) res = res.concat(a);
            return res;
        }
    } return a * b;
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
var _pymeth_append = function (x) { // nargs: 1
    if (!Array.isArray(this)) return this.append.apply(this, arguments);
    this.push(x);
};
var _pymeth_center = function (w, fill) { // nargs: 1 2
    if (this.constructor !== String) return this.center.apply(this, arguments);
    fill = (fill === undefined) ? ' ' : fill;
    var tofill = Math.max(0, w - this.length);
    var left = Math.ceil(tofill / 2);
    var right = tofill - left;
    return _pymeth_repeat.call(fill, left) + this + _pymeth_repeat.call(fill, right);
};
var _pymeth_join = function (x) { // nargs: 1
    if (this.constructor !== String) return this.join.apply(this, arguments);
    return x.join(this);  // call join on the list instead of the string.   
};
var _pymeth_repeat = function(count) { // nargs: 0
    if (this.repeat) return this.repeat(count);
    if (count < 1) return '';
    var result = '', pattern = this.valueOf();
    while (count > 1) {
        if (count & 1) result += pattern;
        count >>= 1, pattern += pattern;
    }
    return result + pattern;
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
var imports, load;
imports = ["base/js/namespace", "base/js/dialog", "services/config", "base/js/utils", "components/marked/lib/marked"];
load = function (Jupyter, dialog, configmod, utils, marked) {
    var format_markdown_table, format_table, main, register_actions;
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

    format_table = (function (table) {
        var col_sizes, format_split, i, line, ncol, nrow, res, row, row_text, rows, stub2_seq, stub3_itr, stub4_seq, stub5_itr, stub6_tgt;
        format_split = (function (text, size) {
            text = _pymeth_strip.call(text);
            if ((_pyfunc_equals(text[0], "-") && _pyfunc_equals(text[text.length -1], "-"))) {
                return _pyfunc_mult("-", size);
            } else if ((_pyfunc_equals(text[0], ":") && _pyfunc_equals(text[text.length -1], ":"))) {
                return (":" + (_pyfunc_mult("-", (size - 2)))) + ":";
            } else if (_pyfunc_equals(text[0], ":")) {
                return ":" + (_pyfunc_mult("-", (size - 1)));
            } else if (_pyfunc_equals(text[text.length -1], ":")) {
                return (_pyfunc_mult("-", (size - 1))) + ":";
            }
            return null;
        }).bind(this);

        rows = [];
        stub2_seq = _pymeth_split.call(table, "\n");
        if ((typeof stub2_seq === "object") && (!Array.isArray(stub2_seq))) {
            stub2_seq = Object.keys(stub2_seq);
        }
        for (stub3_itr = 0; stub3_itr < stub2_seq.length; stub3_itr += 1) {
            line = stub2_seq[stub3_itr];
            if (_pymeth_startswith.call(line, "|")) {
                line = _pymeth_strip.call(_pymeth_strip.call(line), "|");
                row = (function list_comprehenson () {var res = [];var text, iter0, i0;iter0 = _pymeth_split.call(line, "|");if ((typeof iter0 === "object") && (!Array.isArray(iter0))) {iter0 = Object.keys(iter0);}for (i0=0; i0<iter0.length; i0++) {text = iter0[i0];{res.push(_pymeth_strip.call(text));}}return res;}).apply(this);
                _pymeth_append.call(rows, row);
            }
        }
        console.log(rows);
        if (_pyfunc_equals(rows.length, 0)) {
            return table;
        }
        ncol = rows[0].length;
        nrow = rows.length;
        col_sizes = (function list_comprehenson () {var res = [];var i, iter0, i0;iter0 = _pyfunc_range(0, ncol, 1);if ((typeof iter0 === "object") && (!Array.isArray(iter0))) {iter0 = Object.keys(iter0);}for (i0=0; i0<iter0.length; i0++) {i = iter0[i0];{res.push(Math.max.apply(null, (function list_comprehenson () {var res = [];var j, row, iter0, i0;iter0 = _pyfunc_enumerate(rows);if ((typeof iter0 === "object") && (!Array.isArray(iter0))) {iter0 = Object.keys(iter0);}for (i0=0; i0<iter0.length; i0++) {j = iter0[i0][0]; row = iter0[i0][1];if (!((!_pyfunc_equals(j, 1)))) {continue;}{res.push(row[i].length);}}return res;}).apply(this)));}}return res;}).apply(this);
        res = [];
        stub4_seq = _pyfunc_enumerate(rows);
        if ((typeof stub4_seq === "object") && (!Array.isArray(stub4_seq))) {
            stub4_seq = Object.keys(stub4_seq);
        }
        for (stub5_itr = 0; stub5_itr < stub4_seq.length; stub5_itr += 1) {
            stub6_tgt = stub4_seq[stub5_itr];
            i = stub6_tgt[0]; row = stub6_tgt[1];
            if ((!_pyfunc_equals(i, 1))) {
                row_text = ("|" + (_pymeth_join.call("|", ((function list_comprehenson () {var res = [];var j, text, iter0, i0;iter0 = _pyfunc_enumerate(row);if ((typeof iter0 === "object") && (!Array.isArray(iter0))) {iter0 = Object.keys(iter0);}for (i0=0; i0<iter0.length; i0++) {j = iter0[i0][0]; text = iter0[i0][1];{res.push(_pymeth_center.call(text, (col_sizes[j] + 2)));}}return res;}).apply(this))))) + "|";
            } else {
                row_text = ("|" + (_pymeth_join.call("|", ((function list_comprehenson () {var res = [];var j, text, iter0, i0;iter0 = _pyfunc_enumerate(row);if ((typeof iter0 === "object") && (!Array.isArray(iter0))) {iter0 = Object.keys(iter0);}for (i0=0; i0<iter0.length; i0++) {j = iter0[i0][0]; text = iter0[i0][1];{res.push(format_split(text, col_sizes[j] + 2));}}return res;}).apply(this))))) + "|";
            }
            _pymeth_append.call(res, row_text);
        }
        return _pymeth_join.call("\n", res);
    }).bind(this);

    format_markdown_table = (function (event) {
        var cm, cursor, line, line_end, line_start, lineno, pos_end, pos_start, table, text;
        console.log(event);
        cm = Jupyter.notebook.get_selected_cell().code_mirror;
        cursor = cm.getCursor();
        lineno = cursor.line;
        line = cm.getLine(lineno);
        if ((_pyfunc_equals(_pymeth_strip.call(line), ""))) {
            return null;
        }
        while (true) {
            lineno=_pyfunc_add(lineno, 1)
            line = cm.getLine(lineno);
            if (((line === null) || (_pyfunc_equals(_pymeth_strip.call(line), "")))) {
                line_end = lineno - 1;
                break;
            }
        }
        lineno = cursor.line;
        while (true) {
            lineno -= 1;
            line = cm.getLine(lineno);
            if (((line === null) || (_pyfunc_equals(_pymeth_strip.call(line), "")))) {
                line_start = lineno + 1;
                break;
            }
        }
        pos_start = {"line": line_start, "ch": 0};
        pos_end = {"line": line_end, "ch": 1000000};
        text = cm.getRange(pos_start, pos_end);
        table = format_table(text);
        cm.replaceRange(table, pos_start, pos_end);
        return null;
    }).bind(this);

    main = (function () {
        var actions;
        actions = {format_markdown_table:{"help": "format markdown table", "key": "Alt-t", "handler": format_markdown_table}};
        register_actions(actions, "edit");
        return null;
    }).bind(this);

    return {"load_ipython_extension": main};
};

define(imports, load);
})()