exports.handler = function(context, event, callback) {
    
    let response = {result:-1,err_msg:"", accNumSay:"", cnt:0};
    
    var counter =Number(event.counter);
    var AccountNumber=event.acct;
    
    if(event.Returns === undefined)
    {
        event.Returns=-1;
    }
    
    var status=Number(event.Returns);
    
    if (event.counter === undefined)
      counter = 0;

    counter=counter+1;
    response.cnt=counter;
 
 //console.log("Account values"+AccountNumber);
 let actnumber_Say = "";
 
    for (let i = 0; i < AccountNumber.length; i++) 
    {
        actnumber_Say +=actnumber_Say===""?AccountNumber[i]:(" "+AccountNumber[i]);
    }
    
    response.accNumSay = actnumber_Say;
    
    if(status===1)
    {
      response.result=1;
    }
    else
    {
        response.result=-1;
        if(Number(AccountNumber)===0)
        {
            response.err_msg="You did not enter any account number ";
        }
        else
        {
            response.err_msg="The account number you entered "+actnumber_Say+" is not valid ";
        }
    }
    
    if(response.result===-1 && counter>=2)
    {
        response.result=-99; // we want to transfer the call to an agent
    }
    
    
    
    
  callback(null, response);
};