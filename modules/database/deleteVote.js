var Q = require("q");
var runQuery = require("./runQuery").runQuery;


var deleteVote = function (data, callback) {
    // data = {"questionId":5, "answerId":3}

    // TODO implement this
    callback(null, {"status":"success"});
};

exports.deleteVote = deleteVote;