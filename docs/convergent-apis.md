# Convergent API Documentation

## TFN_Lookup

Returns the client details

_Post URL_: 

http://pecodeviis:Test123!@pecodev.convergentusa.com/Convergent_Main_IVR/Home/TFN_LookUp


_RequestBody Example:_
```json
{
    "PhoneNumber":"8559092691",
    "PhoneNumberTo":"123456789"
}
  ```

_Response Example:_

```json
{
    "PhoneNumber": "8559092691",
    "PhoneNumberTo": "123456789",
    "status": "ok",
    "Returns": "1",
    "ClientName": "Convergent Outsourcing",
    "TFN": "8559092691",
    "NameSpace": "RED",
    "WebPaymentAddress": "payconvergent.com",
    "MailingAddress": " Convergent Outsourcing Incorporated ,   P O Box 9 0 0 4  ,   Renton  ,   Washington ,   9 8 0 5 7",
    "Host": "FACS",
    "TransferAgentNumber": "+18334050479",
    "Channel": "SendGrid Email",
    "IVRUsed": "MainIVR"
}
```


## GetInboundAccountInfo

Returns account details

URL: https://pecodeviis:Test123!@pecodev.convergentusa.com/Convergent_Main_IVR/Home/GetInboundAccountInfo


_RequestBody Example:_

```json
{
"AccountNo": "25868191",  // A/C number the caller entered. Or the caller’s phone number
"NameSpace":"RED",  // coming from the result of TFN_LookUp
"AccountType": "F", // hard coded
"NameType": "P",  // hard coded
"SeedFlag": "1",  // hard coded
"Host": "Convergent", // coming from the result of TFN_LookUp
"PhoneNumber":"+16194687770", // caller’s phone number
"PhoneNumberTo":"+19993602702146", // The phone number they are calling to
"IVRUsed":"MainIVR"
}
```

_Response Example:_

```json
{
    "Status": "OK",
    "Returns": "1",
    "FullName": "HENRY DEBTOR",
    "SSNLastFour": "4444",
    "TotalBalance": "800.00",
    "RouteBalance": "800.00",
    "AutomatedCCFlag": "1",
    "AutomatedCCFee": "0.00",
    "AutomatedACHFlag": "1",
    "AutomatedACHFee": "0.00",
    "ClientClass": "TST",
    "ClientAcct": "321654987",
    "ClientID": "452",
    "FACSAcct": "25868191",
    "PhoneNum": "206-888-8485",
    "AccStatus": "1",
    "Disposition": "3102",
    "LastPayDate": "12311840",
    "LastPayAmnt": "0.00",
    "ZipCd": "98057",
    "SeedAcct": "25868191",
    "PhoneNumber": null,
    "PhoneNumberTo": null,
    "Address1": "PO BOX 9004",
    "Address2": " ",
    "City": "RENTON",
    "State": "WA"
}
```

## Epay_SecurePayment

Updates payment information

_Post URL_: 

https://pecodeviis:Test123!@pecodev.convergentusa.com/Convergent_Main_IVR/Home/Epay_SecurePayment

_RequestBody Example:_

```json
{
    "NameSpace":"RED",
    "Status":null,
    "Returns":null,
    "DSMILACC":"25868191",
    "PMTAMT":"5.00",
    "FREQ":"POI",
    "NOP":"1",
    "StartDate":"2020-11-02",
    "CardName":"HENRY DEBTOR Test",
    "ADD1":"PO BOX 9004",
    "ADD2":"Test",
    "CITY":"RENTON",
    "STATE":"WA",
    "ZIP":"98057",
    "CardTYPE":"mastercard",
    "CARDNO":"5105105105105100",
    "CARDCODE":"777",
    "CDEXPMN":"0728",
    "CDEXPYR":"null",
    "SIGNATURE":"MainIVR",
    "TYPE":"Credit card",
    "CHKNUm":"null",
    "BANKNO":"null",
    "FEECHKNUM":"null",
    "FEEAMT":"null",
    "ACCTY":"null",
    "Host":"FACS",
    "PhoneNumber":"7704627216",
    "PhoneNumberTo":"+14252766034"
}
```

_Response Example:_

```json
{
    "NameSpace": "RED",
    "Status": "OK",
    "Returns": "-1",
    "DSMILACC": "25868191",
    "PMTAMT": "5.00",
    "FREQ": "POI",
    "NOP": "1",
    "StartDate": "2020-11-02",
    "CardName": "HENRY DEBTOR Test",
    "ADD1": "PO BOX 9004",
    "ADD2": "Test",
    "CITY": "RENTON",
    "STATE": "WA",
    "ZIP": "98057",
    "CardTYPE": "MC",
    "CARDNO": "************5100",
    "CARDCODE": "777",
    "CDEXPMN": "07",
    "CDEXPYR": "2028",
    "SIGNATURE": "MainIVR",
    "TYPE": "Credit card",
    "CHKNUm": "null",
    "BANKNO": "null",
    "FEECHKNUM": "null",
    "FEEAMT": "null",
    "ACCTY": "null",
    "Host": "FACS",
    "PhoneNumber": "7704627216",
    "PhoneNumberTo": "+14252766034"
}
```