exports.handler = function(context, event, callback) {
    let response = {returndata:""};
    
    var phone = event.phn;
    var account = event.acct;
    var checkcnd = event.cnd;
   
	if(checkcnd === "1")// phone number
	{
	    account="";
	    response.returndata=phone;
	    
	}
	else if(checkcnd === "-1")
	{
	    phone="";
	    response.returndata=account;
	}
	else
	{
	    response.returndata="NA";
	}
	
	
      
	callback(null, response);
};