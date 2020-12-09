const assets = Runtime.getAssets();
const responseBuilder = require(assets['/response_builder.js'].path);

// yes_no handler function
const yesNoHandler = async (context, event, callback) => {
  // console.log(event);
  let Say;
  let Prompt = '';
  let Tasks = false;
  let Remember = {};
  let Redirect = false;
  let Listen = false;
  let Collect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  console.log(event.Field_yes_no_Value);

  switch ( Memory.question ) {
    case 'name_check':
      if (event.Field_yes_no_Value === 'Yes') {
        Collect = {
          "name": "collect_digits",
          "questions": [
            {
              "question": `For your account verification say 5 digits of your Zip code or last 4 digits of your Social Security number.`,
              "voice_digits": {
                "finish_on_key": "#"
              },
              "name": "digits",
              "type": "Twilio.NUMBER_SEQUENCE"
            }
          ],
          "on_complete": {
            "redirect": "task://digits_input"
          }
        };
        Say = false;

        // Say = 'For your account verification say 5 digits of your Zip code or last 4 digits of your Social Security number.';
        Remember.digits_request_task = 'zip_ssn';

        break;

      } else if (event.Field_yes_no_Value === 'No') {

        Say = false;
        Remember.userData = null;
        Redirect = 'task://agent_transfer';

        break;

      } else {
        Say = false;
        Redirect = 'task://fallback';

        break;
      }

    case 'payment_amount_check':
      if (event.Field_yes_no_Value === 'Yes') {
        if ( Memory.payment_method === 'credit card' ) {
          Collect = {
            "name": "collect_cc",
            "questions": [
              {
                "question": `We will need your credit card information. Please say or use your telephone keypad to provide credit card number.`,
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
          Say = false;
        } else if ( Memory.payment_method === 'ACH' ) {
          Say = 'We will need your bank account information. Tell me the Routing number.';
  
          Listen = true;
          Tasks = ['check_routing_number'];
        }

        break;

      } else if (event.Field_yes_no_Value === 'No') {

        if ( Memory.payment_type === 'partial' ) {
          Say = 'Alright. Please tell me the payment amount again.';
  
          Listen = true;
          Tasks = ['partial_payment'];
        } else if ( Memory.payment_type === 'arrangement' ) {
          Say = 'Alright. Please tell me the payment amount and frequency again.';
  
          Listen = true;
          Tasks = ['arrangement_payment'];
        }

        break;

      } else {
        Say = false;
        Redirect = 'task://fallback';

        break;
      }
    
    case 'payment_amount_incorrect':
      if (event.Field_yes_no_Value === 'Yes') {
        if ( Memory.payment_type === 'partial' ) {
          Say = 'Alright. Please tell me the new payment amount.';

          Listen = true;
          Tasks = ['partial_payment'];
        } else if ( Memory.payment_type === 'arrangement' ) {
          Say = 'Alright. Please tell me the new payment amount and frequency.';

          Listen = true;
          Tasks = ['arrangement_payment'];
        }

        break;

      } else if (event.Field_yes_no_Value === 'No') {
        Say = 'Alright. Do you want to be transfered to an agent?';

        Remember.question = 'agent_transfer';

        Listen = true;
        Tasks = ['yes_no'];

        break;

      } else {
        Say = false;
        Redirect = 'task://fallback';

        break;
      }


    case 'cc_check':
      if (event.Field_yes_no_Value === 'Yes') {
        Collect = {
          "name": "collect_exp_date",
          "questions": [
            {
              "question": `Alright. Tell me your card expiration date. The month and the year. Example, March 2026.`,
              "voice_digits": {
                "finish_on_key": "#"
              },
              "name": "cc_exp_date",
              "type": "Twilio.DATE"
            }
          ],
          "on_complete": {
            "redirect": "task://check_exp_date"
          }
        };
        Say = false;
        // Say = 'Alright. Tell me your card expiration date. The month and the year. Example, March 2026.';
        break;

      } else if (event.Field_yes_no_Value === 'No') {
        Collect = {
          "name": "collect_cc",
          "questions": [
            {
              "question": `Alright. Please say or use your telephone keypad to provide credit card number again.`,
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
        Say = false;

        Remember.credit_card_num = '';

        break;

      } else {
        Say = false;
        Redirect = 'task://fallback';

        break;
      }

    case 'acceptable_cc':
      if (event.Field_yes_no_Value === 'Yes') {
        Collect = {
          "name": "collect_cc",
          "questions": [
            {
              "question": `Alright. Please say or use your telephone keypad to provide a new credit card number.`,
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
        Say = false;

        break;

      } else if (event.Field_yes_no_Value === 'No') {
        Say = 'Alright. Do you want to be transfered to an agent?';

        Remember.question = 'agent_transfer';

        Listen = true;
        Tasks = ['yes_no'];

        break;

      } else {
        Say = false;
        Redirect = 'task://fallback';

        break;
      }


    case 'exp_date_check':
      if (event.Field_yes_no_Value === 'Yes') {
        Collect = {
          "name": "collect_digits",
          "questions": [
            {
              "question": `Alright. Tell me your CVV number located at the back of your card.`,
              "voice_digits": {
                "finish_on_key": "#"
              },
              "name": "digits",
              "type": "Twilio.NUMBER_SEQUENCE"
            }
          ],
          "on_complete": {
            "redirect": "task://digits_input"
          }
        };
        Say = false;
        // Say = 'Alright. Tell me your CVV number located at the back of your card.';
        Remember.digits_request_task = 'cvv';

        break;

      } else if (event.Field_yes_no_Value === 'No') {
        Collect = {
          "name": "collect_exp_date",
          "questions": [
            {
              "question": `Alright. Please tell me the expiration date again.`,
              "voice_digits": {
                "finish_on_key": "#"
              },
              "name": "cc_exp_date",
              "type": "Twilio.DATE"
            }
          ],
          "on_complete": {
            "redirect": "task://check_exp_date"
          }
        };
        Say = false;
        // Say = 'Alright. Please tell me the expiration date again.';
        Remember.credit_card_exp_date = '';

        break;

      } else {
        Say = false;
        Redirect = 'task://fallback';

        break;
      }

    case 'cvv_check':
      if (event.Field_yes_no_Value === 'Yes') {
        Say = false;

        Redirect = 'task://confirm_payment';

        break;

      } else if (event.Field_yes_no_Value === 'No') {
        Collect = {
          "name": "collect_digits",
          "questions": [
            {
              "question": `Alright. Please tell me the CVV again.`,
              "voice_digits": {
                "finish_on_key": "#"
              },
              "name": "digits",
              "type": "Twilio.NUMBER_SEQUENCE"
            }
          ],
          "on_complete": {
            "redirect": "task://digits_input"
          }
        };
        Say = false;
        // Say = 'Alright. Please tell me the CVV again.';

        Remember.credit_card_cvv = '';
        Remember.digits_request_task = 'cvv';

        break;

      } else {
        Say = false;
        Redirect = 'task://fallback';

        break;
      }

    case 'routing_check':
      if (event.Field_yes_no_Value === 'Yes') {
        Collect = {
          "name": "collect_bank_acc",
          "questions": [
            {
              "question": `Alright. Say or use your telephone keypad to provide your bank account number.`,
              "voice_digits": {
                "finish_on_key": "#"
              },
              "name": "bank_acc",
              "type": "Twilio.NUMBER_SEQUENCE"
            }
          ],
          "on_complete": {
            "redirect": "task://check_bank_acc_number"
          }
        };
        
        Say = false;
        // Say = 'Alright. Tell me your bank account number.';

        break;

      } else if (event.Field_yes_no_Value === 'No') {
        Collect = {
          "name": "collect_routing",
          "questions": [
            {
              "question": `Alright. Please tell me the routing number again.`,
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
        Say = false;

        Remember.bank_acc_routing = '';

        break;

      } else {
        Say = false;
        Redirect = 'task://fallback';

        break;
      }

    case 'bank_acc_num_check':
      if (event.Field_yes_no_Value === 'Yes') {
        Say = 'Alright. Tell me your bank account type by saying "checking" for checking account "savings" for savings account.';

        Listen = true;
        Tasks = ['check_bank_acc_type'];

        break;

      } else if (event.Field_yes_no_Value === 'No') {
        Collect = {
          "name": "collect_bank_acc",
          "questions": [
            {
              "question": `Alright. Please tell me the bank account number again.`,
              "voice_digits": {
                "finish_on_key": "#"
              },
              "name": "bank_acc",
              "type": "Twilio.NUMBER_SEQUENCE"
            }
          ],
          "on_complete": {
            "redirect": "task://check_bank_acc_number"
          }
        };
        
        Say = false;
        // Say = 'Alright. Please tell me the bank account number again.';
        Remember.bank_acc_num = '';

        break;

      } else {
        Say = false;
        Redirect = 'task://fallback';

        break;
      }
      
    case 'bank_acc_type_check':
      if (event.Field_yes_no_Value === 'Yes') {
        Say = false;

        Redirect = 'task://confirm_payment';

        break;

      } else if (event.Field_yes_no_Value === 'No') {
        Say = 'Alright. Please tell me the bank account type again.';

        Remember.bank_acc_type = '';

        Listen = true;
        Tasks = ['check_bank_acc_type'];

        break;

      } else {
        Say = false;
        Redirect = 'task://fallback';

        break;
      }
    
    case 'confirm_payment':
      if (event.Field_yes_no_Value === 'Yes') {
        Say = `Alright. Let us process the payment.`;

        Redirect = 'task://payment_final_confirmation';

        break;

      } else if (event.Field_yes_no_Value === 'No') {
        Say = 'Alright. Do you want to be transfered to a representative?';

        Remember.question = 'agent_transfer';

        Listen = true;
        Tasks = ['yes_no'];

        break;

      } else {
        Say = false;
        Redirect = 'task://fallback';

        break;
      }

    case 'agent_transfer':
      if (event.Field_yes_no_Value === 'Yes') {

        Say = false;
        Redirect = 'task://agent_transfer';

        break;

      } else if (event.Field_yes_no_Value === 'No') {

        Say = false;
        Redirect = 'task://goodbye';

        break;

      } else {
        Say = false;
        Redirect = 'task://fallback';

        break;
      }

    case 'additional_help':
      if (event.Field_yes_no_Value === 'Yes') {

        Say = false;
        Redirect = 'task://agent_transfer';
        break;

      } else if (event.Field_yes_no_Value === 'No') {

        Say = false;
        Redirect = 'task://goodbye';

        break;

      } else {
        Say = false;
        Redirect = 'task://fallback';

        break;
      }

    default:
      Say = false;
      Redirect = 'task://fallback';

      break;
  }

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

module.exports = yesNoHandler;