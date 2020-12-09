const axios = require('axios');
const valid = require('card-validator');

const TFN_Lookup = async ( phoneNumber ) => {
  let clientData;
  let success;
  
  try {
    const requestObj = {
      PhoneNumber: '8559092691',
      PhoneNumberTo: phoneNumber
    };

    const responseObj = await axios.post(`http://pecodeviis:Test123!@pecodev.convergentusa.com/Convergent_Main_IVR/Home/TFN_LookUp`, requestObj);
    clientData = responseObj.data;
    success = true;
    
  } catch ( error ) {
    console.error( error.response );
    success = false;
  }

  return [ success, clientData ];
};

TFN_Lookup('123456789');


// console.log(valid.number('4242424242424242').card.type);