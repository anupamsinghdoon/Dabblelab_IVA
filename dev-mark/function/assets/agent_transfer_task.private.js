const assets = Runtime.getAssets();
const responseBuilder = require(assets['/response_builder.js'].path);

// agent_transfer handler function
const agentTransferHandler = async (context, event, callback) => {
  const Listen = false;
  const Remember = false;
  const Collect = false;
  const Tasks = false;
  const Redirect = false;
  const Handoff = false;

  const Memory = JSON.parse(event.Memory);

  const Say = `Please hold the line while I transfer you to an agent.`;

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

module.exports = agentTransferHandler;