/* eslint-disable no-undef */
// require the event handler function file
const eventHandler = require('../src/index.js');

test("greeting task returns a 'say' and 'listen' action", (done) => {
  const context = {};
  const event = {
    UserIdentifier: '+14151234567',
    CurrentInput: 'hi',
    CurrentTask: 'greeting',
    Memory: {},
    Channel: 'voice',
  };

  function callback(error, data) {
    if (error) {
      // console.log(`error: ${error}`);
    } else {
      expect.assertions(2);

      // actions array contains a 'say` action/object
      const say = data.actions.find((x) => x.say !== undefined);
      expect(say).toHaveProperty('say');

      // actions array contain a 'listen` action/object
      const listen = data.actions.find((x) => x.listen !== undefined);
      expect(listen).toHaveProperty('listen');

      done();
    }
  }

  // call the function
  eventHandler.handler(context, event, callback);
});

test("fallback task returns a 'say' and 'listen' action", (done) => {
  const context = {};
  const event = {
    UserIdentifier: '+14151234567',
    CurrentInput: 'how many colors are in the rainbow',
    CurrentTask: 'fallback',
    Memory: {},
    Channel: 'voice',
  };

  function callback(error, data) {
    if (error) {
      // console.log(`error: ${error}`);
    } else {
      expect.assertions(2);

      // actions array contains a 'say` action/object
      const say = data.actions.find((x) => x.say !== undefined);
      expect(say).toHaveProperty('say');

      // actions array contain a 'listen` action/object
      const listen = data.actions.find((x) => x.listen !== undefined);
      expect(listen).toHaveProperty('listen');

      done();
    }
  }

  // call the function
  eventHandler.handler(context, event, callback);
});
