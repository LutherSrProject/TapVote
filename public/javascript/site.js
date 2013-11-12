// load the headers and footers
$(function() {
  $.ajaxSetup({
    async: false
  });
  $("#header").load("header.html");
  $("#footer").load("footer.html");
});
