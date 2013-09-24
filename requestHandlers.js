var exec = require("child_process").exec;
function index(response, postData) {
  console.log("Request handler 'index' was called.");
  exec("ls -lah", function (error, stdout, stderr) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write(stdout);
    response.end();
  });
}

function vote(response, postData) {
	  console.log("Request handler 'vote' was called.");
	  try {
	    data = JSON.parse(postData);
	    response.writeHead(200, {"Content-Type": "text/plain"});
	    //Echo bach the postData for now
		response.write(postData);
		//Test with curl -d '{"vote": "a"}' -H "Content-Type: application/json" http://localhost:8000/vote
		console.log("Incoming vote: " + data['vote']);
		response.end();
	  } catch (err) {
		response.writeHead(400, {"Content-Type": "text/plain"});
		response.write("400 Bad Request");
		response.end();
	  }
}

exports.index = index;
exports.vote = vote;