const valid = require('card-validator');

const assets = Runtime.getAssets();
const responseBuilder = require(assets['/response_builder.js'].path);

// check_exp_date handler function
const checkExpDateTaskHandler = async (context, event, callback) => {
  let Say;
  let Prompt;
  let Listen = true;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  const exp_date = Memory.twilio.collected_data.collect_exp_date.answers.cc_exp_date.answer ||
                    event.Field_exp_date_Value;

  if ( exp_date ) {
    const formatted_date = exp_date.split('-')[1] + '-' + exp_date.split('-')[0];
    const validDate = valid.expirationDate(formatted_date);

    if ( validDate ) {
      Say = `You said <say-as interpret-as="date" format="my">${formatted_date}</say-as>. `;
      Prompt = `Is that correct?`;
    
      Say += Prompt;
      
      Remember.credit_card_exp_date = formatted_date;
      Remember.question = 'exp_date_check';
    
      Listen = true;
      Tasks=['yes_no', 'agent_transfer'];
    } else {
      Say = `The expiration date you provided is not valid. `;
      Prompt = `Please provide a valid expiration date.`;
    
      Say += Prompt;
    
      Listen = true;
      Tasks=['check_exp', 'agent_transfer'];
    }
  } else {
    Say = false;
    Listen = false;
    Remember.from_task = event.CurrentTask;
    Redirect = 'task://fallback';
  }

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

module.exports = checkExpDateTaskHandler;