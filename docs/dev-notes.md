# Developer Notes

To work with this project you will need to have the [Twilio CLI](https://twilio.com/cli) installed along with the [Dabble Lab Autopilot Plugin](https://www.twilio.com/docs/autopilot/twilio-autopilot-cli) for the Twilio CLI.

### Getting Setup

1. Confirm that Node.js 10.x or later is installed
```
node --version
```

2. Install the Twilio CLI
```
npm install -g twilio-cli
```

3. Authenticate the Twilio CLI
```
twilio login
```

4. Install the Dabble Lab Autopilot Plugin
```
twilio plugins:install @dabblelab/plugin-autopilot
```

### Creating a bot

1. Create a Bot from the `Hello World` template
```
twilio autopilot:init -n my-dev-bot
```
>NOTE: Change the `my-dev-bot` value to the name you want to use

2. Deploy your bot
```
cd my-dev-bot && twilio autopilot:deploy
```
>NOTE: Change the `my-dev-bot` value to the name you used in the prvious step

### Updating the bot model
To make changes to the conversational user interface for a bot you edit the `./my-dev-bot/model/schema.json` file.

**EXAMPLE**
1. Open the `model/schema.json` file
2. Change the value of the `friendlyName` property and save your changes
3. Deploy just the model changes
```
twilio autopilot:deploy -t model
```
4. View your changes in the [Twilio Console](https://twilio.com/console)

### Updating the bot function code
All of the functional code for a bot is contained in a Twilio Functions service that is created when the bot is first deployed. To make updates to the service, you'll modify and deploy changes to code located in `./my-dev-bot/function/functions/`.

**EXAMPLE**
1. Open `function/functions/hello_world.js`
2. Change the `Hello World` message and save your changes
3. Deploy just the function code
```
twilio autopilot:deploy -t function
```
4. View your changes in the [Twilio Console](https://twilio.com/console)

### Testing a bot from the command line
During development you'll likely want to test your bot as you're building. A simple way to do this is with the Autopilot Plugin's `simulate` command.

**EXAMPLE**
1. Get the SID for the bot you want to test
```
twilio autopilot:list
```
2. Send a request using the simulate command
```
twilio autopilot:simulate -t "Hi there" -s {bot-sid}
```
>NOTE: Replace `{bot-sid}` with a SID from a bot listed in the previous step

You should see a response similar to the following.
```json
{
    "response" : {
        "says" : [
            {
                "speech" : "Hello Universe",
                "text" : "Hello Universe"
            }
        ]
    },
    "dialogue" : {
        "sid" : "UKb6eccb10bba7486b9361ab061648ddab",
        "current_task" : "greeting",
        "user_identifier" : "AC382f913ad826955694f8b496161b2f6d",
        "memory" : "{\"twilio\":{\"custom.cli\":{}}}"
    }
}
```

### Exporting Queries
Every time there is a user request to an Autopilot bot it is logged as a `query`. Each query contains includes what the user said and and details about how the request was handled. This is useful when your training and debugging you bot. You can view the queries from the Twilio Console or you can use the Autopilot Plugin's `export:queries` command to export a .csv file containing the query data.

**EXAMPLE**
1. Get the bot SID
```
twilio autopilot:list
```
2. Export the 100 most recent queries
```
twilio autopilot:queries:export -s {bot-sid} -q 100
```
>NOTE: Replace {bot-sid} with a sid from the previous step

3. View the .csv file saved in the project root folder named `{bot-sid}.csv` (where {bot-sid} is the SID for the bot).