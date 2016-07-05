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
        .subscribe({
            onCompleted: function() {
                // Completed!
                session.close();
            },
            onError: function(error) {
                console.log(error);
            }
        });
    reply(req.payload.me_id);
    console.log("............................needs_called out ");
}

// main 함수를 route로 exports!!
module.exports = needs_called;



/* curl로 post 파라미터 보내기 ~
 curl -X POST -H "Content-Type: application/json" -d '{"need_id":"1c91673c-bd1d-4c57-aeb2-857eed06efb2","me_id":"b8df69fa-b9ce-4673-aceb-abeebd35248f"}' -i http://192.168.0.11:3000/needs/called
 */