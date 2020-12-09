const assets = Runtime.getAssets();
const responseBuilder = require(assets['/response_builder.js'].path);

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

  const bank_acc_num = Memory.twilio.collected_data.collect_bank_acc.answers.bank_acc.answer ||
                      event.Field_bank_acc_num_Value ||
                      event.Field_bank_acc_num_alt_Value;

  if ( bank_acc_num ) {
    Say = `You said <say-as interpret-as='digits'>${bank_acc_num}</say-as>. `;
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

module.exports = checkBankAccountNumberTaskHandler;