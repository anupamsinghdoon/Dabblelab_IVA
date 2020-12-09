const assets = Runtime.getAssets();
const responseBuilder = require(assets['/response_builder.js'].path);

// arrangement_payment handler function
const arrangementPaymentTaskHandler = async (context, event, callback) => {
  let Say;
  let Prompt;
  let Listen = true;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  const no_of_payments = event.Field_no_of_payments_Value;
  const payment_frequency = event.Field_payment_frequency_Value;
  const start_date = event.Field_start_date_Value;
  
  const userData = Memory.userData;
  const { userBalance } = userData;

  if ( no_of_payments && payment_frequency && start_date ) {
    Say = `You will make ${no_of_payments} payments ${payment_frequency}, starting from ${start_date}. `;
    Prompt = `Do you want to proceed?`;
  
    Say += Prompt;
    
    Remember.payment_amount = userBalance;
    Remember.no_of_payments = no_of_payments;
    Remember.payment_frequency = payment_frequency;
    Remember.start_date = start_date;
    Remember.question = 'payment_amount_check';
  
    Listen = true;
    Tasks=['yes_no', 'agent_transfer'];
  } else {
    Say = false;
    Listen = false;
    Remember.from_task = event.CurrentTask;
    Redirect = 'task://fallback';
  }

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

module.exports = arrangementPaymentTaskHandler;