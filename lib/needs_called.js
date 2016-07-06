/*
 1.
 2.
 */

//uuid 모듈 호출
var uuid = require('uuid');
//db.js 호출
var session = require('./db');

const needs_called = function(req, reply) {
    console.log("............................needs_called in ");
    var responseObject = {};
    responseObject.me_id = req.payload.me_id;
    //1번째 CALLBACK!!!!!
    /*function callback1 (result){
        console.log("............................callback1 in needs_called");



        reply();
        console.log("............................needs_called out ");
    }*/

    //1번째 QUERY!!
    var CQ_NC1 = "MATCH (n:Need {need_id:'"+ req.payload.need_id +"'}), (m:Me {me_id:'"+ req.payload.me_id +"'}) " +
        "CREATE (n)-[:CALLED]->(m) SET n.state='Closed by solutionAccept', m.state='Called by needCreator' ";
    session
        .run(CQ_NC1)
        /*.subscribe({
            onCompleted: function() {
                // Completed!
                session.close();
            },
            onError: function(error) {
                console.log(error);
            }
        });*/
    reply(responseObject);
    console.log("............................needs_called out ");
}

// main 함수를 route로 exports!!
module.exports = needs_called;



/* curl로 post 파라미터 보내기 ~
 curl -X POST -H "Content-Type: application/json" -d '{"need_id":"cdd76134-8a23-4617-bc34-3df73a31bc1b","me_id":"05c33614-32b7-4337-a959-f9445ab12da7"}' -i http://192.168.0.11:3000/needs/called
 */