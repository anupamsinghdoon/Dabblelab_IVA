exports.handler = function(context, event, callback) {
	let response = {NameSpace:"",ClientName:"",WebPaymentAddress:"",MailingAddress:"",Host:"",TransferAgentNumber:"",ErrorMessage:""};

	var TFN = event.Tfn;
	
	if (event.Tfn === undefined)
	{
	    response.ErrorMessage="we are not getting tfn";
	}
	
	var jsonObj = `{ "d": {
     "results": [
      {
          "TFN":"17542199132",
          "NameSpace":"RED",
          "ClientName":"Dish Network",
          "WebPaymentAddress":"dish.com",
          "MailingAddress":"Dish Network Palatine IL 60055-0063",
          "Host":"FACS",
          "TransferAgentNumber":"+15005550001" 
          
      },
    
    {
          "TFN": "1222222222",
          "NameSpace":"SON",
          "ClientName":"Dish Network",
          "WebPaymentAddress":"dish.com",
          "MailingAddress":"Dish Network Palatine IL 60055-0063",
          "Host":"FACS",
          "TransferAgentNumber":"+15005550001"  
    }
      ]
}}`;


var list = JSON.parse(jsonObj);
//console.log(list.d.results[1].TFN);
console.log(list.d.results.length);

for (let index = 0; index < list.d.results.length; index++)
{
    
    var a=list.d.results[index].TFN;
    console.log(TFN+" "+ a);
    
    if(TFN === a)
    {
         response.NameSpace = list.d.results[index].NameSpace;
          response.ClientName = list.d.results[index].ClientName;
           response.WebPaymentAddress = list.d.results[index].WebPaymentAddress;
            response.MailingAddress = list.d.results[index].MailingAddress;
             response.Host = list.d.results[index].Host;
              response.TransferAgentNumber = list.d.results[index].TransferAgentNumber;
               
    //console.log(list.d.results[index].TFN);
    }
}

	callback(null, response);
	



};