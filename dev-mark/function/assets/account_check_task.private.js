const assets = Runtime.getAssets();
const responseBuilder = require(assets['/response_builder.js'].path);
const { getData } = require(assets['/api_requests.js'].path);

// account_check handler function
const accountCheckTaskHandler = async (context, event, callback) => {
  let Say;
  let Prompt;
  let Listen = true;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  const accountNumber = event.Field_AccountNumber_Value;

  if ( accountNumber ) {

    const userData = await getData(null, accountNumber);
    const { accountStatus, userName } = userData;

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

      Say += Prompt;

      Remember.question = 'additional_help';

      Listen = true;
    } else if ( accountStatus === false ) {
      Say = `The account number you provided, ${accountNumber} is not valid. `;
      Prompt = `Please say or enter your account number again.`;

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

module.exports = accountCheckTaskHandler;