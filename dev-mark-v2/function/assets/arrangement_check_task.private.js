const assets = Runtime.getAssets();
const responseBuilder = require(assets['/response_builder.js'].path);

// arrangement_check handler function
const arrangementCheckTaskHandler = async (context, event, callback) => {
  let Say;
  let Prompt;
  let Listen = true;
  let Collect = false;
  let Remember = {};
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  const Memory = JSON.parse(event.Memory);

  const no_of_payments = Memory.twilio.collected_data.collect_arrangement_details.answers.no_of_payments.answer;
  const payment_frequency = Memory.twilio.collected_data.collect_arrangement_details.answers.payment_frequency.answer;
  
  const userData = Memory.userData;
  const { userBalance } = userData;

  const freqs = ['weekly', 'bi-weekly', 'monthly'];

  if ( no_of_payments <= 6 && freqs.includes(payment_frequency) ) {
    const divided_payment_amount = Math.floor(userBalance / no_of_payments);
    const remainder = userBalance % no_of_payments;
    const first_payment_amount = divided_payment_amount + remainder;

    Say = `Your first payment will be ${first_payment_amount} and the other ${no_of_payments - 1} payments will be ${divided_payment_amount}. `;
    Prompt = `Do you want to proceed?`;
  
    Say += Prompt;
    
    Remember.payment_amount = userBalance;
    Remember.first_payment_amount = first_payment_amount;
    Remember.next_payment_amounts = divided_payment_amount;
    Remember.no_of_payments = no_of_payments;
    Remember.payment_frequency = payment_frequency;
    Remember.question = 'payment_setup_check';
  
    Listen = true;
    Tasks=['yes_no', 'agent_transfer'];
  } else {
    Collect = {
      "name": "collect_arrangement_details",
      "questions": [
        {
          "question": `You provided invalid details. We can set up an arrangement for a maximum of 6 payments to be payable weekly, bi-weekly or monthly.
                        How many payments do you want to make.`,
          "name": "no_of_payments",
          "type": "Twilio.NUMBER"
        },
        {
          "question": `Do you want to pay weekly, bi-weekly or monthly.`,
          "name": "payment_frequency",
          "type": "PAYMENT_FREQUENCY"
        },
      ],
      "on_complete": {
        "redirect": "task://arrangement_check"
      }
    };

    Say = false;
    Listen = false;
  }

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

module.exports = arrangementCheckTaskHandler;