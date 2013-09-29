
function powerdata(req, response) {
    // curl -d '{"circuits": 1}' -H "Content-Type: application/json" http://localhost:8080/powerdata
    var data = req.body;
    var circuits = data['circuits'];
    
    var datasets = {};

    for(var i=0; i<circuits; i++) {
        var circuit = {};
        circuit['label'] = "circuit"+i;
        circuit['data'] = [];

        for(var j=1; j<8; j++) {
            for(var k=1; k<8; k++) {
                var x = parseFloat(j.toString() + "." + k.toString());
                var y = Math.floor((Math.random()*1000)+1);
                circuit['data'].push([x, y]);
            }
        }
        datasets[circuit['label']] = circuit;
    }
    
    //console.log(JSON.stringify(datasets, null, 3));

    response.writeHead(200, {"Content-Type": "application/json", "Access-Control-Allow-Origin":"*"});
    //response.write("200 OK" + "\n");
    response.write(JSON.stringify(datasets));
    response.end();

}




exports.powerdata = powerdata;

