/*
    1. 친구관계를 삭제하는 API.
    2. 친구관계를 삭제할 때, 상대방이 자신이 삭제된 것을 알 필요하 있는지 정의가 필요함.
    3. 현재는 양쪽의 관계를 모두 삭제도록 구현됨.
*/


//db.js 호출
var session = require('./db');

const friends_block = function(req, reply) {
    console.log("............................friends_block in ");
    var User_Uid, Friend_Uid;
    var Response_Object={};

    //1번째 CALLBACK!!!!!
    /*function callback1 (result){
        console.log("............................callback1 in friends_block");
    }*/

    //1번째 QUERY!!
    var CQ_FD1 = "MATCH (a:User{uid:'"+ req.payload.uid1 +"'}), (b:User{uid:'"+ req.payload.uid2 +"'}) " +
        "MATCH (a)-[c:FRIEND]->(b),(b)-[d:FRIEND]->(a) DETACH DELETE c,d";
    session
        .run(CQ_FD1)
        .subscribe({
            onCompleted: function() {
                // Completed!
                session.close();
            },
            onError: function(error) {
                console.log(error);
            }
        });

    console.log("............................friends_block out ");
}

// main 함수를 route로 exports!!
module.exports = friends_block;


/* curl로 post 파라미터 보내기~
 curl -X POST -H "Content-Type: application/json" -d '{"uid1":"de220d83-9dd0-4feb-a5e5-abb975b2eda5","uid2":"76048ef4-13b4-4407-86aa-97e7a7127b65"}' -i http://192.168.0.11:3000/friends/delete
 */