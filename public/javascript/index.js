$(document).ready(function() {
    $("#voter").submit(function(event) {
        $.ajax({
            type:"POST", 
            url:"/vote", 
            data:'{"vote": "a"}', 
            success: function(data) { console.log(data); },
            error: function(data) { console.log(data); }
		});
        event.preventDefault();
        return false; 
    });
});

