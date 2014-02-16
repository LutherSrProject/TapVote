// GLOBAL PAGE VARIABLES //
pageTitle = "Page Not Found";


$(function setup() {
    $.ajaxSetup({
        async: true
    });
    $("#header").load("header.html");
    $("#footer").load("footer.html");
});

$(function guruMeditation() {

    var status = "404 Not Found";
    var url = window.location.href;
    var referer = document.referrer;

    var text = "Status: " + status + "\n";
    text = text + "Current URL: " + url + "\n";
    text = text + "Referer: " + referer + "\n";

    $(".guru-meditation-code").text(text);
});
