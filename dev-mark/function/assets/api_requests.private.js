const axios = require('axios');

const API_ENDPOINT = 'https://dev-mark-7619-dev.twil.io/simulateAPI';

exports.TFN_Lookup = async ( phoneNumber ) => {
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

exports.GetInboundAccountInfo = async ( reqData ) => {
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

exports.getData = async (phoneNumber, accountNumber) => {
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

exports.postData = async (reqData) => {
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