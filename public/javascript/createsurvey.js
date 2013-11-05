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
    //sort this out
    mcQuestions = $("#multipleChoiceQ").children(".question");
    console.log(mcQuestions);
    for (i in mcQuestions){
    console.log(i);
        var question ={};
        question.question= i.val();
        var name = i.attr("id");
        alist= [];
        for (answer in $('.answer [name='+name+']')){
            alist.append(answer.val());
        question.answers = alist;
        questions.append(question)
        }
    }
    $.ajax({
            type:"POST", 
            url:"/vote", 
            data:'{"title":"'+title+'","questions":'+questions+', "password":'+password+'}', 
            contentType: 'application/json',
            success: function(data) { console.log(data); },
            error: function(data) { console.log(data); }
		});
        event.preventDefault();
        return false; 
  });
  
});