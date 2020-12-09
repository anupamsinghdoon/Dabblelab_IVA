const assets = Runtime.getAssets();
const responseBuilder = require(assets['/response_builder.js'].path);

// provide_info handler function
const provideInfoTaskHandler = async (context, event, callback) => {
  let Say;
  let Prompt;
  let Listen = true;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  const infoType = event.Field_info_type_Value;

  const userData = Memory.userData;
  const { onlineUrl, mailAddress } = userData;

  if ( infoType ) {
    if ( infoType === 'online' ) {
      Say = `To make a payment online please visit ${onlineUrl}. `;
      Prompt = `To make a payment using credit card say "credit card", 
                to make a payment using ACH say "ACH", 
                to speak to a Representative say "Representative" or "Agent".`;

      Say += Prompt;
    } else if ( infoType === 'mail' ) {
      Say = `You can mail in a check at the following address, ${mailAddress}. `;
      Prompt = `To make a payment using credit card say "credit card", 
                to make a payment using ACH say "ACH", 
                to speak to a Representative say "Representative" or "Agent".`;

      Say += Prompt;
    }
  } else {
    Say = false;
    Listen = false;
    Remember.from_task = event.CurrentTask;
    Redirect = 'task://fallback';
  }

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

module.exports = provideInfoTaskHandler;