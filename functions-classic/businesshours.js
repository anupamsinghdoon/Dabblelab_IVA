exports.handler = function(context, event, callback) {
    // With timezone:
    // In Functions/Configure, add NPM name: moment-timezone, version: 0.5.14
    // Timezone function reference: https://momentjs.com/timezone/
    let moment = require("moment-timezone");
   
    // timezone needed for Daylight Saving Time adjustment
    let timezone = event.timezone; //|| 'America/Los_Angeles';
    console.log("+ timezone: " + timezone);
    //
    const hour = moment().tz(timezone).format('H');
    const minute = moment().tz(timezone).format('m');
    const dayOfWeek = moment().tz(timezone).format('d');
    if ((hour >= 9 && hour < 17) && (dayOfWeek >= 1 && dayOfWeek <= 5)) {
        response = "open";
    } else {
        response = "after";
    }
    theResponse = response + " : Hour= " + hour +":" + minute +  " : DayOfWeek= " + dayOfWeek;
    
    console.log("+ Time request: " + theResponse);
    callback(null, theResponse);
    //callback(null, timezone);
    
    //let kk = "EVENT: \n" + JSON.stringify(event, null, 2);
    //kk = kk + " " + "abc";
    let kk = "{" + "\n";
    kk = kk + "Key2: " + event.Key2 + "\n";
    kk = kk + "timezone:  " + event.timezone + "\n";
    kk = kk + "}";
    
    callback(null, kk);
};