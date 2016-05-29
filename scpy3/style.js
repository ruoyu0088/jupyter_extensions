(function(){
var imports, load;
imports = ["base/js/namespace", "require"];
load = function (Jupyter, require) {
    var load_css, main;
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
        return null;
    }).bind(this);

    return {"load_ipython_extension": main};
};

define(imports, load);
})()