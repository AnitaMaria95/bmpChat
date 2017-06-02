var restify = require('restify');
var builder = require('botbuilder');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3000, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId:'',
    appPassword:''
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

bot.use(builder.Middleware.dialogVersion({ version: 1.0, resetCommand: /^reset/i }));

bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^goodbye/i });
bot.beginDialogAction('help', '/help', { matches: /^help/i });
//default
bot.dialog('/', [

    function (session) {
        var card = new builder.HeroCard(session)
            .title("Bpm helper")
            .images([
                 builder.CardImage.create(session, "C:/Users/Ana/Desktop/chat2/image/bpm.png")
            ]);

        session.send(" Hello,I'm the BPM helper . I am here to help and  make you understand basic bmp concepts.");
        var msg = new builder.Message(session).attachments([card]);
        session.send(msg);

        session.beginDialog('/help');
    },
    function (session) {
        builder.Prompts.text(session, 'What is your name?');
    },
    function (session, results){
        session.send('Hello %s!', results.response);
        session.beginDialog('/menu');
    },

    function (session, results) {
        // Always say goodbye
        session.send("Ok,see you later,bye!");
    }
]);

bot.dialog('/menu', [
    function (session) {
        builder.Prompts.choice(session, "What would you like to run?", "picture|info|carousel|actions|(quit)");
    },
    function (session, results) {
        if (results.response && results.response.entity != '(quit)') {
            session.beginDialog('/' + results.response.entity);
        } else {
            session.endDialog();
        }
    },
    function (session, results) {
        // The menu runs a loop until the user chooses to (quit).
        session.replaceDialog('/menu');
    }
]).reloadAction('reloadMenu', null, { matches: /^menu|show menu/i });

bot.dialog('/help', [
    function (session) {
        session.endDialog(" These global commands are available anytime:\n\n* menu - Exits a command  and returns to the menu.\n* goodbye - End this conversation.\n* help - Displays these commands.");
    }
]);

bot.dialog('/picture', [
    function (session) {
        session.send("You can easily send pictures to a user...");
        var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/jpeg",
                contentUrl: "C:/Users/Ana/Desktop/chat/image_thumb.png"
            }]);
        session.endDialog(msg);
    }
]);

bot.dialog('/info', [
    function (session) {
        session.send("Here is some basic info about the app you are using ");

        var msg = new builder.Message(session)
            .attachments([
                new builder.HeroCard(session)
                    .title("Bpmn-JS")
                    .subtitle("It's  a BPMN 2.0 rendering toolkit and web modeler. It is written in JavaScript, embeds BPMN 2.0 diagrams into modern browsers and requires no server backend. That makes it easy to embed it into any web application.")
                    .images([
                        builder.CardImage.create(session, "C:/Users/Ana/Desktop/chat2/image/icon.png")
                    ])
                    .buttons([
                        builder.CardAction.openUrl(session, "https://bpmn.io/", "Website")
                    ])
                    .tap(builder.CardAction.openUrl(session, "https://bpmn.io/"))

            ]);
        //session.send(msg);

        session.endDialog(msg);
    }
]);


bot.dialog('/carousel', [
    function (session) {
        session.send("Some basic apps for modeling bpm process .");
        var msg = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments([
                new builder.HeroCard(session)
                    .title("Activiti(software)")
                    .subtitle("Activiti is an open-source workflow engine written in Java that can execute business processes described in BPMN 2.0.")
                    .images([
                        builder.CardImage.create(session, "C:/Users/Ana/Desktop/chat2/image/activiti.png")
                            .tap(builder.CardAction.showImage(session, "C:/Users/Ana/Desktop/chat2/image/activiti.png")),
                    ])
                    .buttons([
                        builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Activiti_(software)", "Wikipedia"),
                        builder.CardAction.imBack(session, "select:100", "Select")
                    ]),
                new builder.HeroCard(session)
                    .title("Adonis")
                    .subtitle("Adonis is a Business Process Analysis (BPA) tool supporting business process management based on BPMS framework created at the University of Vienna..")
                    .images([
                        builder.CardImage.create(session, "C:/Users/Ana/Desktop/chat2/image/adonis.png")
                            .tap(builder.CardAction.showImage(session, "C:/Users/Ana/Desktop/chat2/image/adonis.png")),
                    ])
                    .buttons([
                        builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/ADONIS_(software)", "Wikipedia"),
                        builder.CardAction.imBack(session, "select:101", "Select")
                    ]),
                new builder.HeroCard(session)
                    .title("Aris")
                    .subtitle("Aris Express is a free-of-charge modeling tool for business process analysis and management. It supports different modeling notations such as BPMN 2, Event-driven Process Chains (EPC), Organizational charts, process landscapes, whiteboards, etc")
                    .images([
                        builder.CardImage.create(session, "C:/Users/Ana/Desktop/chat2/image/aris.jpg")
                            .tap(builder.CardAction.showImage(session, "C:/Users/Ana/Desktop/chat2/image/aris.jpg"))
                    ])
                    .buttons([
                        builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/ARIS_Express", "Wikipedia"),
                        builder.CardAction.imBack(session, "select:102", "Select")
                    ])
            ]);
        session.send("You can even select one");
        builder.Prompts.choice(session, msg, "select:100|select:101|select:102");
        session.beginDialog('/menu');
    },
    function (session, results) {
        var action, item;
        var kvPair = results.response.entity.split(':');
        switch (kvPair[0]) {
            case 'select':
                action = 'selected';
                break;
        }
        switch (kvPair[1]) {
            case '100':
                item = "activiti(software)";
                break;
            case '101':
                item = "adonis";
                break;
            case '102':
                item =  "aris";
                break;
        }
        session.endDialog('You %s "%s"', action, item);


    },
    function(session,results){

        session.beginDialog('/menu');
    }
]);


bot.dialog('/actions', [
    function (session) { 
        session.send("I can help you learn more about this app please select one off the actions below");

        var msg = new builder.Message(session)
            .attachments([
                new builder.HeroCard(session)
                    .title("Bpmn-JS")
                    .subtitle("Here are some basic commands please select one")
                    .buttons([
                        builder.CardAction.call(session, "drawBtn1", "Draw startEvent"),
                        builder.CardAction.call(session, "drawBtn2", "Draw timerEvent"),
                        builder.CardAction.call(session, "drawBnt3", "Draw endEvent")

                    ])

            ]);
        session.send(msg);
        session.beginDialog('/menu');
    }
]);

bot.dialog('flip', [
    function (session, args) {
        builder.Prompts.choice(session, "Choose heads or tails.", "heads|tails", { listStyle: builder.ListStyle.none })
    },
    function (session, results) {
        var flip = Math.random() > 0.5 ? 'heads' : 'tails';
        if (flip == results.response.entity) {
            session.endDialog("It's %s. YOU WIN!", flip);
        } else {
            session.endDialog("Sorry... It was %s. you lost :(", flip);
        }
    }
]).triggerAction({ matches: /flip/i });


/*bot.dialog('/ensureProfile', [
    function (session, args, next) {
        session.dialogData.profile = args || {};
        if (!session.dialogData.profile.name) {
            builder.Prompts.text(session, "What's your name?");
        } else {
            next();
        }
    },
    function (session, results, next) {
        if (results.response) {
            session.dialogData.profile.name = results.response;
        }
        if (!session.dialogData.profile.company) {
            builder.Prompts.text(session, "What company do you work for?");
        } else {
            next();
        }
    },
    function (session, results) {
        if (results.response) {
            session.dialogData.profile.company = results.response;
        }
        session.endDialogWithResult({ response: session.dialogData.profile });
    }
]);*/

