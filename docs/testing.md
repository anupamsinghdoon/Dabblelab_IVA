# Testing

This document provides an overview of how testing is done for this project.

## Test Environment

As of 2020-11-11 there is a test number which is **1 (415) 366-1006**. This number can be called to test the IVA.

> NOTE: Keep in mind this is not a production number and while dev updates are made it might not function correctly.

## Unit Testing

For unit testing we're using the [Jest JavaScript Testing Framework](https://jestjs.io/). 

_**Install Jest as a dev dependancy**_

```
npm install -D jest
```

_**Creating Tests**_

1. Create a `{name}.test.js` file for the `{name}.js` file you want to test. For example, if you want to test `index.js` you'd create a file named `index.test.js`.

2. Write the test code

```javascript
// reference to function with exports.handler
const eventHandler = require('../src/index.js');

test('the greeting contains the word hi', done => {
    const context = {};
    const event = {
        "AccountSid": "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1",
        "AssistantSid": "UAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1",
        "DialogueSid": "UKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1",
        "date_created": "",
        "UserIdentifier": "+14151234567",
        "CurrentInput": "how many colors are in the rainbow",
        "CurrentTask": "fallback",
        "DialoguePayloadUrl": "https://autopilot.twilio.com/v1/Assistants/UAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1/Dialogues/UKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1",
        "Memory": {},
        "Channel": "voice"
    }

    function callback(error, data) {
        if (error) {
            console.log('error: ' + error);
        } else {
            //console.log(JSON.stringify(data));
            expect.assertions(1);
            expect(data.actions[0].say.speech).toMatch(/Hi/);
            done();
        }
    }

    // call the function
    eventHandler.handler(context, event, callback);
});

test('the fallback task response contains the word sorry', done => {
    const context = {};
    const event = {
        "AccountSid": "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1",
        "AssistantSid": "UAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1",
        "DialogueSid": "UKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1",
        "date_created": "",
        "UserIdentifier": "+14151234567",
        "CurrentInput": "how many colors are in the rainbow",
        "CurrentTask": "fallback",
        "DialoguePayloadUrl": "https://autopilot.twilio.com/v1/Assistants/UAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1/Dialogues/UKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1",
        "Memory": {},
        "Channel": "voice"
    }

    function callback(error, data) {
        if (error) {
            console.log('error: ' + error);
        } else {
            //console.log(JSON.stringify(data));
            expect.assertions(1);
            expect(data.actions[0].say.speech).toMatch(/sorry/);
            done();
        }
    }

    // call the function
    eventHandler.handler(context, event, callback);
});
```

3. Run the test 
> NOTE: The script needs to be setup in the `package.json` like the example below.
> ```
> {
>   "scripts": {
>     "test": "jest"
>   }
> }
> ```

4. Review the test results.