// GOBAL PAGE VARIABLES //
pageTitle = "Home";

$(document).ready(function() {
    $("#voter").submit(function(event) {
        $.ajax({
            type:"POST", 
            url:"/vote", 
            data:'{"vote": "a"}', 
            contentType: 'application/json',
            success: function(data) { console.log(data); },
            error: function(data) { console.log(data); }
		});
        event.preventDefault();
        return false; 
    });
});

