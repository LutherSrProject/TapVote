$(document).ready(function() {

    // Upon clicking one of the answer options, this function is called.
    // It sends the selected answer to the database.
    $('[name="best"]').click(function(event) {
        var answerId = $(this).val(),
        questionId = $(this).parent().attr("id");
        $.ajax({
            type:"POST", 
            url:"/vote", 
            data:'{"answerId":"' + answerId + '","questionId":"' + questionId + '"}', 
            contentType: 'application/json',
            success: function(data) { console.log(data); },
            error: function(data) { console.log(data); }
		});
        event.preventDefault();
        return false; 
    });
});


