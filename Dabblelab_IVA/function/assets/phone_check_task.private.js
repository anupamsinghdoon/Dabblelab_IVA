const assets = Runtime.getAssets();
const responseBuilder = require(assets['/response_builder.js'].path);
const { getData } = require(assets['/api_requests.js'].path);

// phone_check handler function
const phoneCheckTaskHandler = async (context, event, callback) => {
  let Say;
  let Prompt;
  let Listen = true;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  const userPhoneNumber =  Memory.user_phone_number || event.Field_PhoneNumber_Value;

  if ( userPhoneNumber ) {
    const userData = Memory.userData || await getData(userPhoneNumber, null);
    const { accountStatus, accountNumber, userName } = userData;
    
    Remember.userData = userData;

    if ( accountStatus && accountStatus === 'active' ) {
      Say = ``;
      Prompt = `Is your name ${userName}?`;

      Say += Prompt;
      
      Remember.question = 'name_check';
      
      Listen = true;
      Tasks = ['yes_no', 'agent_transfer'];

    } else if ( accountStatus && accountStatus === 'inactive' ) {
      Say = `The account associated with ${userPhoneNumber}, is not active. `;
      Prompt = `Do you need additional assistance?`;

      Remember.question = 'additional_help';

      Say += Prompt;
      Listen = true;

    } else if ( accountStatus === false ) {
      Say = `We are not able to find your account using the phone number you are calling from. `;
      Prompt = `Please say your Account Number located in the upper right corner of the letter, starting with the first numerical digit.`;

      Say += Prompt;
      Listen = true;
      Tasks = ['account_check', 'agent_transfer'];
    }
  } else {
    Say = false;
    Listen = false;
    Remember.from_task = event.CurrentTask;
    Redirect = 'task://fallback';
  }

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

module.exports = phoneCheckTaskHandler;