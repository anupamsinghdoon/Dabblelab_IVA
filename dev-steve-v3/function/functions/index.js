/* eslint-disable no-use-before-define */
exports.handler = async (context, event, callback) => {
  switch (event.CurrentTask) {
    case 'greeting':
      await greetingHandler(event, callback);
      break;
    case 'yes_no':
      await yesNoHandler(event, callback);
      break;
    case 'fallback':
      await fallbackHandler(event, callback);
      break;
    case 'goodbye':
      await goodbyeHandler(event, callback);
      break;
    default:
      await defaultHandler(event, callback);
      break;
  }
};

// handle the greeting task
const greetingHandler = (event, callback) => {
  const amount = 500;
  const response = {};
  response.actions = [];
  response.actions.push({ say: `We can split the balance in half making two payments of ${(amount)} dollars each. Will that work for you?` });
  response.actions.push({ listen: true });
  callback(null, response);
};

// handle the yes_no task
const yesNoHandler = (event, callback) => {
  const response = {};
  response.actions = [];

  const payBefore = new Date();
  const duration = 30; // In Days
  payBefore.setTime(payBefore.getTime() + (duration * 24 * 60 * 60 * 1000));

  switch (event.CurrentTask) {
    case 'split_payment':
      response.actions.push({ say: 'Are you able to make the first payment today?' });
      response.actions.push({ listen: true });
      break;
    case 'split_payment_pay_today':
      response.actions.push({ say: `Which date do you want to make the second payment, it has to be before ${payBefore}` });
      response.actions.push({ listen: true });
      break;
    default:
      response.actions.push({ say: 'You said yes or no but I don\'t know why.' });
      break;
  }

  callback(null, response);
};

// handle the fallback task
const fallbackHandler = (event, callback) => {
  const response = {};
  response.actions = [];
  response.actions.push({ say: 'Hello from the fallback handler.' });
  response.actions.push({ listen: true });
  callback(null, response);
};

// handle the good bye task
const goodbyeHandler = (event, callback) => {
  const response = {};
  response.actions = [];
  response.actions.push({ say: 'Good bye.' });
  callback(null, response);
};

// handler for tasks that are not defined in the above switch statement
const defaultHandler = (event, callback) => {
  const response = {};
  response.actions = [];
  response.actions.push({ say: `Hello. This is the default handler. The task ${event.CurrentTask} does not have a handler.` });

  response.actions.push({ listen: true });
  callback(null, response);
};
