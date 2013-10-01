
function powerdata(req, response) {
    // curl -d '{"circuits": 1}' -H "Content-Type: application/json" http://localhost:8080/powerdata
    var data = req.body;
    var circuits = parseInt(data['circuits']);

    console.log(circuits);

    var datasets = {};

    for(var i=1; i<circuits+1; i++) {
        var circuit = {};
        circuit['label'] = "circuit"+i;
        circuit['data'] = [];
        circuit['dayTotals'] = []

        for(var j=1; j<8; j++) {
            jitter = 0
            dayTotal = 0
            for(var k=1; k<25; k++) {
                var x = j + jitter;
                var y = Math.floor((Math.random()*1000)+1);
                dayTotal = dayTotal + y;
                circuit['data'].push([x, y]);
                jitter = jitter + 0.04;
            }
            circuit['dayTotals'].push(dayTotal);
        }
        circuit['grandTotal'] = 0;
        for(var z=0; z<circuit['dayTotals'].length; z++) {
            circuit['grandTotal'] = circuit['grandTotal'] +  circuit['dayTotals'][z];
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

