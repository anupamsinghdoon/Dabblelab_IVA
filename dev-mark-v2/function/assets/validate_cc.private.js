const valid = require('card-validator');

const validateCC = ( credit_card_num ) => {
  let sum = 0;
  let alt = false;
  let num;
  
  for ( let i = credit_card_num.length - 1; i >= 0; i-- ) {
    num = parseInt(credit_card_num.charAt(i), 10);  // take the i th number
    
    if ( alt ) { // check for every alternate number
      num *= 2;  // multiply the number by 2
      if ( num > 9 ) {
        num = ( num % 10 ) + 1;
      }
    }

    alt = !alt;  // every alternate number has to be squared

    sum += num;
  }

  let r = sum % 10;

  const validCard = r === 0 ? true : false;
  const cardType = valid.number(credit_card_num).card.type;

  return { validCard, cardType };
}

module.exports = validateCC;