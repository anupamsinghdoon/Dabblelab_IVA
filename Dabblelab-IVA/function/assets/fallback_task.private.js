const assets = Runtime.getAssets();
const responseBuilder = require(assets['/response_builder.js'].path);

// fallback handler function
const fallbackHandler = async (context, event, callback) => {
  let Say = false;
  let Listen = true;
  let Remember = {};
  let Collect = false;
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  console.log('Fallback Triggered.');

  const Memory = JSON.parse(event.Memory);

  Remember.task_fail_counter = Memory.task_fail_counter + 1;

  if ( Memory.task_fail_counter > 2 ) {
    Say = false;
    Listen = false;
    Remember.task_fail_counter = 0;
    Redirect = 'task://agent_transfer';
  } else {
    Say = `I'm sorry, I didn't quite get that. Please say that again.`;
    Listen = true;

    if ( Memory.from_task ) {
      Tasks = [Memory.from_task, 'agent_transfer'];
    }
  }

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

module.exports = fallbackHandler;