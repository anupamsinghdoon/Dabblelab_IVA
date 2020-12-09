const assets = Runtime.getAssets();
const responseBuilder = require(assets['/response_builder.js'].path);

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

module.exports = checkBankAccountTypeTaskHandler;