var pageTitle;

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
        async: true
    });
    $("#header").load("header.html");
    $("#footer").load("footer.html");

    var page = $.QueryString["p"];

    if(!page)
        $("#content").load("home.html", null, setTitle); // load home by default
    else
        $("#content").load(page + ".html", null, setTitle);

    function setTitle() {
        // set the page title. pageTitle is declared globally in site specific JS files
        // (if it isn't declared, just use "TapVote" as the title)
        if(!pageTitle) $("title").html("TapVote");
        else $("title").html(pageTitle + " - TapVote" )
    }

});
