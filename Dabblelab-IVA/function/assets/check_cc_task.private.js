const assets = Runtime.getAssets();
const responseBuilder = require(assets['/response_builder.js'].path);
const validateCC = require(assets['/validate_cc.js'].path);

// check_cc handler function
const checkCCTaskHandler = async (context, event, callback) => {
  let Say;
  let Prompt;
  let Listen = true;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  const credit_card_num = Memory.twilio.collected_data.collect_cc.answers.credit_card_num.answer ||
                          event.Field_credit_card_num_Value || 
                          event.Field_credit_card_num_alt_Value;
  
  if ( credit_card_num ) {
    let { validCard, cardType } = validateCC(credit_card_num);
   
    if ( validCard && cardType !== 'american-express' ) {
      Say = `You said <say-as interpret-as='digits'>${credit_card_num}</say-as>. `;
      Prompt = `Is that correct?`;
    
      Say += Prompt;
      
      Remember.credit_card_num = credit_card_num;
      Remember.question = 'cc_check';
    
      Listen = true;
      Tasks=['yes_no', 'agent_transfer'];
    } else if ( validCard && cardType === 'american-express' ) {
      Say = `You provided an Amex card, we accept only Visa, Mastercard or Discover. `;
      Prompt = `Can you provide us with an accepted credit card?`;
    
      Say += Prompt;

      Remember.question = 'acceptable_cc';
    
      Listen = true;
      Tasks=['yes_no', 'agent_transfer'];
    } else {
      Say = `The card number you provided is not valid. `;
      Prompt = `Please provide a valid credit card number.`;
    
      Say += Prompt;
    
      Listen = true;
      Tasks=['check_cc', 'agent_transfer'];
    }
  } else {
    Say = false;
    Listen = false;
    Remember.from_task = event.CurrentTask;
    Redirect = 'task://fallback';
  }

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

module.exports = checkCCTaskHandler;