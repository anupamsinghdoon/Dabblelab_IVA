exports.handler = async (context, event, callback) => {
  const { mock_request } = event;
  // console.log(mock_request);

  const responseObj = {};

  // calling mock API handlers
  switch (mock_request) {
    case 'get_data':
      await getHandler(context, event, callback);
      break;

    case 'post_data':
      await postHandler(context, event, callback);
      break;

    default:
      responseObj.default = true;
  }
};

const getHandler = async (context, event, callback) => {
  const responseObj = {};

  console.log(event.phone_number + ' or ' + event.account_number);
  responseObj.clientName = 'Convergent Outsourcing';
  responseObj.userName = 'HENRY DEBTOR';
  responseObj.namespace = 'RED';
  responseObj.accountNumber = '25868191';
  responseObj.accountStatus = 'active';
  responseObj.userSsn = '123456789';
  responseObj.userZip = '12345';
  responseObj.userBalance = 500;
  responseObj.onlineUrl = 'payconvergent.com';
  responseObj.mailAddress = 'Convergent Outsourcing Incorporated, P O Box 9 0 0 4, Renton, Washington, 9 8 0 5 7';

  callback(null, responseObj);
};

const postHandler = async (context, event, callback) => {
  console.log(event.paymentData);

  const responseObj = {
    paymentSuccess: true
  };

  callback(null, responseObj);
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
