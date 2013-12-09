// GLOBAL PAGE VARIABLES //
pageTitle = "Page Not Found";


$(function guruMeditation() {
    var status = "404 Not Found";
    var url = window.location.href;
    var referrer = document.referrer;

    var text = "Status: " + status + "\n";
    text = text + "Current URL: " + url + "\n";
    text = text + "Referrer: " + referrer + "\n";

    $(".guru-meditation-code").text(text);
});
