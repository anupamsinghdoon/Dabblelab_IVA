/**
 * response-builder function
 * @Say {string}             // message to speak out
 * @Listen {boolean}         // keep session true or false
 * @Remember {object}        // save data in remember object
 * @Collect {object}         // collect data in a dialogue
 * @Redirect {object}        // Redirect to another task or function
 * @callback {function}      // return twilio function response
 * */
const responseBuilder = (Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback) => {
    let responseObject = {
      actions: [],
    };
  
    if (Say) {
      responseObject.actions.push({
        say: {
          speech: Say,
        },
      });
    }
  
    if (Listen) {
      if (Tasks) {
        responseObject.actions.push({
          listen: {
            tasks: Tasks,
          },
        });
      } else {
        responseObject.actions.push({
          listen: true,
        });
      }
    }
  
    if (Remember) {
      responseObject.actions.push({
        remember: Remember,
      });
    }
  
    if (Collect) {
      responseObject.actions.push({
        collect: Collect,
      });
    }
  
    if (Redirect) {
      responseObject.actions.push({
        redirect: Redirect,
      });
    }
  
    if (Handoff) {
      if (Handoff.type === 1) {
        responseObject.actions.push({
          handoff: {
            channel: 'voice',
            uri: Handoff.twiml_url,
            method: 'POST',
          },
        });
      } else if (Handoff.type === 2) {
        responseObject.actions.push({
          handoff: {
            channel: 'voice',
            uri: Handoff.task_router_url,
            wait_url: Handoff.wait_url,
            wait_url_method: Handoff.wait_url_method,
          },
        });
      }
    }
  
    // return twilio function response
    callback(null, responseObject);