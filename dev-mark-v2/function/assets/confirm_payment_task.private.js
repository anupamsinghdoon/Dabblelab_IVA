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
  currentDate = currentDate.toLocaleDateString('en-GB');

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
    if ( Memory.split_payment ) {
      Say = `Before I process your payment, 
              Let's confirm, today's date is <say-as interpret-as="date" format="dmy">${currentDate}</say-as>. 
              You are authorizing 2 payments to be charged on <say-as interpret-as="date" format="dmy">${Memory.first_payment_date}</say-as> and on <say-as interpret-as="date" format="dmy">${Memory.second_payment_date}</say-as> 
              from your ${Memory.payment_method} account ending in, <say-as interpret-as='digits'>${payment_account.slice(-4)}</say-as>. `;
    } else {
      Say = `Before I process your payment, 
              Let's confirm, today's date is <say-as interpret-as="date" format="dmy">${currentDate}</say-as>. 
              You are authorizing ${Memory.no_of_payments} payments to be charged ${Memory.payment_frequency} 
              from your ${Memory.payment_method} account ending in, <say-as interpret-as='digits'>${payment_account.slice(-4)}</say-as>, 
              starting from ${Memory.start_payment_date}. `;
    }
    Prompt = `Do you want to proceed?`;

    Say += Prompt;
  }

  Remember.question = 'confirm_payment';

  Listen = true;
  Tasks=['yes_no', 'agent_transfer'];

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

module.exports = confirmPaymentTaskHandler;