const assets = Runtime.getAssets();
const responseBuilder = require(assets['/response_builder.js'].path);

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

  const digits = Memory.twilio.collected_data.collect_digits.answers.digits.answer ||
                  event.Field_digits_Value ||
                  event.Field_digits_alt_Value;
  
  const userData = Memory.userData;
  const { userZip, userSsn, userBalance, namespace } = userData;
  const digitsRequestTask = Memory.digits_request_task;

  console.log('Entered digits: ' + digits);

  if ( digits ) {
    if ( digitsRequestTask === 'zip_ssn' && digits.length === 5 ) {
      if ( digits === userZip ) {
        if ( namespace === 'EBO' ) {
          Say = `Your Total balance is ${userBalance} dollars. `;
          Prompt = `To make a payment using credit card say "credit card", 
                    to make a payment using ACH say "ACH", 
                    for our website address say "Website Address", 
                    for out mailing address say "Mailing Address", 
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
          Say = `This communication is from a debt collector, this is an attempt to collect a debt and any information obtained will be used for that purpose. 
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
          Say = `Your Total balance is ${userBalance} dollars. `;
          Prompt = `To make a payment using credit card say "credit card", 
                    to make a payment using ACH say "ACH", 
                    for our website address say "Website Address", 
                    for out mailing address say "Mailing Address", 
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
          Say = `This communication is from a debt collector, this is an attempt to collect a debt and any information obtained will be used for that purpose. 
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

module.exports = digitsInputTaskHandler;