const assets = Runtime.getAssets();
const responseBuilder = require(assets['/response_builder.js'].path);

// goodbye handler function
const goodbyeTaskHandler = async (context, event, callback) => {
  const Say = 'Thanks for calling. Good bye.';
  const Listen = false;
  const Remember = false;
  const Collect = false;
  const Tasks = false;
  const Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

module.exports = goodbyeTaskHandler;