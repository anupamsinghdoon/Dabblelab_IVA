const assets = Runtime.getAssets();
const responseBuilder = require(assets['/response_builder.js'].path);

// collect_fallback handler function
const collectFallbackTaskHandler = async (context, event, callback) => {
  const Say = `Looks like you having trouble. Apologies for that. Let's start again, how can I help you today?`;
  const Listen = true;
  let Remember = {};
  const Collect = false;
  const Tasks = false;
  const Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

module.exports = collectFallbackTaskHandler;