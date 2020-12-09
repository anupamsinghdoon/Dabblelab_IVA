exports.handler = function(context, event, callback) {
	var digitpressed = Number(event.digitPressed);
	var counter = Number(event.counter);
	
	//console.log(event.digitPressed);
	
	//console.log(digitpressed);
	
	//console.log(event.counter);
	
	let response = {  result:false, err_msg:"", Agent_msg: "", digitpressed: 0, cnt:0};
	
	counter = counter+1;
	response.cnt = counter;
	
	response.digitpressed = digitpressed;
	

    if (digitpressed > 2 || digitpressed === 0)
    {
       if (digitpressed > 2)
	        response.err_msg = "you pressed, " + digitpressed + " , that is not a valid selection, ";
	   else
	        response.err_msg = "you did not make a selection, ";
	     
	   response.result = false;
	}
	
	if (counter > 2)
	     response.Agent_msg = response.Agent_msg + " to talk to an agent press 0, ";
	
	  
	callback(null, response);
};