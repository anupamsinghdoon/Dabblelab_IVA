exports.handler = function(context, event, callback) {

    let response = {result:""};
     var accountnumber=event.CARDNO;
     
     var returnact=accountnumber.substring((accountnumber.length-4),accountnumber.length);
     
     let Str_actt = "";
     for (let i = 0; i < returnact.length; i++) {
         Str_actt +=returnact===""?returnact[i]:(" "+returnact[i]);
     }
     response.result=Str_actt;
     callback(null, response);
 };