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
    //host: '192.168.0.11',
    port: 3000
});

/////////////////////job scheduleling test////////////////////////
/*
var rule1 = new schedule.RecurrenceRule();

rule1.minute = 30;
var scheduledJob2 = schedule.scheduleJob(rule1,
    function(){

        console.log('[2] 서버 정상 작동 중!!');

        var formData = {
            body: '[[Webhook-Jandi connection 테스트!]]', //Body text (Required)
            connectColor: '#FAC11B', //Hex code color of attachment bar
            connectInfo: [{
                title: 'New User', //1st attachment area title
                description: 'havens98' //1st attachment description
            },
                {
                    title: 'Job Scheduling', //2nd attachment area title
                    description: '1시간에 한번 씩 새로 가입한 유저를 DB에서 자동으로 검색하여 잔디로 뉴 유저 목록을 보내는 테스트임' +
                    '로컬에서 테스트 결과, 메세지 전송 Success! 애스키모 DB와 연동하고, 서버에 deploy 하면 끝.', //2nd attachment description
                }]
        }

        var options = {
            url: 'https://wh.jandi.com/connect-api/webhook/11529224/c1677a924caae6a02b687d303ca01238',
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
*/

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
