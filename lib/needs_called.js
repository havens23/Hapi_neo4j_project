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
        "CREATE (n)-[:CALLED]->(m) SET n.state='Closed by solutionAccept', m.state='Called by needCreator'";
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

    console.log("............................needs_called out ");
}

// main 함수를 route로 exports!!
module.exports = needs_called;



/* curl로 post 파라미터 보내기~
 curl -X POST -H "Content-Type: application/json" -d '{"need_id":"656a87ee-4615-40c0-bb29-adceffaf0020","me_id":"941b8a5a-8238-428c-ad34-de2d52a46f3f"}' -i http://192.168.0.11:3000/needs/called
 */