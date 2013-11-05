$(document).ready(function()  {
  $('[name="createQuestion"]').click(function(event){
//Make this stuff actually match our app.
    //var counter = 1;
    //var limit = 3;
    //function addInput(divName){
         //if (counter == limit)  {
              //alert("You have reached the limit of adding " + counter + " inputs");
         //}
         //else {
              //var newdiv = document.createElement('div');
              //newdiv.innerHTML = "Entry " + (counter + 1) + " <br><input type='text' name='myInputs[]'>";
              //document.getElementById(divName).appendChild(newdiv);
              //counter++;
         //}
    //}
    return false;
  });
  
  $('[name="createSurvey"]').click(function(event){
    var title, questions, password, mcQuestions;
    title = $("#title").val();
    password = $("#adminPwd").val();
    questions = [];
    mcQuestions = $("#multipleChoiceQ").find(".question");
    $.each(mcQuestions, function(i, val){
        var wrapped = $(val);
        var question ={};
        question.question= wrapped.val();
        var name = wrapped.attr("id");
        var alist= [];
        $.each($('.answer[name='+name+']'), function(idx, v){
            var answer = $(v);
            alist[idx]=(answer.val());
        });
        question.answers = alist;
        questions[i]= question;
    });
    
    $.ajax({
            type:"POST", 
            url:"/createSurvey", 
            data:'{"title":"'+title+'","questions":'+JSON.stringify(questions)+', "password":"'+password+'"}', 
            contentType: 'application/json',
            success: function(data) { console.log(data); },
            error: function(data) { console.log(data); }
		});
        event.preventDefault();
        return false; 
  });
  
});