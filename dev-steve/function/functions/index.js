const axios = require('axios');
const valid = require('card-validator');
const brnv = require('bank-routing-number-validator');

const API_ENDPOINT = 'https://dev-mark-7619-dev.twil.io/simulateAPI';

exports.handler = async (context, event, callback) => {
  const { CurrentTask } = event;
  // const assets = Runtime.getAssets();

  // calling task handlers
  switch (CurrentTask) {
    case 'greeting':
      // const asset = require(assets['/greetingTaskHandler.js'].path);
      // await asset.GreetingTaskHandler(context, event, callback);
      await GreetingTaskHandler(context, event, callback);
      break;
      
    case 'phone_check':
      await phoneCheckTaskHandler(context, event, callback);
      break;
      
    case 'account_check':
      await accountCheckTaskHandler(context, event, callback);
      break;
      
    case 'digits_input':
      await digitsInputTaskHandler(context, event, callback);
      break;

    case 'check_payment_method':
      await checkPaymentMethodTaskHandler(context, event, callback);
      break;

    case 'payment_type':
      await paymentTypeTaskHandler(context, event, callback);
      break;

    case 'partial_payment':
      await partialPaymentTaskHandler(context, event, callback);
      break;

    case 'arrangement_payment':
      await arrangementPaymentTaskHandler(context, event, callback);
      break;

    case 'check_cc':
      await checkCCTaskHandler(context, event, callback);
      break;

    case 'check_exp_date':
      await checkExpDateTaskHandler(context, event, callback);
      break;

    case 'check_routing_number':
      await checkRoutingNumberTaskHandler(context, event, callback);
      break;

    case 'check_bank_acc_number':
      await checkBankAccountNumberTaskHandler(context, event, callback);
      break;

    case 'check_bank_acc_type':
      await checkBankAccountTypeTaskHandler(context, event, callback);
      break;
      
    case 'confirm_payment':
      await confirmPaymentTaskHandler(context, event, callback);
      break;
    
    case 'payment_final_confirmation':
      await paymentFinalConfirmationTaskHandler(context, event, callback);
      break;

    case 'provide_info':
      await provideInfoTaskHandler(context, event, callback);
      break;

    case 'itemized_statement':
      await itemizedStatementTaskHandler(context, event, callback);
      break;

    case 'charity_application':
      await charityApplicationTaskHandler(context, event, callback);
      break;

    case 'mailing_address':
      await mailingAddressTaskHandler(context, event, callback);
      break;

    case 'agent_transfer':
      await agentTransferHandler(context, event, callback);
      break;

    case 'yes_no':
      await yesNoHandler(context, event, callback);
      break;

    case 'repeat':
      await repeatHandler(context, event, callback);
      break;

    case 'goodbye':
      await goodbyeTaskHandler(context, event, callback);
      break;

    case 'collect_fallback':
      await collectFallbackTaskHandler(context, event, callback);
      break;

    case 'fallback':
      await fallbackHandler(context, event, callback);
      break;

    default:
      await fallbackHandler(context, event, callback);
      break;
  }
};

// greeting handler function
const greetingTaskHandler = async (context, event, callback) => {
  let Say;
  let Prompt;
  let Listen = true;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  // Getting the real caller ID
  let callerID = event.UserIdentifier;
  // console.log(callerID);
  
  Remember.task_fail_counter = 0;

  if ( callerID ) {
    const userData = await getData(callerID, null);
    const { clientName } = userData;

    if ( userData && userData.clientName ) {
      Say = `Thank you for calling ${clientName}.
              Let me check your account using the phone number you are calling from. `;

      Remember.user_phone_number = callerID;
      Remember.userData = userData;
      
      Listen = false;
      Redirect = "task://phone_check";

    } else {
      Say = `Thank you for calling. 
              Let me check your account using the phone number you are calling from. `;

      Listen = false;

      Remember.user_phone_number = callerID;

      Redirect = 'task://phone_check';
    }

  } else {
    Say = `Thank you for calling. 
            Let me check your account using the phone number you are calling from. `;

    Prompt = `Please tell me the phone number associated with your account.`;

    Say += Prompt;

    Tasks = ['phone_check', 'agent_transfer'];
  }

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

// phone_check handler function
const phoneCheckTaskHandler = async (context, event, callback) => {
  let Say;
  let Prompt;
  let Listen = true;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  const userPhoneNumber =  Memory.user_phone_number || event.Field_PhoneNumber_Value;

  if ( userPhoneNumber ) {
    const userData = Memory.userData || await getData(userPhoneNumber, null);
    const { accountStatus, accountNumber, userName } = userData;
    
    Remember.userData = userData;

    if ( accountStatus && accountStatus === 'active' ) {
      Say = ``;
      Prompt = `Is your name ${userName}?`;

      Say += Prompt;
      
      Remember.question = 'name_check';
      
      Listen = true;
      Tasks = ['yes_no', 'agent_transfer'];

    } else if ( accountStatus && accountStatus === 'inactive' ) {
      Say = `The account associated with ${userPhoneNumber}, is not active. `;
      Prompt = `Do you need additional assistance?`;

      Remember.question = 'additional_help';

      Say += Prompt;
      Listen = true;

    } else if ( accountStatus === false ) {
      Say = `We are not able to find your account using the phone number you are calling from. `;
      Prompt = `Please say your Account Number located in the upper right corner of the letter, starting with the first numerical digit.`;

      Say += Prompt;
      Listen = true;
      Tasks = ['account_check', 'agent_transfer'];
    }
  } else {
    Say = false;
    Listen = false;
    Remember.from_task = event.CurrentTask;
    Redirect = 'task://fallback';
  }

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

// account_check handler function
const accountCheckTaskHandler = async (context, event, callback) => {
  let Say;
  let Prompt;
  let Listen = true;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  const accountNumber = event.Field_AccountNumber_Value;

  if ( accountNumber ) {

    const userData = await getData(null, accountNumber);
    const { accountStatus, userName } = userData;

    Remember.userData = userData;

    if ( accountStatus && accountStatus === 'active' ) {
      Say = ``;
      Prompt = `Is your name ${userName}?`;

      Say += Prompt;

      Remember.question = 'name_check';

      Listen = true;
      Tasks = ['yes_no', 'agent_transfer'];

    } else if ( accountStatus && accountStatus === 'inactive' ) {
      Say = `The account associated with ${userPhoneNumber}, is not active. `;
      Prompt = `Do you need additional assistance?`;

      Say += Prompt;

      Remember.question = 'additional_help';

      Listen = true;
    } else if ( accountStatus === false ) {
      Say = `The account number you provided, ${accountNumber} is not valid. `;
      Prompt = `Please say or enter your account number again.`;

      Say += Prompt;
      Listen = true;
      Tasks = ['account_check', 'agent_transfer'];
    }
  } else {
    Say = false;
    Listen = false;
    Remember.from_task = event.CurrentTask;
    Redirect = 'task://fallback';
  }

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

// digits_input handler function
const digitsInputTaskHandler = async (context, event, callback) => {
  let Say;
  let Prompt;
  let Listen = true;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  const digits = event.Field_digits_Value || event.Field_digits_alt_Value;
  
  const userData = Memory.userData;
  const { userZip, userSsn, userBalance, namespace } = userData;
  const digitsRequestTask = Memory.digits_request_task;

  console.log('Entered digits: ' + digits);

  if ( digits ) {
    if ( digitsRequestTask === 'zip_ssn' && digits.length === 5 ) {
      if ( digits === userZip ) {
        if ( namespace === 'EBO' ) {
          Say = `The ZIP code entered is correct. Your Total balance is ${userBalance} dollars. `;
          Prompt = `To make a payment using credit card say "credit card", 
                    to make a payment using ACH say "ACH", 
                    for our website address say "Website Address", 
                    for our mailing address say "Mailing Address", 
                    to speak to a Representative say "Representative" or "Agent". 
                    To receive an itemized statement say "Bill", 
                    to make a Charity application say "Charity". 
                    To repeat the message say "repeat"`;
  
          Say += Prompt;

          Remember.repeat = true;
          Remember.repeat_params = {
            say: Prompt,
            tasks: false
          };
        } else {
          Say = `The ZIP code entered is correct. 
                  This communication is from a debt collector, this is an attempt to collect a debt and any information obtained will be used for that purpose. 
                  Your Total balance is ${userBalance} dollars. `;
          Prompt = `To make a payment using credit card say "credit card", 
                    to make a payment using ACH say "ACH", 
                    for our website address say "Website Address", 
                    for out mailing address say "Mailing Address", 
                    to speak to a Representative say "Representative" or "Agent". 
                    To repeat the message say "repeat"`;
  
          Say += Prompt;

          Remember.repeat = true;
          Remember.repeat_params = {
            say: Prompt,
            tasks: false
          };
        }

      } else {
        Say = `The zip code <say-as interpret-as='digits'>${digits}</say-as> does not match our records. `;
        Prompt = `Would you like to be transferred to an agent for help?`;

        Say += Prompt;

        Remember.question = 'agent_transfer';
        Listen = true;
        Tasks=['yes_no'];
      }
    } else if ( digitsRequestTask === 'zip_ssn' && digits.length === 4 ) {
      if ( digits === userSsn.slice(-4) ) {
        if ( namespace === 'EBO' ) {
          Say = `The SSN entered is correct. Your Total balance is ${userBalance} dollars. `;
          Prompt = `To make a payment using credit card say "credit card", 
                    to make a payment using ACH say "ACH", 
                    for our website address say "Website Address", 
                    for our mailing address say "Mailing Address", 
                    to speak to a Representative say "Representative" or "Agent". 
                    To receive an itemized statement say "Bill", 
                    to make a Charity application say "Charity". 
                    To repeat the message say "repeat"`;

          Say += Prompt;

          Remember.repeat = true;
          Remember.repeat_params = {
            say: Prompt,
            tasks: false
          };
        } else {
          Say = `The SSN entered is correct. 
                  This communication is from a debt collector, this is an attempt to collect a debt and any information obtained will be used for that purpose. 
                  Your Total balance is ${userBalance} dollars. `;
          Prompt = `To make a payment using credit card say "credit card", 
                    to make a payment using ACH say "ACH", 
                    for our website address say "Website Address", 
                    for our mailing address say "Mailing Address", 
                    to speak to a Representative say "Representative" or "Agent". 
                    To repeat the message say "repeat"`;

          Say += Prompt;

          Remember.repeat = true;
          Remember.repeat_params = {
            say: Prompt,
            tasks: false
          };
        }

      } else {
        Say = `The last four digits of your social security number code <say-as interpret-as='digits'>${digits}</say-as> do not match our records. `;
        Prompt = `Would you like to be transferred to an agent for help?`;

        Say += Prompt;

        Remember.question = 'agent_transfer';
        Listen = true;
        Tasks=['yes_no'];
      }
    } else if ( digitsRequestTask === 'cvv' ) {
      const validCVV = digits.length === 3 ? true : false;

      if ( validCVV ) {
        Say = `You said <say-as interpret-as='digits'>${digits}</say-as>. `;
        Prompt = `Is that correct?`;
      
        Say += Prompt;
        
        Remember.credit_card_cvv = digits;
        Remember.question = 'cvv_check';
      
        Listen = true;
        Tasks=['yes_no', 'agent_transfer'];
      } else {
        Say = `The CVV you provided is not valid. `;
        Prompt = `Please provide a valid CVV.`;
      
        Say += Prompt;
      
        Listen = true;
        Tasks=['digits_input', 'agent_transfer'];
      }
    } else {
      Say = `You provided an invalid number. `;
      Prompt = `Would you like to be transferred to an agent for help?`;

      Say += Prompt;

      Remember.question = 'agent_transfer';
      Listen = true;
      Tasks=['yes_no'];
    }
  } else {
    Say = false;
    Listen = false;
    Remember.from_task = event.CurrentTask;
    Redirect = 'task://fallback';
  }

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

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

      } else if ( Memory.payment_method === 'credit card' ) {
        Say = `To pay the amount of ${userBalance} dollars, will need your Bank account information. `;
        Prompt = `Tell me the routing number.`;
    
        Say += Prompt;
        
        Remember.payment_type = 'full';
        Remember.payment_amount = userBalance;

        Listen = true;
        Tasks=['check_routing_number', 'agent_transfer'];
      }
    } else if ( payment_type === 'partial' ) {
      Say = `You will now be asked to tell me the specific amount of your payment including both dollars and cents. `;
      Prompt = `Please tell me the payment amount now.`;

      Say += Prompt;
      
      Remember.payment_type = 'partial';

      Listen = true;
      Tasks=['partial_payment'];
    } else if ( payment_type === 'arrangement' ) {
      Say = `You will now be asked to tell me the number of payments, the frequency and the starting date. Example: 5 payments weekly, starting from March 5th. `;
      Prompt = `Please tell me the number of payments, frequency starting date now.`;

      Say += Prompt;
      
      Remember.payment_type = 'arrangement';

      Listen = true;
      Tasks=['arrangement_payment', 'agent_transfer'];
    }
  } else {
    Say = false;
    Listen = false;
    Remember.from_task = event.CurrentTask;
    Redirect = 'task://fallback';
  }

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

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

  const exp_date = event.Field_exp_date_Value;

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

  const routing_num = event.Field_routing_num_Value || event.Field_routing_num_alt_Value;

  if ( routing_num ) {
    const validRoutingNum = brnv.ABARoutingNumberIsValid(routing_num);

    if ( validRoutingNum ) {
      Say = `You said ${routing_num}. `;
      Prompt = `Is that correct?`;
    
      Say += Prompt;
      
      Remember.bank_acc_routing = routing_num;
      Remember.question = 'routing_check';
    
      Listen = true;
      Tasks=['yes_no', 'agent_transfer'];
    } else {
      Say = `The routing number you provided is not valid. `;
      Prompt = `Please provide a valid routing number.`;
    
      Say += Prompt;
    
      Listen = true;
      Tasks=['check_routing_number', 'agent_transfer'];
    }
  } else {
    Say = false;
    Listen = false;
    Remember.from_task = event.CurrentTask;
    Redirect = 'task://fallback';
  }

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

// check_bank_acc_number handler function
const checkBankAccountNumberTaskHandler = async (context, event, callback) => {
  let Say;
  let Prompt;
  let Listen = true;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  const bank_acc_num = event.Field_bank_acc_num_Value || event.Field_bank_acc_num_alt_Value;

  if ( bank_acc_num ) {
    Say = `You said ${bank_acc_num}. `;
    Prompt = `Is that correct?`;
  
    Say += Prompt;
    
    Remember.bank_acc_num = bank_acc_num;
    Remember.question = 'bank_acc_num_check';
  
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

// check_bank_acc_type handler function
const checkBankAccountTypeTaskHandler = async (context, event, callback) => {
  let Say;
  let Prompt;
  let Listen = true;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  const bank_acc_type = event.Field_bank_acc_type_Value;

  if ( bank_acc_type ) {
    Say = `You said ${bank_acc_type}. `;
    Prompt = `Is that correct?`;
  
    Say += Prompt;
    
    Remember.bank_acc_type = bank_acc_type;
    Remember.question = 'bank_acc_type_check';
  
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

// confirm_payment handler function
const confirmPaymentTaskHandler = async (context, event, callback) => {
  let Say;
  let Prompt;
  let Listen = true;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  let payment_account;
  let currentDate = new Date();
  currentDate = currentDate.toDateString();

  if ( Memory.payment_method === 'credit card' ) {
    payment_account = Memory.credit_card_num;
  } else if ( Memory.payment_method === 'ACH' ) {
    payment_account = Memory.bank_acc_num;
  }

  if ( Memory.payment_type === 'full' || Memory.payment_type === 'partial' ) {
    Say = `Before I process your payment, 
            Let's confirm, today's date is, ${currentDate}. 
            You are authorizing the payment of ${Memory.payment_amount} to be taken from your ${Memory.payment_method} account ending in, ${payment_account.slice(-4)}. `;
    Prompt = `Do you want to proceed?`;
  
    Say += Prompt;
  } else if ( Memory.payment_type === 'arrangement' ) {
    Say = `Before I process your payment, 
            Let's confirm, today's date is ${currentDate}. 
            You are authorizing ${Memory.no_of_payments} payments ${Memory.payment_frequency} 
            to be taken from your ${Memory.payment_method} account ending in, ${payment_account.slice(-4)}, 
            starting from ${Memory.start_date}. `;
    Prompt = `Do you want to proceed?`;

    Say += Prompt;
  }

  Remember.question = 'confirm_payment';

  Listen = true;
  Tasks=['yes_no', 'agent_transfer'];

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

// payment_final_confirmation handler function
const paymentFinalConfirmationTaskHandler = async (context, event, callback) => {
  let Say;
  let Prompt;
  let Listen = true;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  const paymentInfo = {
    CardName: Memory.userData.userName,
    ZIP: Memory.userData.userZip,
    PhoneNumber: Memory.user_phone_number,
    PMTAMT: Memory.payment_amount,
    TYPE: Memory.payment_type,
    FREQ: Memory.payment_frequency,
    CARDNO: Memory.credit_card_num,
    CDEXPMN: Memory.credit_card_exp_date,
    CARDCODE: Memory.credit_card_cvv,
    BANKNO: Memory.bank_acc_num,
    ROUTING: Memory.bank_acc_routing,
    ACCTY: Memory.bank_acc_type
  };

  const paymentSuccess = await postData(paymentInfo);


  if ( paymentSuccess ) {
    Say = `This will confirm your payment transaction. `;
    Prompt = `Do you need additional help?`;

    Say += Prompt;

    Remember.question = 'additional_help';

    Listen = true;
  } else {
    Say = `Something went wrong. `;

    Listen = false;

    Redirect = 'task://agent_transfer';
  }

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

// provide_info handler function
const provideInfoTaskHandler = async (context, event, callback) => {
  let Say;
  let Prompt;
  let Listen = true;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  const infoType = event.Field_info_type_Value;

  const userData = Memory.userData;
  const { onlineUrl, mailAddress } = userData;

  if ( infoType ) {
    if ( infoType === 'online' ) {
      Say = `To make a payment online please visit ${onlineUrl}. `;
      Prompt = `To make a payment using credit card say "credit card", 
                to make a payment using ACH say "ACH", 
                to speak to a Representative say "Representative" or "Agent".`;

      Say += Prompt;
    } else if ( infoType === 'mail' ) {
      Say = `You can mail in a check at the following address, ${mailAddress}. `;
      Prompt = `To make a payment using credit card say "credit card", 
                to make a payment using ACH say "ACH", 
                to speak to a Representative say "Representative" or "Agent".`;

      Say += Prompt;
    }
  } else {
    Say = false;
    Listen = false;
    Remember.from_task = event.CurrentTask;
    Redirect = 'task://fallback';
  }

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

// itemized_statement handler function
const itemizedStatementTaskHandler = async (context, event, callback) => {
  let Say;
  let Prompt;
  let Listen = false;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  const userData = Memory.userData;
  const { namespace } = userData;

  if ( namespace === 'EBO' ) {
    Say = `Please say the mailing address you want the statements sent to.`;
    Remember.itemized_statement = true;
    Listen = true;
    Tasks = ['mailing_address', 'agent_transfer'];
  } else {
    Say = false;
    Listen = false;
    Remember.from_task = false;
    Redirect = 'task://fallback';
  }

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

// charity_application handler function
const charityApplicationTaskHandler = async (context, event, callback) => {
  let Say;
  let Prompt;
  let Listen = false;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  const userData = Memory.userData;
  const { namespace } = userData;

  if ( namespace === 'EBO' ) {
    Say = `Please say the mailing address you want the statements sent to.`;
    Remember.charity = true;
    Listen = true;
    Tasks = ['mailing_address', 'agent_transfer'];
  } else {
    Say = false;
    Listen = false;
    Remember.from_task = false;
    Redirect = 'task://fallback';
  }

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

// mailing_address handler function
const mailingAddressTaskHandler = async (context, event, callback) => {
  let Say;
  let Prompt;
  let Listen = false;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  const mailingAddress =  event.Field_mailing_address_Value;

  const userData = Memory.userData;
  const { namespace } = userData;

  if ( mailingAddress && namespace === 'EBO' ) {
    Say = `Your documents will be mailed to ${mailingAddress}.`;
    Redirect = 'task://goodbye';
  } else {
    Say = false;
    Listen = false;
    Remember.from_task = false;
    Redirect = 'task://fallback';
  }

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

// agent_transfer handler function
const agentTransferHandler = async (context, event, callback) => {
  const Listen = false;
  const Remember = false;
  const Collect = false;
  const Tasks = false;
  const Redirect = false;
  const Handoff = false;

  const Memory = JSON.parse(event.Memory);

  const Say = `Please hold the line while I transfer you to an agent.`;

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

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

        Say = 'For your account verification say 5 digits of your Zip code or last 4 digits of your Social Security number.';

        Listen = true;
        Remember.digits_request_task = 'zip_ssn';
        Tasks = ['digits_input'];

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
        Say = 'Alright. Tell me your card expiration date. The month and the year. Example, March 2026.';

        Listen = true;
        Tasks = ['check_exp_date'];

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
        Say = 'Alright. Tell me your CVV number located at the back of your card.';
        
        Remember.digits_request_task = 'cvv';
        Listen = true;
        Tasks = ['digits_input'];

        break;

      } else if (event.Field_yes_no_Value === 'No') {
        Say = 'Alright. Please tell me the expiration date again.';

        Remember.credit_card_exp_date = '';

        Listen = true;
        Tasks = ['check_exp_date'];

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
        Say = 'Alright. Please tell me the CVV again.';

        Remember.credit_card_cvv = '';

        Listen = true;
        Remember.digits_request_task = 'cvv';
        Tasks = ['digits_input'];

        break;

      } else {
        Say = false;
        Redirect = 'task://fallback';

        break;
      }

    case 'routing_check':
      if (event.Field_yes_no_Value === 'Yes') {
        Say = 'Alright. Tell me your bank account number.';

        Listen = true;
        Tasks = ['check_bank_acc_number'];

        break;

      } else if (event.Field_yes_no_Value === 'No') {
        Say = 'Alright. Please tell me the routing number again.';

        Remember.bank_acc_routing = '';

        Listen = true;
        Tasks = ['check_routing_number'];

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
        Say = 'Alright. Please tell me the bank account number again.';

        Remember.bank_acc_num = '';

        Listen = true;
        Tasks = ['check_bank_acc_number'];

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

// repeat handler function
const repeatHandler = async (context, event, callback) => {
  let Say;
  let Prompt;
  let Listen = true;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  if ( Memory.repeat === true ) {
    Say = Memory.repeat_params.say;
    Listen = true;
    Tasks = Memory.repeat_params.tasks;
  } else {
    Say = false;
    Listen = false;
    Remember.from_task = false;
    Redirect = 'task://fallback';
  }

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

// goodbye handler function
const goodbyeTaskHandler = async (context, event, callback) => {
  const Say = 'Thanks for calling. Good bye.';
  const Listen = false;
  const Remember = false;
  const Collect = false;
  const Tasks = false;
  const Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

// collect_fallback handler function
const collectFallbackTaskHandler = async (context, event, callback) => {
  const Say = `Looks like you having trouble. Apologies for that. Let's start again, how can I help you today?`;
  const Listen = true;
  let Remember = {};
  const Collect = false;
  const Tasks = false;
  const Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

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
};

const TFN_Lookup = async ( phoneNumber ) => {
  let clientData;
  let success;
  
  try {
    const requestObj = {
      PhoneNumber: '8559092691',
      PhoneNumberTo: phoneNumber
    };

    const responseObj = await axios.post(`${API_ENDPOINT}/TFN_LookUp`, requestObj);
    clientData = responseObj.data;

    success = clientData.success === 'ok' ? true : false;
    
  } catch ( error ) {
    console.error( error.response );
    success = false;
  }

  return [ success, clientData ];
};

const GetInboundAccountInfo = async ( reqData ) => {
  let userData;
  let success;
  
  try {
    const requestObj = {
      'AccountNo': reqData.accountNumber,  // A/C number the caller entered. Or the caller’s phone number
      'NameSpace':reqData.namespace,  // coming from the result of TFN_LookUp
      'AccountType': 'F', // hard coded
      'NameType': 'P',  // hard coded
      'SeedFlag': '1',  // hard coded
      'Host': reqData.host, // coming from the result of TFN_LookUp
      'PhoneNumber': reqData.callerPhoneNumber, // caller’s phone number
      'PhoneNumberTo': '+19993602702146', // the phone number they are calling to
      'IVRUsed':'MainIVR'
    };

    const responseObj = await axios.post(`${API_ENDPOINT}/GetInboundAccountInfo`, requestObj);
    userData = responseObj.data;

    success = userData.success === 'ok' ? true : false;
    
  } catch ( error ) {
    console.error( error.response );
    success = false;
  }

  return { success, userData };
};

const getData = async (phoneNumber, accountNumber) => {
  let userData;
  
  try {
    const requestObj = {
      mock_request: 'get_data',
      phone_number: phoneNumber,
      account_number: accountNumber
    };

    const responseObj = await axios.post(`${API_ENDPOINT}`, requestObj);
    userData = responseObj.data;
    
  } catch (error) {
    console.error(error);
  }

  return userData;
};

const postData = async (reqData) => {
  let paymentSuccess;

  try {
    const requestObj = {
      mock_request: 'post_data',
      paymentData: reqData,
    };

    const responseObj = await axios.post(`${API_ENDPOINT}`, requestObj);
    paymentSuccess = responseObj.data.paymentSuccess;
  } catch (error) {
    console.error(error);
  }

  return paymentSuccess;
};

const validateCC = ( credit_card_num ) => {
  let sum = 0;
  let alt = false;
  let num;
  
  for ( let i = credit_card_num.length - 1; i >= 0; i-- ) {
    num = parseInt(credit_card_num.charAt(i), 10);  // take the i th number
    
    if ( alt ) { // check for every alternate number
      num *= 2;  // multiply the number by 2
      if ( num > 9 ) {
        num = ( num % 10 ) + 1;
      }
    }

    alt = !alt;  // every alternate number has to be squared

    sum += num;
  }

  let r = sum % 10;

  const validCard = r === 0 ? true : false;
  const cardType = valid.number(credit_card_num).card.type;

  return { validCard, cardType };
} 