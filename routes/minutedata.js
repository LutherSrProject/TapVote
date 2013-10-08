
function minutedata(req, response) {
    // curl -d '{"circuits": 1}' -H "Content-Type: application/json" http://localhost:8080/powerdata
    var data = req.body;
    var circuits = parseInt(data['circuits']);

    var circuitNames = ['north_office_outlets', 'microwave', 'hot water heater', 'sump pump', 
                        'washing machine', 'fridge', 'bedroom1', 'stove/oven'];
    var minutes = 200;
    var ind = Math.floor(Math.random() * circuitNames.length);

    datasets = {};

    for(var i=1; i<circuits+1; i++) {
        var circuit = {};

        if (ind >= circuitNames.length) { ind = 0; }
        circuit['label'] = circuitNames[ind];
        ind++;

        circuit['data'] = [];

        for(var d=1; d<minutes; d++) {
            var y = Math.floor((Math.random()*500)+1);
            circuit['data'].push(y);
        }


        datasets[circuit['label']] = circuit;
    }

    response.writeHead(200, {"Content-Type": "application/json", "Access-Control-Allow-Origin":"*"});
    
    console.log(JSON.stringify(datasets));
    
    response.write(JSON.stringify(datasets));
    response.end();

}




exports.minutedata = minutedata;

