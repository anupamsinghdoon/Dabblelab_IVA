// https://en.wikipedia.org/wiki/Luhn_algorithm

exports.handler = function(context, event, callback) {
	////let twiml = new Twilio.twiml.VoiceResponse();
	// twiml.say("Hello World");
	var identifier = event.CC;  // get the credit card number to check
	var sum = 0;
    var alt = false;
    var i = identifier.length - 1;
    var num;
    
    while (i >= 0)
    {
     num = parseInt(identifier.charAt(i), 10);  // take the i th number

        if (alt)  // check for every alternate number
        {
            num *= 2;  // multiply the number by 2
            if (num > 9) 
            {
                num = (num % 10) + 1; // eslint-disable-line no-extra-parens
            }
        }

        alt = !alt;  // every alternate number has to be squared

        sum += num;

        i--;
    }
    
    let r = sum % 10; // === 0;  // if r is zero then we have a valid CC number
    var br = -1;
    if (r===0)
      br=1;  // valid number
  
	callback(null, br);
};