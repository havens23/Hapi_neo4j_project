/*
 1. 나에게 온 needs를 보여주는 API. (1~4차 뎁스까지 한번에 보여줌.)
 */

//db.js 호출
var session = require('./db');

const bookmarks = function(req, reply) {
    console.log("............................bookmarks in ");    

    //1번째 QUERY!!
    var CQ_B1 = "MATCH (u:User {uid:'"+ req.payload.uid +"'})-[:RECEIVED]->(r:Request {request_id:'"+ req.payload.request_id +"'}) " +
        "SET r.bookmark='true'";        
    session
        .run(CQ_B1)
        .subscribe({
            onCompleted: function() {
                // Completed!
                session.close();
            },
            onError: function(error) {
                console.log(error);
            }
        });

    console.log("............................bookmarks out ");
}

// main 함수를 route로 exports!!
module.exports = bookmarks;



/* curl로 post 파라미터 보내기~
 curl -X POST -H "Content-Type: application/json" -d '{"uid":"8a0e2435-21f6-4e0f-951f-b40329cc494e", "request_id":"30552efb-0d38-4295-a3c9-c9e65838749e"}' -i http://192.168.0.11:3000/bookmarks
*/