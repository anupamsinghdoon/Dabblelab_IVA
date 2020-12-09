// See https://en.wikipedia.org/wiki/Routing_transit_number
exports.handler = function(context, event, callback) {
	
	var counter = Number(event.counter);
	var routing = event.RoutingNum;
	
	//console.log("routinh number: " + event.RoutingNum );
	
	let response = {  result:-1, err_msg:"", cnt:0};
	
	counter = counter+1;
	response.cnt = counter;
	
	let routingr_Say = "";
    for (let i = 0; i < routing.length; i++) {
        routingr_Say +=routingr_Say===""?routing[i]:(" "+routing[i]);
    }
    
    brnv = require('bank-routing-number-validator');
    
    if (brnv.ABARoutingNumberIsValid(routing))
       response.result = 1;
    else
        response.result = -1;
    
    //response.result = brnv.ABARoutingNumberIsValid(routing); 
    
    if (response.result === -1)
    {
        if (routing === "")
         response.err_msg = "You did not enter any routing number ";
        else
         response.err_msg = "The routing number " + routingr_Say + " is not valid ";
    }
    else
        response.err_msg = "The routing number " + routingr_Say + " is correct ";
        
    
    if (response.result === -1 && counter === 3)
	    response.result = -99;  // go to an agent
    
	callback(null, response);
};