// usage: $.QueryString["param"]
(function($) {
    $.QueryString = (function(a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i) {
            var p=a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'))
})(jQuery);


// load the header, footer, content
$(function() {
    $.ajaxSetup({
        async: false
    });
    $("#header").load("header.html");
    $("#footer").load("footer.html");

    var page = $.QueryString["page"];

    if(!page) {
        // load home by default
        $("#content").load("home.html");
    } else {
        $("#content").load(page + ".html");
    }

});
