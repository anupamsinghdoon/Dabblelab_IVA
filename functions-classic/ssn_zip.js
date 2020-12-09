exports.handler = function(context, event, callback) {
    
    let response = {result:-1,Message:"",cnt:0};

    var ZipCd = event.ZipCd;
    var SSNLastFour=event.SSNLastFour;
    var ssn_zip=event.ssn_zip;
    var counter=Number(event.counter);
    
    if (ZipCd.length > 5)
    {
        ZipCd = ZipCd.substring(0,5);
    }
      
     if (event.counter === undefined)
      counter = 0;
  
    counter=counter+1;
   
    response.cnt=counter;
    
    let Str_ssn_zip_Say = "";
    for (let i = 0; i < ssn_zip.length; i++) {
        Str_ssn_zip_Say +=Str_ssn_zip_Say===""?ssn_zip[i]:(" "+ssn_zip[i]);
    }
    //console.log("length"+ ssn_zip.length);
    if(ssn_zip.length===5)
    {
        if(ssn_zip==ZipCd)
        {
             response.result=1;
             response.Message="Thank you for validating your account with your ZIP code";
        }
        else
        {
             response.result=-1;
            response.Message="The Zip code "+ Str_ssn_zip_Say +" does not match the value in our database ";
        }
    }
    else if(ssn_zip.length===4)
    {
        if(ssn_zip==SSNLastFour)
        {
           response.result = 1;
          response.Message="Thank you for validating your account with the last four digits of your social security number";
        }
        else
        {
             response.result = -1;
            response.Message="The last four digits of your social security number "+ Str_ssn_zip_Say +" does not match the value in our database";
        }
    }
    else
    {
        if(ssn_zip.length === 0)
        {
             response.result = -1;
             response.Message = " You did not input any number ";
        }
        else
        {
             response.result = -1;
            response.Message=" Your input of "+Str_ssn_zip_Say +" is invalid ";
        }
        
        
    }
    
    if(response.result === -1 && counter>=2)
    {
        response.result = -99; // we want transfer call to an agent
    }
    
    //console.log(response.Message);
        
  callback(null, response);
};