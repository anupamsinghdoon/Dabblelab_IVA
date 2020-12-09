# **ACT Holdings IVA**

<style>
table th:first-of-type {
    width: 20%;
}
table th:nth-of-type(2) {
    width: 80%;
}
</style>

## Situational Design

### **Table of Contents**

**[Introduction](#Introduction)**

**[Happy Path](#Happy-Path)**

**[Autopilot Tasks](#Autopilot-Tasks)**

**[TASK: greeting](#task-greeting)**

**[TASK: phone\_check](#task-phone\_check)**

**[TASK: account\_check](#task-account\_check)**

**[TASK: zip\_ssn\_check](#task-zip\_ssn\_check)**

**[TASK: announce\_mini\_mrinda](#task-announce\_mini\_mrinda)**

**[TASK: no\_of\_payments](#task-no\_of\_payments)**

**[TASK: payment\_amount](#task-payment\_amount)**

**[TASK: provide\_info](#task-provide\_info)**

**[TASK: check\_payment\_method](#task-check\_payment\_method)**

**[TASK: make\_payment](#task-make\_payment)**

**[TASK: check\_cc](#task-check\_cc)**

**[TASK: check\_exp\_date](#task-check\_exp\_date)**

**[TASK: check\_cvv](#task-check\_cvv)**

**[TASK: check\_routing\_number](#task-check\_routing\_number)**

**[TASK: check\_bank\_acc\_number](#task-check\_bank\_acc\_number)**

**[TASK: check\_bank\_acc\_type](#task-check\_bank\_acc\_type)**

**[TASK: confirm\_payment](#task-confirm\_payment)**

**[TASK: payment\_final\_confirmation](#task-payment\_final\_confirmation)**

**[TASK: yes\_no](#task-yes\_no)**

**[TASK: itemized\_statement](#task-itemized\_statement)**

**[TASK: charity\_application](#task-charity\_application)**

**[TASK: mailing\_address](#task-mailing\_address)**

**[TASK: goodbye](#task-goodbye)**

**[TASK: fallback](#task-fallback)**

## Introduction

This document provides the "situational design" for the ACT Holdings IVA - a Twilio Autopilot Bot.

Situational design is a voice-first method of designing voice user interfaces. To keep the design focused, a simple dialog referred to as the "happy path" is used to guide the design. Each interaction between the user and the bot represents a conversational "turn". Each turn has a situation that represents the application state or context. For example, if it's the user's first time interacting with the bot, there is a set of data that is unknown. So, the situation is that information needs to be collected. If the user is in the middle of a dialog, the situation might be that some or all of the necessary information is available. The situation drives the dialog and the bots "next steps".

## Happy Path

BOT: Hello. Thank you for calling {ClientName}.
Let me check your account using the phone number you are calling from.

Is your name {CallerName}?

USER: Yes

BOT: For your account verification say 5 digits of your Zip code or last 4 digits of your Social Security number.

USER: {SSN} or {ZIP}

BOT: The number entered is correct. 
Your Total balance is  {ClientBalance}.

(Play Mini Miranda message) 

To make a payment say “Payment”

(NOTE: depends on {ClientName}) To receive an itemized statement say “Bill” 

(NOTE: depends on {ClientName}) To make a Charity application say “Charity”,

To make a payment using credit card say "credit card",

to make a payment using ACH say "ACH" ,

for our website address say "Website Address",

for out mailing address say "Mailing Address",

to speak to a Representative say "Representative" or "Agent".

(NOTE: repeat options)

**CASE: Credit Card Partial Payment**

USER: Credit Card

BOT: You chose to pay with a credit card.
 To pay your balance, in full of {BalanceFull} say "Pay Full".

To make a payment in an amount less than the full balance of

{BalanceInFull}, say "Pay Partial".

USER: Pay Partial

BOT: You will now be asked to tell me the amount of your payment including both dollars and cents.

Please tell me the payment amount now.

USER: {Payment Amount} Example: 34 Dollars and 50 cents

BOT: Your payment amount is {PaymentAmount}.
 Do you want to proceed?

USER: Yes

BOT: We will need your credit card information. Tell me the Credit Card number.

USER: {cc\_number}

BOT: You said {cc\_number}.
 Is that correct?

USER: Yes

BOT: Alright. Tell me your card expiration date. The month and the year. Example, March 2026.

USER: {exp\_date}

BOT: You said {exp\_date}.
 Is that correct?

USER: Yes

BOT: Alright. Tell me your CVV number located at the back of your card.

USER: {cvv\_number}

BOT: You said {cvv\_number}.
 Is that correct?

USER: Yes

BOT: Before I process your payment, Let's confirm-Today's date is, {CurrentDate}. You are authorizing the payment of {PaymentAmount} to be taken from your {TypeOfPayment} account ending in , {last\_four\_digits}.

Do you want to authorize us to proceed with this payment?

USER: Yes

BOT: Alright. Let us process the payment.

This will confirm your payment transaction.

Do you need additional help?

USER: Yes

BOT: Please hold while we connect you with an account representative. This call may be monitored and recorded, for quality assurance purposes.

\<Transfers to an agent\>

**CASE: ACH Full Payment**

USER: ACH

BOT: You chose to pay with ACH.
 To pay your balance, in full of {BalanceFull} say "Pay Full".

To make a payment in an amount less than the full balance of

{BalanceInFull}, say "Pay Partial".

USER: Pay Full

BOT: Your payment amount is {PaymentAmount}.
 Do you want to proceed?

USER: Yes

BOT: We will need your bank account information. Tell me the Routing number.

USER: {bank\_routing\_number}

BOT: You said {bank\_routing\_number}.
 Is that correct?

USER: Yes

BOT: Alright. Tell me your bank account number.

USER: {bank\_acc\_number}

BOT: You said {bank\_acc\_number}.
 Is that correct?

USER: Yes

BOT: Alright. Tell me your bank account type by saying "checking" for checking account "savings" for savings account.

USER: {bank\_acc\_type}

BOT: You said {bank\_acc\_type}.
 Is that correct?

USER: Yes

BOT: Before I process your payment, Let's confirm-Today's date is, {CurrentDate}. You are authorizing the payment of {PaymentAmount} to be taken from your {TypeOfPayment} account ending in , {last\_four\_digits}.

Do you want to authorize us to proceed with this payment?

USER: Yes

BOT: Alright. Let us process the payment.

This will confirm your payment transaction.

Do you need additional help?

USER: No

BOT: Thank you for calling {ClientName}. GoodBye.

\<End of call\>

## Autopilot Tasks

| **Task** | **Description** |
| --- | --- |
| [greeting](#task-greeting) | Handles bot initiation |
| [phone\_check](#task-phone\_check) | Checks a phone number against an API. |
| [account\_check](#task-account\_check) | Checks an account number against an API. |
| [zip\_ssn\_check](#task-zip\_ssn\_check) | Checks and verifies the user with SSN or ZIP. |
| [announce\_mini\_mrinda](#task-announce\_mini\_mrinda) | Announces the Mini Miranda for verified user. |
| [no\_of\_payments](#task-no\_of\_payments) | Checks if the caller wants to make a one-time payment or make a payment arrangement. |
| [payment\_amount](#task-payment\_amount) | Accepts the amount of payment and frequency. |
| [provide\_info](#task-provide\_info) | Provides information about website and mailing addresses. |
| [check\_payment\_method](#task-check\_payment\_method) | Verifies the payment method. |
| [make\_payment](#task-make\_payment) | Verifies the amount of payment and prompts for corresponding information. |
| [check\_cc](#task-check\_cc) | Checks the credit card number. |
| [check\_exp\_date](#task-check\_exp\_date) | Checks the credit card expiration date. |
| [check\_cvv](#task-check\_cvv) | Checks the credit cvv number. |
| [check\_routing\_number](#task-check\_routing\_number) | Checks the bank routing number. |
| [check\_bank\_acc\_number](#task-check\_bank\_acc\_number) | Checks the bank account number. |
| [check\_bank\_acc\_type](#task-check\_bank\_acc\_type) | Checks the bank account type. |
| [confirm\_payment](#task-confirm\_payment) | Confirms that the caller has agreed to make the payment. |
| [payment\_final\_confirmation](#task-payment\_final\_confirmation) | Confirm the status of the payment. |
| [itemized\_statement](#task-itemized\_statement) | Requests itemized statements. |
| [charity\_application](#task-charity\_application) | For charity applications. |
| [mailing\_address](#task-mailing\_address) | For getting the mailing address from the user. |
| [agent\_transfer](#task-agent\_transfer) | Transfer to an agent |
| [yes\_no](#task-yes\_no) | Handles yes/no responses |
| [goodbye](#task-goodbye) | Conclude call |
| [fallback](#task-fallback) | Handles requests that aren't handled by any other task |

## TASK: greeting

The greeting task is the bot entry/initiation point. It will check the caller number and set the corresponding variables from the provided API.

| **Situation** | **User phone number available.** |
| --- | --- |
| Utterance | None. User was transferred to the bot. |
| Response | Thank you for calling {ClientName}. Let me check your account using the phone number you are calling from. |
| Prompt | None. Transfer to [TASK: phone\_check](#task-phone\_check). |

| **Situation** | **User phone number unavailable.** |
| --- | --- |
| Utterance | None. User was transferred to the bot. |
| Response |Thank you for calling. Let me check your account using the phone number you are calling from. |
| Prompt | Please tell me the phone number associated with your account. |
| Notes | None |

| **Situation** | **User variables failed to set.** |
| --- | --- |
| Utterance | None. User was transferred to the bot |
| Response | Sorry, we encountered a technical issue, transferring you to an agent. |
| Prompt | None. Transfer to [TASK: agent\_transfer](#task-agent\_transfer). |

| **Situation** | **Could not find Account using phone number.** |
| --- | --- |
| Utterance | None. User was transferred to the bot |
| Response | Sorry, we could not find your account using the phone number. |
| Prompt | None. Transfer to [TASK: account\_check](#task-account\_check). |

## TASK: phone\_check

The phone\_check task checks the caller number and sets the corresponding variables from the provided API, if available.

| **Situation** | **Found an account. Active.** |
| --- | --- |
| Utterance | {phone\_number} or transfer from task. |
| Response | None. |
| Prompt | Is your name {callerName}? |

| **Situation** | **Found an account. Inactive.** |
| --- | --- |
| Utterance | {phone\_number} or transfer from task. |
| Response | The account number you entered {phone\_number}, is not active. |
| Prompt | Do you need additional assistance? |

| **Situation** | **Failed to find an account calling in from Letter.** |
| --- | --- |
| Utterance | {phone\_number} or transfer from task. |
| Response | We are not able to find your account using the phone number you are calling from. |
| Prompt | Please say your Account Number located in the upper right corner of the letter, starting with the first numerical digit. [TASK: account\_check](#task-account\_check) |

| **Situation** | **Failed to find an account calling in from SMS.** |
| --- | --- |
| Utterance | {phone\_number} or transfer from task. |
| Response | We are not able to find your account using the phone number you are calling from. |
| Prompt | Please say your Account Number located in the upper right corner of the letter, starting with the first numerical digit. [TASK: account\_check](#task-account\_check) |

| **Situation** | **Failed to find an account calling in from Email.** |
| --- | --- |
| Utterance | {phone\_number} or transfer from task. |
| Response | We are not able to find your account using the phone number you are calling from. |
| Prompt | Please say your Account Number located in the  upper right corner of the letter, starting with the first numerical digit. [TASK: account\_check](#task-account\_check) |

## TASK: account\_check

The account\_check task checks verifies the caller with the account information.

| **Situation** | **Technical Issue.** |
| --- | --- |
| Utterance | {account\_number} |
| Response | Sorry, we encountered a technical issue, transferring you to an agent. |
| Prompt | None. Transfer to [TASK: agent\_transfer](#task-agent\_transfer). |

| **Situation** | **Found an account. Inactive.** |
| --- | --- |
| Utterance | {account\_number} |
| Response | The account number you entered {account\_number} is not active. |
| Prompt | Do you need additional assistance? |

| **Situation** | **Found an Account. Active.** |
| --- | --- |
| Utterance | {account\_number} |
| Response | None. |
| Prompt | Is your name {callerName}? |

| **Situation** | **Account Not Found.** |
| --- | --- |
| Utterance | {account\_number} |
| Response | The account number you entered {account_number} is not valid. |
| Prompt | Please say or enter your account number again. |

## TASK: zip\_ssn\_check

The zip\_ssn\_check task checks verifies the caller identity with their ZIP or SSN number.

| **Situation** | **Numbers match the records.** |
| --- | --- |
| Utterance | ZIP or SSN |
| Response | The number entered is correct. Your Total balance is {ClientBalance}. |
| Prompt | To make a payment using credit card say "credit card", to make a payment using ACH say "ACH" ,for our website address say "Website Address",for out mailing address say "Mailing Address", to speak to a Representative say "Representative" or "Agent". |

| **Situation** | **Numbers match the records and namspace is EBO** |
| --- | --- |
| Utterance | ZIP or SSN |
| Response | The number entered is correct. Your Total balance is {ClientBalance}. |
| Prompt | To make a payment using credit card say "credit card", to make a payment using ACH say "ACH" ,for our website address say "Website Address",for out mailing address say "Mailing Address", to speak to a Representative say "Representative" or "Agent" To receive an itemized statement say “Bill”, to make a Charity application say “Charity”. |

| **Situation** | **Numbers don't match the records.** |
| --- | --- |
| Utterance | ZIP or SSN |
| Response | I am sorry but that account number does not match our records. |
| Prompt | None. Transfer to [TASK: agent\_transfer.](#task-agent\_transfer) |

## TASK: announce\_mini\_mrinda

The announce\_mini\_mrinda task announces the Mini Miranda for verified user.

| **Situation** | **Namespace not EBO then Mini Mrinda** |
| --- | --- |
| Utterance | None. |
| Response | This communication is from a debt collector, this is an attempt to collect a debt and any information obtained will be used for that purpose. |
| Prompt | None. |

## TASK: no\_of\_payments

The no\_of\_payments task checks if the caller wants to make a one-time payment or make a payment arrangement.

| **Situation** | **Single Payment** |
| --- | --- |
| Utterance | {no\_of\_payments} |
| Response | To pay your balance, in full of {BalanceFull} say “Pay Full”. To make a payment in an amount less than the full balance of {BalanceInFull}, say “Pay Partial”. |
| Prompt | None. Transfer to [TASK: payment\_amount.](#task-payment\_amount) |

| **Situation** | **Multiple Payment** |
| --- | --- |
| Utterance | {no\_of\_payments} |
| Response | How much would you want to pay per payment? Please say the amount in Dollars and cents. Would you want to pay weekly or monthly. |
| Prompt | None. Transfer to [TASK: payment\_amount.](#task-payment\_amount) |

## TASK: payment\_amount

The payment\_amount task accepts the amount of payment and frequency.

| **Situation** | **Single Payment** |
| --- | --- |
| Utterance | {payment\_amount} |
| Response | Your payment amount is {PaymentAmount}. |
| Prompt | Do you want to proceed? |

| **Situation** | **Multiple Payment** |
| --- | --- |
| Utterance | {payment\_amount} {frequency} |
| Response | You will pay {payment\_amount} for {no\_of\_payments} {frequency}. Your last payment will be for {last\_payment\_calculated} |
| Prompt | Do you want to proceed? |

| **Situation** | **Amount is incorrect, less than $5, less than $5** |
| --- | --- |
| Utterance | {payment\_amount} |
| Response | Your payment amount is less than 4%, we accept only amount $5 or more. |
| Prompt | Please tell me a valid amount. |

| **Situation** | **Amount is incorrect, more than the balance amount.** |
| --- | --- |
| Utterance | {payment\_amount} |
| Response | Your payment amount is more than the balance amount. |
| Prompt | Please tell me a valid amount. |

## TASK: provide\_info

The provide\_info task provides the verified user with the corresponding information.

| **Situation** | **Website Address** |
| --- | --- |
| Utterance | Pay online |
| Response | To make a payment online please visit {OnlinePaymentURL}. |
| Prompt | None. Transfer to [TASK: goodbye](#task-goodbye). |

| **Situation** | **Mailing Address** |
| --- | --- |
| Utterance | Mail address |
| Response | You can mail in a check at the following address, {MailingAddress}. |
| Prompt | None. Transfer to [TASK: goodbye](#task-goodbye). |

## TASK: check\_payment\_method

The check\_payment\_method task verifies the method of payment to be made by the user.

| **Situation** | **Credit Card** |
| --- | --- |
| Utterance | Credit card |
| Response | You chose to pay with a credit card. To pay your balance, in full of {BalanceFull} say "Pay Full". To make a payment in an amount less than the full balance of {BalanceInFull}, say "Pay Partial". |
| Prompt | None. Transfer to[TASK: make\_payment](#task-make\_payment). |

| **Situation** | **ACH** |
| --- | --- |
| Utterance | ACH |
| Response | You chose to pay with ACH.To pay your balance, in full of {BalanceFull} say "Pay Full".To make a payment in an amount less than the full balance of {BalanceInFull}, say "Pay Partial". |
| Prompt | None. Transfer to[TASK: make\_payment](#task-make\_payment). |

## TASK: make\_payment

The make\_payment task verifies the amount of payment and prompts for corresponding information.

| **Situation** | **Credit Card. Full Payment.** |
| --- | --- |
| Utterance | Pay Full |
| Response | To pay the amount of {BalanceFull}, we will need your credit card information. |
| Prompt | Tell me the Credit Card number. |

| **Situation** | **Credit Card. Partial Payment.** |
| --- | --- |
| Utterance | Pay Partial |
| Response | You will now be asked to tell me the amount of your payment including both dollars and cents. |
| Prompt | Please tell me the payment amount now. |

| **Situation** | **Credit Card. Payment Arragement.** |
| --- | --- |
| Utterance | Payment Arrangement |
| Response | You will now be asked to tell me the amount of each payment including both dollars and cents and the frequency of payments. |
| Prompt | Please tell me the payment amount and frequency now. |

| **Situation** | **ACH. Full Payment.** |
| --- | --- |
| Utterance | Pay Full |
| Response | To pay the amount of {BalanceFull}, will need your Bank information. |
| Prompt | Tell me the routing number. |

| **Situation** | **ACH. Partial Payment.** |
| --- | --- |
| Utterance | Pay Partial |
| Response | You will now be asked to tell me the amount of your payment including both dollars and cents. |
| Prompt | Please tell me the payment amount now. |

| **Situation** | **ACH. Payment Arragement.** |
| --- | --- |
| Utterance | Payment Arrangement |
| Response | You will now be asked to tell me the amount of each payment including both dollars and cents and the frequency of payments. |
| Prompt | Please tell me the payment amount and frequency now. |

## TASK: check\_cc

The check\_cc task checks the credit card number.

| **Situation** | **Credit Card Payment.** |
| --- | --- |
| Utterance | {cc\_number} |
| Response | You said {cc\_number}. |
| Prompt | Is that correct? |

| **Situation** | **Credit Card is AMEX.** |
| --- | --- |
| Utterance | {cc\_number} |
| Response | You entered Amex, we accept only Visa, Mastercard or Discover. |
| Prompt | Can you provide us with an accepted credit card? |

| **Situation** | **Credit Card number is not correct.** |
| --- | --- |
| Utterance | {cc\_number} |
| Response | The card number you entered is not valid. {cc_number} |
| Prompt | Please provide a valid cc number. |

## TASK: check\_exp\_date

The check\_exp\_date task checks the credit card expiration date.

| **Situation** | **Credit Card Payment.** |
| --- | --- |
| Utterance | {exp\_date} |
| Response | You said {exp\_date}. |
| Prompt | Is that correct? |

## TASK: check\_cvv

The check\_cvv task checks the credit card cvv.

| **Situation** | **Credit Card Payment.** |
| --- | --- |
| Utterance | {cvv\_number} |
| Response | You said {cvv\_number}. |
| Prompt | Is that correct? |

## TASK: check\_routing\_number

The check\_routing\_number task checks the bank routing number.

| **Situation** | **ACH Payment.** |
| --- | --- |
| Utterance | {bank\_routing\_number} |
| Response | You said {bank\_routing\_number}. |
| Prompt | Is that correct? |

## TASK: check\_bank\_acc\_number

The check\_bank\_acc\_number task checks the bank account number.

| **Situation** | **ACH Payment.** |
| --- | --- |
| Utterance | {bank\_acc\_number} |
| Response | You said {bank\_acc\_number}. |
| Prompt | Is that correct? |

## TASK: check\_bank\_acc\_type

The check\_bank\_acc\_type task checks the bank account type.

| **Situation** | **ACH Payment.** |
| --- | --- |
| Utterance | {bank\_acc\_type} |
| Response | The account type is {bank\_acc\_type}. |
| Prompt | Is that correct? |

## TASK: confirm\_payment

The confirm\_payment task confirms that the caller has agreed to make the payment

| **Situation** | **Payment info ready.** |
| --- | --- |
| Utterance | None. Transferred from the previous task. |
| Response | Before I process your payment, Let's confirm-Today's date is, {CurrentDate}. You are authorizing a payment arrangement totaling {PaymentAmount} over {number_of_payments} payments, every {frequency}, to be taken from your {TypeOfPayment} account ending in, {last\_four\_digits}. |
| Prompt | Do you want to proceed? |

| **Situation** | **Payment arrangement** |
| --- | --- |
| Utterance | None. Transferred from the previous task. |
| Response | Before I process your payment, Let's confirm-Today's date is, {CurrentDate}. You are authorizing the payment of {PaymentAmount} to be taken from your {TypeOfPayment} account ending in , {last\_four\_digits}. |
| Prompt | Do you want to proceed? |

## TASK: payment\_final\_confirmation

The payment\_final\_confirmation task confirms the success of the payment, if not failed.

| **Situation** | **Payment Successful.** |
| --- | --- |
| Utterance | None. transferred from the previous task. |
| Response | This will confirm your payment transaction. |
| Prompt | Do you need additional help? |

| **Situation** | **Payment Failed.** |
| --- | --- |
| Utterance | None. transferred from the previous task. |
| Response | Something went wrong. |
| Prompt | None. Transfer to [TASK: agent\_transfer](#task-agent\_transfer). |

## TASK: yes\_no

The yes-no task handles cases when a user responds to a yes/no question.

| **Situation** | **User said "yes" when asked if it is their name.** |
| --- | --- |
| Utterance | Yes |
| Response | For your account verification say 5 digits of your Zip code or last 4 digits of your Social Security number. |
| Prompt | None. Transfer to [TASK: zip\_ssn\_check](#task-zip\_ssn\_check). |

| **Situation** | **User said "no" when asked if it is their name.** |
| --- | --- |
| Utterance | No |
| Response | None. |
| Prompt | None. Transfer to [TASK: agent\_transfer](#task-agent\_transfer). |

| **Situation** | **CC case. User said "yes" when asked to confirm their payment amount.** |
| --- | --- |
| Utterance | Yes |
| Response | We will need your credit card information. Tell me the Credit Card number. |
| Prompt | None. Handled by check\_cc. |

| **Situation** | **CC case. User said "no" when asked to confirm their payment amount.** |
| --- | --- |
| Utterance | No |
| Response | Alright. |
| Prompt | Please tell me the payment amount again. |

| **Situation** | **CC case. User said "yes" when asked to confirm their credit card number.** |
| --- | --- |
| Utterance | Yes |
| Response | Alright. |
| Prompt | Tell me your card expiration date. The month and the year. Example, March 2026. |

| **Situation** | **CC case. User said "no" when asked to confirm their credit card number..** |
| --- | --- |
| Utterance | No |
| Response | Alright. |
| Prompt | Please tell me the credit card number again. |

| **Situation** | **CC case. User said "yes" when asked to confirm their credit card expiration date.** |
| --- | --- |
| Utterance | Yes |
| Response | Alright. |
| Prompt | Tell me your CVV number located at the back of your card. |

| **Situation** | **CC case. User said "no" when asked to confirm their credit card expiration date.** |
| --- | --- |
| Utterance | No |
| Response | Alright. |
| Prompt | Please tell me the expiration date again. |

| **Situation** | **CC case. User said "yes" when asked to confirm their credit card CVV.** |
| --- | --- |
| Utterance | Yes |
| Response | None.  |
| Prompt | Transfer to [TASK: confirm\_payment.](task-confirm\_payment) |

| **Situation** | **CC case. User said "no" when asked to confirm their credit card CVV.** |
| --- | --- |
| Utterance | No |
| Response | Alright. |
| Prompt | Please tell me the credit card CVV again. |

| **Situation** | **ACH case. User said "yes" when asked to confirm their payment amount.** |
| --- | --- |
| Utterance | Yes |
| Response | We will need your bank account information. Tell me the Routing number. |
| Prompt | None. Handled by check\_routing\_number.. |

| **Situation** | **ACH case. User said "no" when asked to confirm their payment amount.** |
| --- | --- |
| Utterance | No |
| Response | Alright. |
| Prompt | Please tell me the bank routing number again. |

| **Situation** | **ACH case. User said "yes" when asked to confirm their bank routing number.** |
| --- | --- |
| Utterance | Yes |
| Response | Alright. |
| Prompt | Tell me your bank account number. |

| **Situation** | **ACH case. User said "no" when asked to confirm their bank routing number.** |
| --- | --- |
| Utterance | No |
| Response | Alright. |
| Prompt | Please tell me the bank routing number again. |

| **Situation** | **ACH case. User said "yes" when asked to confirm their bank account number.** |
| --- | --- |
| Utterance | Yes |
| Response | Alright. |
| Prompt | Tell me your bank account type by saying "checking" for checking account "savings" for savings account. |

| **Situation** | **ACH case. User said "no" when asked to confirm their bank account number.** |
| --- | --- |
| Utterance | No |
| Response | Alright. |
| Prompt | Please tell me the bank account number again. |

| **Situation** | **ACH case. User said "yes" when asked to confirm their bank account type.** |
| --- | --- |
| Utterance | Yes |
| Response | None. Transfer to [TASK: confirm\_payment.](task-confirm\_payment) |
| Prompt | Transfer to [TASK: confirm\_payment.](task-confirm\_payment) |

| **Situation** | **ACH case. User said "no" when asked to confirm their bank account type.** |
| --- | --- |
| Utterance | No |
| Response | Alright. |
| Prompt | Please tell me the bank account type again. Say "checking" for checking account "savings" for savings account. |

| **Situation** | **User said "yes" when asked to confirm their payment information.** |
| --- | --- |
| Utterance | Yes |
| Response | Alright. Let us process the payment. |
| Prompt | None. Handled by payment\_final\_confirmation. |

| **Situation** | **User said "no" when asked to confirm their payment information.** |
| --- | --- |
| Utterance | No |
| Response | Alright. |
| Prompt | To talk to a representative say "Representative" or "Agent". |

| **Situation** | **User said "yes" when asked if they need any additional help** |
| --- | --- |
| Utterance | Yes |
| Response | Okay. |
| Prompt | None. Transfer to [TASK: agent\_transfer](#task-agent\_transfer). |

| **Situation** | **User said "no" when asked if they need any additional help** |
| --- | --- |
| Utterance | No |
| Response | None. |
| Prompt | None. Transfer to [TASK: goodbye](#task-goodbye). |

## TASK: itemized\_statement

The itemized\_statement task requests itemized statements.

| **Situation** | **The caller requests itemized statements.  (EBO Only)** |
| --- | --- |
| Utterance | Bill. |
| Response | None. |
| Prompt | Please say the mailing address you want the statements sent to. |

## TASK: charity\_application

The charity\_application task is for charity applications.

| **Situation** | **Caller requests a charity application (EBO Only)** |
| --- | --- |
| Utterance | Charity. |
| Response | None. |
| Prompt | Please say the mailing address you want the statements sent to. |

## TASK: mailing\_address

The mailing\_address task is for getting the mailing address from the user.

| **Situation** | **Caller provides mailing address.** |
| --- | --- |
| Utterance | {mailing_address} |
| Response | Your documents will be mailed to {mailing_Address}. |
| Prompt | None. Transfer to [TASK: goodbye.](#task-goodbye) |

## TASK: agent\_transfer

The agent\_transfer task transfers the caller to an agent.

| **Situation** | **The call must be transferred to an agent.** |
| --- | --- |
| Utterance | Agent. |
| Response | Please hold while we connect you with an account representative. This call may be monitored and recorded, for quality assurance purposes. |
| Prompt | None. Transfer call to agent. |

## TASK: goodbye

The goodbye task concludes a call.

| **Situation** | **Session complete.** |
| --- | --- |
| Utterance | Good bye. |
| Response | Thank you for calling {ClientName}. GoodBye. |
| Prompt | None. Hang up. |


## TASK: fallback

The fallback task handles requests that are not handled by any other tasks. 

| **Situation** | **Unknow Request.** |
| --- | --- |
| Utterance | [any-unknown-request] |
| Response | I'm sorry, I did't understand.  |
| Prompt | Could you say that again? |
