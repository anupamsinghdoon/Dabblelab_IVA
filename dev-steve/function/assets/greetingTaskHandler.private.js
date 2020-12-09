const assets = Runtime.getAssets();
const autopilotHelper = require(assets['/autopilotHelper.js'].path);

// greeting handler function
const greetingTaskHandler = async (context, event, callback) => {
    let Say;
    let Prompt;
    let Listen = true;
    let Collect = false;
    let Remember = {};
    let Tasks = false;
    let Redirect = false;
    let Handoff = false;
  
    // Getting the real caller ID
    let callerID = event.UserIdentifier;
    // console.log(callerID);
    
    Remember.task_fail_counter = 0;
  
    if ( callerID ) {
      const userData = await getData(callerID, null);
      const { clientName } = userData;
  
      if ( userData && userData.clientName ) {
        Say = `Thank you for calling ${clientName}.
                Let me check your account using the phone number you are calling from. `;
  
        Remember.user_phone_number = callerID;
        Remember.userData = userData;
        
        Listen = false;
        Redirect = "task://phone_check";
  
      } else {
        Say = `Thank you for calling. 
                Let me check your account using the phone number you are calling from. `;
  
        Listen = false;
  
        Remember.user_phone_number = callerID;
  
        Redirect = 'task://phone_check';
      }
  
    } else {
      Say = `Thank you for calling. 
              Let me check your account using the phone number you are calling from. `;
  
      Prompt = `Please tell me the phone number associated with your account.`;
  
      Say += Prompt;
  
      Tasks = ['phone_check', 'agent_transfer'];
    }
  
    autopilotHelper.responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
  };