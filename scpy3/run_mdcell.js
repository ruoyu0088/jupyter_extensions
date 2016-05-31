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
var _pymeth_join = function (x) { // nargs: 1
    if (this.constructor !== String) return this.join.apply(this, arguments);
    return x.join(this);  // call join on the list instead of the string.   
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
imports = ["base/js/namespace", "require", "base/js/events"];
load = function (Jupyter, require, events) {
    var main, nb, replace, run_md_cell;
    replace = (function (src, pattern, target) {
        return String.prototype.replace.bind(src)(pattern, target)
    }).bind(this);

    nb = Jupyter.notebook;
    run_md_cell = (function () {
        var callbacks, cell, code, dummy1_sequence, dummy2_iter, execute_reply_callback, md_code, options, output_callback, outputs, pattern, src;
        cell = nb.get_selected_cell();
        if ((!_pyfunc_equals(cell.cell_type, "markdown"))) {
            return null;
        }
        md_code = cell.get_text();
        pattern = new RegExp("\\n<pre class=\"scpy3-output\"><code>[\\s\\S]+</code></pre>");
        md_code = replace(md_code, pattern, "");
        console.log(md_code);
        outputs = [];
        execute_reply_callback = (function (msg) {
            var do_output;
            if ((_pyfunc_equals(msg.msg_type, "execute_reply") && _pyfunc_equals(msg.content.status, "ok"))) {
                do_output = (function () {
                    var output, target, to_replace;
                    to_replace = "```python\n" + src + "```";
                    output = _pymeth_join.call("\n", outputs);
                    target = "" + to_replace + "\n<pre class=\"scpy3-output\"><code>" + output + "</code></pre>";
                    cell.set_text(_pymeth_replace.call(md_code, to_replace, target));
                    cell.render();
                    return null;
                }).bind(this);

                window.setTimeout(do_output, 100);
            }
            return null;
        }).bind(this);

        output_callback = (function (msg) {
            if (_pyfunc_equals(msg.msg_type, "stream")) {
                _pymeth_append.call(outputs, msg.content.text);
            } else if (_pyfunc_equals(msg.msg_type, "execute_result")) {
                if (_pyfunc_truthy(_pyfunc_contains("text/plain", msg.content.data))) {
                    _pymeth_append.call(outputs, msg.content.data["text/plain"]);
                }
            }
            return null;
        }).bind(this);

        callbacks = {"shell": {"reply": execute_reply_callback}, "iopub": {"output": output_callback}};
        options = {"allow_stdin": false, "silent": false};
        dummy1_sequence = _pymeth_find.call(cell.element, "code.language-python").toArray();
        if ((typeof dummy1_sequence === "object") && (!Array.isArray(dummy1_sequence))) {
            dummy1_sequence = Object.keys(dummy1_sequence);
        }
        for (dummy2_iter = 0; dummy2_iter < dummy1_sequence.length; dummy2_iter += 1) {
            code = dummy1_sequence[dummy2_iter];
            src = jQuery(code).text();
            outputs = [];
            nb.kernel.execute(src, callbacks, options);
        }
        return null;
    }).bind(this);

    main = (function () {
        var action, actions, dummy3_sequence, key, km;
        actions = {run_md_cell:{"help": "run code in markdown cell", "icon": "fa-recycle", "help_index": "", "key": "Alt-r", "handler": run_md_cell}};
        km = Jupyter.keyboard_manager;
        dummy3_sequence = actions;
        for (key in dummy3_sequence) {
            if (!dummy3_sequence.hasOwnProperty(key)){ continue; }
            action = dummy3_sequence[key];
            km.actions.register(action, key, "scpy3");
            km.command_shortcuts.add_shortcut(action.key, "scpy3:" + key);
        }
        return null;
    }).bind(this);

    return {"load_ipython_extension": main};
};

define(imports, load);
})()