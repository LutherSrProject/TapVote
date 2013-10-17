$(document).ready(function() {
    $('[name="best"]').click(function(event) {
        $.ajax({
            type:"POST", 
            url:"/vote", 
            data:'{"vote":"'+ $(this).val()+'"}', 
            contentType: 'application/json',
            success: function(data) { console.log(data); },
            error: function(data) { console.log(data); }
		});
        event.preventDefault();
        return false; 
    });
});

