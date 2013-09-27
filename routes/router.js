var nstatic = require('node-static');

var fileServer = new nstatic.Server('./client');

function route(handle, pathname, request, response, postData) {
    console.log("About to route a request for " + pathname);
    if (typeof handle[pathname] === 'function') {
        handle[pathname](response, postData);
    } else {
        console.log("No request handler found for " + pathname + ", attempting to serve static file.");
        fileServer.serve(request, response);
    }
}

exports.route = route;

