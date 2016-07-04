const Hapi = require('hapi');

// webhook 연동 테스트 모듈
const schedule = require('node-schedule');
var request = require('request');

// Path, Inert, server는 파일 업로드 테스트가 끝나면 삭제!!
const Path = require('path');
const Inert = require('inert');
const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public/images')
            }
        }
    }
});

server.connection({
    host: '192.168.0.11',
    port: 3000
});

//job scheduleling test

var rule1 = new schedule.RecurrenceRule();

rule1.minute = 51;

var scheduledJob2 = schedule.scheduleJob(rule1,
    function(){

        console.log('[2] 서버 정상 작동 중!!');

        var formData = {
            body: '[[PizzaHouse]](http://url_to_text) You have a new Pizza order.', //Body text (Required)
            connectColor: '#FAC11B', //Hex code color of attachment bar
            connectInfo: [{
                title: 'Topping', //1st attachment area title
                description: 'Pepperoni' //1st attachment description
            },
                {
                    title: 'Location', //2nd attachment area title
                    description: 'Empire State Building, 5th Ave, New York', //2nd attachment description
                    imageUrl: 'http://url_to_text' //Image URL
                }]
        }

        var options = {
            url: 'https://wh.jandi.com/connect-api/webhook/12210821/1b7cb6ccb9975f860c744166c3557990',
            headers: {
                "Content-type": "application/json",
                "Accept": "application/vnd.tosslab.jandi-v2+json"
            },
            form: formData
        };
        request.post(options, function (err, response, body) {
            if (err) {
                console.error('err: ', err);
                return;
            }

            console.log('body: ', body);
            return;


        });
    }
);

//Route configuration
server.register({
    register: require('hapi-router'),
    options: {
        routes: './routes/*.js', // uses glob to include files
    }
}, function (err) {
    if (err) throw err;
});


// jade configuration
server.register(require('vision'), function(err) {
    if (err) {
        throw err;
    }
    server.views({
        engines: { jade: require('jade') },
        path: __dirname + '/templates',
        compileOptions: {
            pretty: true
        }
    });
});

/////////////////////////////////////////////////////////////////
// file download configuration

server.register(Inert, function(){});
server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: '.',
            redirectToSlash: true,
            index: true
        }
    }
});
/////////////////////////////////////////////////////////////////

// Start the server
server.start(function(err){
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
