const assets = Runtime.getAssets();
const responseBuilder = require(assets['/response_builder.js'].path);

// mailing_address handler function
const mailingAddressTaskHandler = async (context, event, callback) => {
  let Say;
  let Prompt;
  let Listen = false;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  const mailingAddress =  event.Field_mailing_address_Value;

  const userData = Memory.userData;
  const { namespace } = userData;

  if ( mailingAddress && namespace === 'EBO' ) {
    Say = `Your documents will be mailed to ${mailingAddress}.`;
    Redirect = 'task://goodbye';
  } else {
    Say = false;
    Listen = false;
    Remember.from_task = false;
    Redirect = 'task://fallback';
  }

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

module.exports = mailingAddressTaskHandler;