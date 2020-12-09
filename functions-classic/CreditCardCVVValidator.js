exports.handler = function(context, event, callback) {
	
	var CC_CVV = event.CVV;
	var counter = Number(event.counter);
	
	
	let response = {  result:-1, Card_CVV: "", Card_CVV_Say: "", Err_Msg_Say: "", cnt:0};
	
	let Str_CC_CVV_Say = "";
    for (let i = 0; i < CC_CVV.length; i++) {
        Str_CC_CVV_Say +=Str_CC_CVV_Say===""?CC_CVV[i]:(" "+CC_CVV[i]);
    }
    
    if (event.counter === undefined)
      counter = 0;
      
    counter = counter + 1;
    //console.log("counter: " + counter);
    
    if (CC_CVV.length === 0)
    {
       response.result = -1;  // error
	   response.Err_Msg_Say = "you have not entered any C,V,V, number, ";
    }
    else if (CC_CVV.length === 3)
    {
	
	    //var valid = require("card-validator");
	    
	    //var dtValid = valid.expirationDate(CC_Date);
	    
	     response.result = 1;  //success
	    response.Err_Msg_Say = "";
	    
    }
    else
    {
        response.result = -1; //error
        response.Err_Msg_Say = "The C,V,V, you entered " + Str_CC_CVV_Say + " is not correct, ";
        
    }
	
	if (response.result === -1 && counter === 2)
	    response.result = -99;  // go to an agent
	

	response.Card_CVV = CC_CVV;
	response.cnt = counter;
	response.Card_CVV_Say = Str_CC_CVV_Say;
	
	callback(null, response);
};