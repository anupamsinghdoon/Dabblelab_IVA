const assets = Runtime.getAssets();
const responseBuilder = require(assets['/response_builder.js'].path);

// partial_payment handler function
const partialPaymentTaskHandler = async (context, event, callback) => {
  let Say;
  let Prompt;
  let Listen = true;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  const dollars = event.Field_dollars_Value;
  const cents = event.Field_cents_Value;
  
  const userData = Memory.userData;
  const { userBalance } = userData;
  
  if ( dollars && cents ) {
    const payment_amount = Number(dollars) + Number(cents) / 100;

    if ( payment_amount >= 5 && payment_amount <= userBalance ) {
      Say = `Your payment amount is ${payment_amount}. `;
      Prompt = `Do you want to proceed?`;
    
      Say += Prompt;
      
      Remember.payment_amount = payment_amount;
      Remember.question = 'payment_amount_check';
    
      Listen = true;
      Tasks=['yes_no', 'agent_transfer'];
    } else if ( payment_amount < 5 ) {
      Say = `Your payment amount is less than 5 US dollars, we accept only amount 5 US dollars or more. `;
      Prompt = `Do you want to provide a new amount?`;
    
      Say += Prompt;
      
      Remember.question = 'payment_amount_incorrect';
    
      Listen = true;
      Tasks=['yes_no', 'agent_transfer'];
    } else if ( payment_amount > userBalance ) {
      Say = `Your payment amount is more than your balance amount. `;
      Prompt = `Do you want to provide a new amount?`;
    
      Say += Prompt;
      
      Remember.question = 'payment_amount_incorrect';
    
      Listen = true;
      Tasks=['yes_no', 'agent_transfer'];
    }
  } else {
    Say = false;
    Listen = false;
    Remember.from_task = event.CurrentTask;
    Redirect = 'task://fallback';
  }

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

module.exports = partialPaymentTaskHandler;