const assets = Runtime.getAssets();
const responseBuilder = require(assets['/response_builder.js'].path);
const { postData } = require(assets['/api_requests.js'].path);

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
    Tasks = ['yes_no', 'agent_transfer'];
  } else {
    Say = `Something went wrong. `;

    Listen = false;

    Redirect = 'task://agent_transfer';
  }

  responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};

module.exports = paymentFinalConfirmationTaskHandler;