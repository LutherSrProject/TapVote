// this should be used anytime we need to connect to the DB
var dbUser = process.env.TAPVOTE_DATABASE_USER;
if (!dbUser)
    dbUser = "postgres";
// if it's set in the environment, use that password. Otherwise, use "wearetapvote"
var dbPassword = process.env.TAPVOTE_DATABASE_PASSWORD;
if (!dbPassword)
    dbPassword = "wearetapvote";
var dbHost = process.env.TAPVOTE_DATABASE_HOST;
if (!dbHost)
    dbHost = "localhost";
var dbDatabase = process.env.TAPVOTE_DATABASE_DATABASE;
if (!dbDatabase)
    dbDatabase = "tapvote";

CONNSTRING = "postgres://" + dbUser + ":" + dbPassword + "@" + dbHost + "/" + dbDatabase;

var dbSessionUser = process.env.TAPVOTE_DATABASE_SESSION_USER; //suggested: nodepg
if (!dbSessionUser)
    dbSessionUser = dbUser;
var dbSessionPassword = process.env.TAPVOTE_DATABASE_SESSION_PASSWORD;
if (!dbSessionPassword)
    dbSessionPassword = dbPassword;
var dbSessionHost = process.env.TAPVOTE_DATABASE_SESSION_HOST;
if (!dbSessionHost)
    dbSessionHost = dbHost;
var dbSessionDatabase = process.env.TAPVOTE_DATABASE_SESSION_DATABASE;
if (!dbSessionDatabase)
    dbSessionDatabase = dbDatabase;


exports.dbUser = dbUser;
exports.dbPassword = dbPassword;
exports.dbHost = dbHost;
exports.dbDatabase = dbDatabase;
exports.dbSessionUser = dSessionbUser;
exports.dbSessionPassword = dbSessionPassword;
exports.dbSessionHost = dbSessionHost;
exports.dbSessionDatabase = dbSessionDatabase;
