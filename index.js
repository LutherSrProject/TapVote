var server = require("./server/server");
var router = require("./server/router");
var requestHandlers = require("./server/requestHandlers");

var handle = {}
handle["/"] = requestHandlers.index;
handle["/vote"] = requestHandlers.vote;

server.start(router.route, handle);
