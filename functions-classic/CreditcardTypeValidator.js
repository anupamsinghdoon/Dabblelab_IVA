exports.handler = function(context, event, callback) {
	
	var CC = event.CC;
	var counter = Number(event.counter);
	
	var cardType;
	
	let response = {  result:-1, cardType:"", Card_Number: "", Card_Number_Say: "", Err_Msg_Say: "", cnt:0};
	
	let Str_CC_Number_Say = "";
    for (let i = 0; i < CC.length; i++) {
        Str_CC_Number_Say +=Str_CC_Number_Say===""?CC[i]:(" "+CC[i]);
    }
    
    if (event.counter === undefined)
      counter = 0;
      
    counter = counter + 1;
    //console.log("counter: " + counter);
	
try {
	var valid = require("card-validator");
    
    var numberValidation = valid.number(CC);
    
    if (numberValidation.isValid)
      response.result = 1;  //success
    else
      response.result = -1;  //failure
     
    //console.log(numberValidation.isValid);
     
    cardType = numberValidation.card.type;
   // console.log(numberValidation.card.type); // 'visa'
    
    
}
catch(err)
{
	 isValid = false;
	 cardType= "unknown";
}

    var say_err_msg = "";
    
    if (CC.length === 0)
    {
       say_err_msg = say_err_msg + "you did not enter any credit card number, ";
       response.result = -1;  //failure
    }
    else if (!(cardType === "discover" || cardType === "mastercard" || cardType === "visa"))
    {
       say_err_msg = say_err_msg + "This card is " + cardType + ", we only accept discover, mastercard or visa,, Please enter your card number again.";
       response.result = -1;  //failure
    }
    else if (response.result === -1)
    {
       say_err_msg = say_err_msg + "The card number you entered is not correct. you entered " + Str_CC_Number_Say + ",,,Please enter you card number again.";
       response.result = -1;  //failure
    }
	
	if (response.result === -1 && counter === 4)
	    response.result = -99;  // go to an agent
	    
	response.cardType = cardType;
	response.Card_Number = CC;
	response.Card_Number_Say = Str_CC_Number_Say;
	response.Err_Msg_Say = say_err_msg;
	response.cnt = Number(counter);
	
	
	callback(null, response);
};