var uuid = require('node-uuid');

exports.initSession = function(req,res,next){

    //Use virtual sessions based on origin. This grants us the same security as using tokens in each request, except we get it for free
    if (req.headers.origin) {
        if (req.session.virtualSessionByOrigin === undefined) {
            req.session.virtualSessionByOrigin = {};
        }
        if (req.session.virtualSessionByOrigin[req.headers.origin] === undefined) {
            req.session.virtualSessionByOrigin[req.headers.origin] = {};
        }
        req.virtualSession = req.session.virtualSessionByOrigin[req.headers.origin];
    } else if (req.headers.host) { //if orgin isn't specified, this is not a cross-orgin XHR, so fallback to host
        //not really better than a default session, but makes local dev debugging easier
        if (req.session.virtualSessionByOrigin === undefined) {
            req.session.virtualSessionByOrigin = {};
        }
        var thisOrigin = req.protocol + "://" + req.headers.host;
        if (req.session.virtualSessionByOrigin[thisOrigin] === undefined) {
            req.session.virtualSessionByOrigin[thisOrigin] = {};
        }
        req.virtualSession = req.session.virtualSessionByOrigin[thisOrigin];
    } else { //if neither the orgin nor host header is set, use a default session
        if (req.session.defaultVirtualSession === undefined) {
            req.session.defaultVirtualSession = {};
        }
        req.virtualSession = req.session.defaultVirtualSession;
    }
    if (req.virtualSession.uuid === undefined) {
        req.virtualSession.uuid = uuid.v4();
    }
    if (req.virtualSession.surveyAuthStatus === undefined) {
        req.virtualSession.surveyAuthStatus = {};
    }
    next();
}
