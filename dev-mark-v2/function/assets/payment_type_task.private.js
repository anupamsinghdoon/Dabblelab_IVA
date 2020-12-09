const assets = Runtime.getAssets();
const responseBuilder = require(assets['/response_builder.js'].path);

// payment_type handler function
const paymentTypeTaskHandler = async (context, event, callback) => {
  let Say;
  let Prompt;
  let Listen = true;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  const payment_type = event.Field_payment_type_Value;
  
  const userData = Memory.userData;
  const { userBalance } = userData;

  if ( payment_type ) {
    if ( payment_type  === 'full' ) {
      if ( Memory.payment_method === 'credit card' ) {
        Collect = {
          "name": "collect_cc",
          "questions": [
            {
              "question": `To pay the amount of ${userBalance} dollars, we will need your credit card information. Please say or use your telephone keypad to provide credit card number.`,
              "voice_digits": {
                "finish_on_key": "#",
                "num_digits": 16
              },
              "name": "credit_card_num",
              "type": "Twilio.NUMBER_SEQUENCE"
            }
          ],
          "on_complete": {
            "redirect": "task://check_cc"
          }
        };
        
        // Say = `To pay the amount of ${userBalance} dollars, we will need your credit card information. `;
        // Prompt = `Tell me the Credit Card number.`;
    
        Say = false;
        Listen = false;
        
        Remember.payment_type = 'full';
        Remember.payment_amount = userBalance;

      } else if ( Memory.payment_method === 'ACH' ) {
        Collect = {
          "name": "collect_routing",
          "questions": [
            {
              "question": `To pay the amount of ${userBalance} dollars, will need your Bank account information. Please say or use your telephone keypad to provide your bank routing number.`,
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
        // Say = `To pay the amount of ${userBalance} dollars, will need your Bank account information. `;
        // Prompt = `Tell me the routing number.`;
        Say = false;
        Listen = false;
        
        Remember.payment_type = 'full';
        Remember.payment_amount = userBalance;
      }
    } else if ( payment_type === 'partial' ) {
      Say = `You will now be asked to tell me the specific amount of your payment including both dollars and cents. `;
      Prompt = `Please tell me the payment amount now.`;

      Say += Prompt;
      
      Remember.payment_type = 'partial';

      Listen = true;
      Tasks=['partial_payment'];
    } else if ( payment_type === 'arrangement' ) {
      Say = `We can split the balance in half which will make your payments each at ${userBalance / 2} dollars. `;
      Prompt = `Would you like to set this up now? say yes to confirm or no to look at another option.`;

      Say += Prompt;
      
      Remember.payment_type = 'arrangement';
      Remember.question = 'split_balance';

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

module.exports = paymentTypeTaskHandler;