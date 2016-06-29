/*
 1. 아직 Need 노드의 Properties를 전부 구현하지는 않음.
 properties가 확정이 된 후, 수정이 필요함. (needs_create와 연계가 필요함)

 2. reply를 현재 모든 properties를 response하고 있음. 선택적인 response가 필요할 시 수정.
 */


//db.js 호출
var session = require('./db');

const solutions_close = function(req, reply) {
    console.log("............................solutions_close in ");
    //var now = (new Date).getTime();

    //1번째 CALLBACK!!!!!
    /*function callback1 (result){
     console.log("............................callback1 in needs_close");

     var needProperties = result.records[0]._fields[0].properties;
     //var j2 = result.records[0]._fields[0].properties.need_id;
     //console.log(needProperties);
     reply(needProperties);
     console.log("............................needs_close out ");
     }*/

    //1번째 QUERY!!
    var CQ_SC1 = "MATCH (m {me_id:'"+ req.payload.me_id +"'})" +
        "SET m.state='closed' RETURN m";
    session
        .run(CQ_SC1)
        .subscribe({
            onCompleted: function() {
                // Completed!
                session.close();
            },
            onError: function(error) {
                console.log(error);
            }
        });
    console.log("............................solutions_close out ");
}

// main 함수를 route로 exports!!
module.exports = solutions_close;



/* curl로 post 파라미터 보내기~
 curl -X POST -H "Content-Type: application/json" -d '{"me_id":"13fd1591-be14-4ccb-80b3-c5ec5e1a0df3"}' -i http://192.168.0.11:3000/solutions/close
 */