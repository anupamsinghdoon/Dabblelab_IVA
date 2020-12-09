const assets = Runtime.getAssets();
const responseBuilder = require(assets['/response_builder.js'].path);

// check_payment_method handler function
const checkPaymentMethodTaskHandler = async (context, event, callback) => {
  let Say;
  let Prompt;
  let Listen = true;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  const payment_method = event.Field_payment_method_Value;
  
  const userData = Memory.userData;
  const { userBalance } = userData;
  
  if ( payment_method ) {
    if ( payment_method === 'credit card' ) {
      Say = `You chose to pay with a credit card. `;
      Prompt = `To pay your balance, in full of ${userBalance} dollars say "Pay Full". 
                To make a payment in an amount less than the full balance of ${userBalance} dollars, say "Pay Partial".
                To make a payment arrangement, say "Arrangement". 
                To repeat say "repeat"`;

      Say += Prompt;

      Remember.payment_method = 'credit card';
      Remember.repeat = true;
      Remember.repeat_params = {
        say: Prompt,
        tasks: ['payment_type', 'agent_transfer', 'repeat']
      };

      Listen = true;
      Tasks=['payment_type', 'agent_transfer', 'repeat'];
    } else if ( payment_method  === 'ACH' ) {
      Say = `You chose to pay with ACH. `
      Prompt = `To pay your balance, in full of ${userBalance} dollars say "Pay Full". 
                To make a payment in an amount less than the full balance of ${userBalance} dollars, say "Pay Partial".
                To make a payment arrangement, say "Arrangement". 
                To repeat say "repeat"`;

      Say += Prompt;
      
      Remember.payment_method = 'ACH';
      Remember.repeat = true;
      Remember.repeat_params = {
        say: Prompt,
        tasks: ['payment_type', 'agent_transfer', 'repeat']
      };

      Listen = true;
      Tasks=['payment_type', 'agent_transfer', 'repeat'];
    }
  } else {
    Say = false;
    Listen = false;
    Remember.from_task = event.CurrentTask;
    Redirect = 'task://fallback';
  }

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

module.exports = checkPaymentMethodTaskHandler;