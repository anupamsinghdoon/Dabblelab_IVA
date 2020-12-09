exports.handler = function(context, event, callback) {
	var CC_Date = event.CCDate;
	var counter = Number(event.counter);
	
	
	let response = {  result:-1, Card_Date: "", Card_Date_Say: "", Err_Msg_Say: "", cnt:0};
	
	let Str_CC_Date_Say = "";
    for (let i = 0; i < CC_Date.length; i++) {
        Str_CC_Date_Say +=Str_CC_Date_Say===""?CC_Date[i]:(" "+CC_Date[i]);
    }
    
    if (event.counter === undefined)
      counter = 0;
      
    counter = counter + 1;
    //console.log("counter: " + counter);
    
    if (CC_Date.length === 0)
    {
       response.result = -1; //error
	   response.Err_Msg_Say = "you have not entered any date, ";
    }
    else if (CC_Date.length === 4)
    {
	
	    var valid = require("card-validator");
	    
	    var dtValid = valid.expirationDate(CC_Date);
	    
	    if (dtValid.isValid)
	        response.result = 1; //success
	    else
	        response.result = -1; //error
	      
	    
	   if (dtValid.isValid)
	    {
	        response.Err_Msg_Say = "";
	    }
	   else
	   {
	        response.Err_Msg_Say = "The date you entered " + Str_CC_Date_Say + " is not correct, ";
	   }
    }
    else
    {
        response.result = -1; //error
        response.Err_Msg_Say = "The date you entered " + Str_CC_Date_Say + " is not correct, ";
        
    }
	
	if (response.result === -1 && counter === 3)
	    response.result = -99;  // go to an agent
	
	response.Card_Date = CC_Date;
	response.cnt = counter;
	response.Card_Date_Say = Str_CC_Date_Say;
	
	callback(null, response);
};