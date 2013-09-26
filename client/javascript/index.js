$(document).ready(function() {
	$("#voter").submit(function(){
		$.post("/vote", function(data){console.log(data)}, { vote: "a" })
	})
})


