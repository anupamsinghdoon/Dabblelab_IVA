exports.handler = function(context, event, callback) {
    
    let response = {result:-1,Message:"",cnt:0};

    var Keypressed = Number(event.pressed);
   
    var counter = Number(event.counter);
      
     if (event.counter === undefined)
      counter = 0;
  
    counter=counter+1;
   
    response.cnt=counter;
    
    console.log("event.pressed" + event.pressed);
    
    console.log("keypressed" + Keypressed);
    
    
    if(event.pressed === undefined)
    {
        response.result=-1;
        response.Message= "You did not make a selection";
        
    }
    else if(Keypressed >= 0 && Keypressed <= 5)
    {
       
             response.result=Keypressed;
    }
    else
    {
        response.result=-1;
        response.Message= "Your selection is not valid";
    }
    
    
    if(response.result === -1 && counter>=2)
    {
        response.result = -99; // we want transfer call to an agent
    }
    

        
  callback(null, response);
};