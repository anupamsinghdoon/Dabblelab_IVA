exports.handler = function(context, event, callback) {
	
	var amt = event.enteredAmt;
	var fullbalance = parseFloat(event.fullBalance);
	var counter = Number(event.counter);
	
	
	let response = {  result:-1, err_msg:"", msg: "", Amount:0.00, fullBalance:0.00, AmtSelected:0.00, cnt:0};
	
	if (event.counter === undefined)
      counter = 0;
      
	counter = counter+1;
	response.cnt = counter;
	
	response.fullBalance = fullbalance.toFixed(2);
	
	
	amt = parseFloat(amt/100);
	
	response.Amount = amt.toFixed(2);

    if (amt <= 0)
    {
       response.err_msg = "you did not enter any amount,";
	   response.result = false; 
    }
    else if (amt < 5.00)
    {
	   response.err_msg = "you entered,,, $" + amt.toFixed(2) + " the minimum balance you can pay is $5.00 or more";
	   response.result = -1; // error
	}
	else if (amt > fullbalance)
	{
	   response.err_msg = "you entered,,, $" + amt.toFixed(2) + " it is more than the full balance amount of,,,$" + event.fullBalance;
	   response.result = -1;  // error
	}
	else
	{
	   response.msg = "you entered,,, $" + amt.toFixed(2);
	   response.AmtSelected = amt.toFixed(2);
	   response.result = 1; // success
    }
          
	if (response.result === -1 && counter === 3)
	    response.result = -99;  // go to an agent
	    
	callback(null, response);
};