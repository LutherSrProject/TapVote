$(document).ready(function() {
    $('[name="best"]').click(function(event) {
        //put in variables
        $.ajax({
            type:"POST", 
            url:"/vote", 
            data:'{"answerId":"'+$(this).val()+'","questionId":"'+$(this).parent().attr("id")+'"}', 
            contentType: 'application/json',
            success: function(data) { console.log(data); },
            error: function(data) { console.log(data); }
		});
        event.preventDefault();
        return false; 
    });
});
//go to http://www.w3schools.com/jquery/jquery_traversing.asp for traversal help

