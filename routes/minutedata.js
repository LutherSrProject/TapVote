
function minutedata(req, response) {
    // curl -d '{"circuits": 1}' -H "Content-Type: application/json" http://localhost:8080/powerdata
    var data = req.body;
    var circuits = parseInt(data['circuits']);

    var circuitNames = ['north_office_outlets', 'microwave', 'hot water heater', 'sump pump', 
                        'washing machine', 'fridge', 'bedroom1', 'stove/oven'];
    var minutes = 200;
    var circuit = {};

    circuit['data'] = [];

    for(var d=1; d<minutes; d++) {
        var y = Math.floor((Math.random()*500)+1);
        circuit['data'].push([d,y]);
    }

    response.writeHead(200, {"Content-Type": "application/json", "Access-Control-Allow-Origin":"*"});
    
    console.log(JSON.stringify(circuit));
    
    response.write(JSON.stringify(circuit));
    response.end();

}

exports.minutedata = minutedata;

