const assets = Runtime.getAssets();
const responseBuilder = require(assets['/response_builder.js'].path);

// repeat handler function
const repeatHandler = async (context, event, callback) => {
  let Say;
  let Prompt;
  let Listen = true;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  if ( Memory.repeat === true ) {
    Say = Memory.repeat_params.say;
    Listen = true;
    Tasks = Memory.repeat_params.tasks;
  } else {
    Say = false;
    Listen = false;
    Remember.from_task = false;
    Redirect = 'task://fallback';
  }

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

module.exports = repeatHandler;