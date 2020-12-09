const assets = Runtime.getAssets();
const greetingTaskHandler = require(assets['/greeting_task.js'].path);
const phoneCheckTaskHandler = require(assets['/phone_check_task.js'].path);
const accountCheckTaskHandler = require(assets['/account_check_task.js'].path);
const digitsInputTaskHandler = require(assets['/digits_input_task.js'].path);
const checkPaymentMethodTaskHandler = require(assets['/check_payment_method_task.js'].path);
const paymentTypeTaskHandler = require(assets['/payment_type_task.js'].path);
const partialPaymentTaskHandler = require(assets['/partial_payment_task.js'].path);
const arrangementPaymentTaskHandler = require(assets['/arrangement_payment_task.js'].path);
const checkCCTaskHandler = require(assets['/check_cc_task.js'].path);
const checkExpDateTaskHandler = require(assets['/check_exp_date_task.js'].path);
const checkRoutingNumberTaskHandler = require(assets['/check_routing_number_task.js'].path);
const checkBankAccountNumberTaskHandler = require(assets['/check_bank_acc_number_task.js'].path);
const checkBankAccountTypeTaskHandler = require(assets['/check_bank_acc_type_task.js'].path);
const confirmPaymentTaskHandler = require(assets['/confirm_payment_task.js'].path);
const paymentFinalConfirmationTaskHandler = require(assets['/payment_final_confirmation_task.js'].path);
const provideInfoTaskHandler = require(assets['/provide_info_task.js'].path);
const itemizedStatementTaskHandler = require(assets['/itemized_statement_task.js'].path);
const charityApplicationTaskHandler = require(assets['/charity_application_task.js'].path);
const mailingAddressTaskHandler = require(assets['/mailing_address_task.js'].path);
const agentTransferHandler = require(assets['/agent_transfer_task.js'].path);
const yesNoHandler = require(assets['/yes_no_task.js'].path);
const repeatHandler = require(assets['/repeat_task.js'].path);
const goodbyeTaskHandler = require(assets['/goodbye_task.js'].path);
const collectFallbackTaskHandler = require(assets['/collect_fallback_task.js'].path);
const fallbackHandler = require(assets['/fallback_task.js'].path);

exports.handler = async (context, event, callback) => {
  const { CurrentTask } = event;

  // calling task handlers
  switch (CurrentTask) {
    case 'greeting':
      await greetingTaskHandler(context, event, callback);
      break;
      
    case 'phone_check':
      await phoneCheckTaskHandler(context, event, callback);
      break;
      
    case 'account_check':
      await accountCheckTaskHandler(context, event, callback);
      break;
      
    case 'digits_input':
      await digitsInputTaskHandler(context, event, callback);
      break;

    case 'check_payment_method':
      await checkPaymentMethodTaskHandler(context, event, callback);
      break;

    case 'payment_type':
      await paymentTypeTaskHandler(context, event, callback);
      break;

    case 'partial_payment':
      await partialPaymentTaskHandler(context, event, callback);
      break;

    case 'arrangement_payment':
      await arrangementPaymentTaskHandler(context, event, callback);
      break;

    case 'check_cc':
      await checkCCTaskHandler(context, event, callback);
      break;

    case 'check_exp_date':
      await checkExpDateTaskHandler(context, event, callback);
      break;

    case 'check_routing_number':
      await checkRoutingNumberTaskHandler(context, event, callback);
      break;

    case 'check_bank_acc_number':
      await checkBankAccountNumberTaskHandler(context, event, callback);
      break;

    case 'check_bank_acc_type':
      await checkBankAccountTypeTaskHandler(context, event, callback);
      break;
      
    case 'confirm_payment':
      await confirmPaymentTaskHandler(context, event, callback);
      break;
    
    case 'payment_final_confirmation':
      await paymentFinalConfirmationTaskHandler(context, event, callback);
      break;

    case 'provide_info':
      await provideInfoTaskHandler(context, event, callback);
      break;

    case 'itemized_statement':
      await itemizedStatementTaskHandler(context, event, callback);
      break;

    case 'charity_application':
      await charityApplicationTaskHandler(context, event, callback);
      break;

    case 'mailing_address':
      await mailingAddressTaskHandler(context, event, callback);
      break;

    case 'agent_transfer':
      await agentTransferHandler(context, event, callback);
      break;

    case 'yes_no':
      await yesNoHandler(context, event, callback);
      break;

    case 'repeat':
      await repeatHandler(context, event, callback);
      break;

    case 'goodbye':
      await goodbyeTaskHandler(context, event, callback);
      break;

    case 'collect_fallback':
      await collectFallbackTaskHandler(context, event, callback);
      break;

    case 'fallback':
      await fallbackHandler(context, event, callback);
      break;

    default:
      await fallbackHandler(context, event, callback);
      break;
  }
};