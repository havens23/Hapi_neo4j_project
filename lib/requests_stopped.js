/*
 1.
 2.
 */

//db.js 호출
var session = require('./db');

const requests_stopped = function(req, reply) {
    console.log("............................requests_stopped in ");

    //1번째 CALLBACK!!!!!
    /*function callback1 (result){
     console.log("............................callback1 in ");
     reply();
     }*/

    //1번째 QUERY!!
    var CQ_RS1 = "MATCH (n:Need {need_id:'"+ req.payload.need_id +"'})" +
        "SET n.state='Cancelled by Please' ";
    session
        .run(CQ_RS1)
        .subscribe({
            onCompleted: function() {
                // Completed!
                session.close();
            },
            onError: function(error) {
                console.log(error);
            }
        })

    console.log("............................requests_stopped out ");
}

// main 함수를 route로 exports!!
module.exports = requests_stopped;



/* curl로 post 파라미터 보내기~
 curl -X POST -H "Content-Type: application/json" -d '{"need_id":"8e93de37-882e-4031-bb06-f394b5e06f75"}' -i http://192.168.0.11:3000/requests/stopped
 */