const assets = Runtime.getAssets();
const responseBuilder = require(assets['/response_builder.js'].path);

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
            You are authorizing the payment of ${Memory.payment_amount} to be taken from your ${Memory.payment_method} account ending in, <say-as interpret-as='digits'>${payment_account.slice(-4)}</say-as>. `;
    Prompt = `Do you want to proceed?`;
  
    Say += Prompt;
  } else if ( Memory.payment_type === 'arrangement' ) {
    Say = `Before I process your payment, 
            Let's confirm, today's date is ${currentDate}. 
            You are authorizing ${Memory.no_of_payments} payments ${Memory.payment_frequency} 
            to be taken from your ${Memory.payment_method} account ending in, <say-as interpret-as='digits'>${payment_account.slice(-4)}</say-as>, 
            starting from ${Memory.start_date}. `;
    Prompt = `Do you want to proceed?`;

    Say += Prompt;
  }

  Remember.question = 'confirm_payment';

  Listen = true;
  Tasks=['yes_no', 'agent_transfer'];

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

module.exports = confirmPaymentTaskHandler;