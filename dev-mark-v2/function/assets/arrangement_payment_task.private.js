const assets = Runtime.getAssets();
const responseBuilder = require(assets['/response_builder.js'].path);

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
  
  const userData = Memory.userData;
  const { userBalance } = userData;

  let first_payment_date = Memory.first_payment_date;
  let second_payment_date;
  let start_payment_date = Memory.start_payment_date;

  if ( first_payment_date ) {
    second_payment_date = Memory.twilio.collected_data.collect_second_date.answers.second_date.answer;
    second_payment_date = second_payment_date.split('-').reverse().join('/');

    Say = `Your first payment will be today and your second payment date will be <say-as interpret-as="date" format="dmy">${second_payment_date}</say-as>. `;
    Prompt = `Is that correct?`;

    Say += Prompt;
    
    Remember.second_payment_date = second_payment_date;
    Remember.question = 'payment_date_check';
    Remember.date_check = 1;

    Listen = true;
    Tasks = ['yes_no', 'agent_transfer'];
  } else if ( !first_payment_date && Memory.split_payment ) {
    first_payment_date = Memory.twilio.collected_data.collect_payment_dates.answers.first_date.answer;
    second_payment_date = Memory.twilio.collected_data.collect_payment_dates.answers.second_date.answer;
    first_payment_date = first_payment_date.split('-').reverse().join('/');
    second_payment_date = second_payment_date.split('-').reverse().join('/');

    Say = `Your first payment date will be <say-as interpret-as="date" format="dmy">${first_payment_date}</say-as> and your second payment date will be <say-as interpret-as="date" format="dmy">${second_payment_date}</say-as>. `;
    Prompt = `Is that correct?`;

    Say += Prompt;
    
    Remember.first_payment_date = first_payment_date;
    Remember.second_payment_date = second_payment_date;
    Remember.question = 'payment_date_check';
    Remember.date_check = 2;

    Listen = true;
    Tasks = ['yes_no', 'agent_transfer'];
  } else if ( !first_payment_date && !Memory.split_payment ) {
    if ( start_payment_date ) {
      Say = `Your first payment will be today. `;
    } else {      
      start_payment_date = Memory.twilio.collected_data.collect_start_date.answers.start_date.answer;
      start_payment_date = start_payment_date.split('-').reverse().join('/');

      Say = `Your first payment date will be <say-as interpret-as="date" format="dmy">${start_payment_date}</say-as>. `;
    }

    Prompt = `Is that correct?`;

    Say += Prompt;
    
    Remember.start_payment_date = start_payment_date;
    Remember.question = 'payment_date_check';
    Remember.date_check = 3;

    Listen = true;
    Tasks = ['yes_no', 'agent_transfer'];
  }

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

module.exports = arrangementPaymentTaskHandler;