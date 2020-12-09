const brnv = require('bank-routing-number-validator');

const assets = Runtime.getAssets();
const responseBuilder = require(assets['/response_builder.js'].path);

// check_routing_number handler function
const checkRoutingNumberTaskHandler = async (context, event, callback) => {
  let Say;
  let Prompt;
  let Listen = true;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  const routing_num = Memory.twilio.collected_data.collect_routing.answers.routing_num.answer ||
                      event.Field_routing_num_Value ||
                      event.Field_routing_num_alt_Value;

  if ( routing_num ) {
    const validRoutingNum = brnv.ABARoutingNumberIsValid(routing_num);

    if ( validRoutingNum ) {
      Say = `You said <say-as interpret-as='digits'>${routing_num}</say-as>. `;
      Prompt = `Is that correct?`;
    
      Say += Prompt;
      
      Remember.bank_acc_routing = routing_num;
      Remember.question = 'routing_check';
    
      Listen = true;
      Tasks=['yes_no', 'agent_transfer'];
    } else {
      Collect = {
        "name": "collect_routing",
        "questions": [
          {
            "question": `The routing number you provided is not valid. Please say or use your telephone keypad to provide a valid routing number.`,
            "voice_digits": {
              "finish_on_key": "#"
            },
            "name": "routing_num",
            "type": "Twilio.NUMBER_SEQUENCE"
          }
        ],
        "on_complete": {
          "redirect": "task://check_routing_number"
        }
      };
      // Say = `The routing number you provided is not valid. `;
      // Prompt = `Please provide a valid routing number.`;
    
      Say = false;
      Listen = false;
    }
  } else {
    Say = false;
    Listen = false;
    Remember.from_task = event.CurrentTask;
    Redirect = 'task://fallback';
  }

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

module.exports = checkRoutingNumberTaskHandler;