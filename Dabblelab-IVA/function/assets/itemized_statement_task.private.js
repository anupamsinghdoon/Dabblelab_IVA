const assets = Runtime.getAssets();
const responseBuilder = require(assets['/response_builder.js'].path);

// itemized_statement handler function
const itemizedStatementTaskHandler = async (context, event, callback) => {
  let Say;
  let Prompt;
  let Listen = false;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  const userData = Memory.userData;
  const { namespace } = userData;

  if ( namespace === 'EBO' ) {
    Say = `Please say the mailing address you want the statements sent to.`;
    Remember.itemized_statement = true;
    Listen = true;
    Tasks = ['mailing_address', 'agent_transfer'];
  } else {
    Say = false;
    Listen = false;
    Remember.from_task = false;
    Redirect = 'task://fallback';
  }

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

module.exports = itemizedStatementTaskHandler;