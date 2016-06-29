/*
    1. 나를 초대해준 사람의 친구초대를 수락하는 API.
    2. 나를 초대해준 사람의 uid2는 (friends_sync) 에서 response하기 때문에 알 수 있음.
    3. uid1: 나, uid2: 친구, mobile:나의 번호
*/


//db.js 호출
var session = require('./db');

const friends_accept = function(req, reply) {
    console.log("............................friends_accept in ");

    var now = (new Date).getTime();
    var friendUid;
    var responseObject={};

    //1번째 CALLBACK!!!!!
    function callback1 (result){
        console.log("............................callback1 in friends_accept");
        friendUid=result.records[0]._fields[0];

        responseObject.uid=friendUid;
        
        reply(responseObject);
        //reply(responseObject).redirect('/');
        console.log("............................friends_accept out ");

        session.close();

    }    

    //1번째 QUERY!!
    var CQ_FA1 = "MATCH (u1:User {uid:'"+ req.payload.uid1 +"'} ) ,(u2:User {uid:'"+ req.payload.uid2 +"'}) " +
        "CREATE (u1)-[:FRIEND {createtime:'"+ now +"'}]->(u2) , (u1)<-[:FRIEND {createtime:'"+ now +"'}]-(u2)" +
        "RETURN u2.uid";
    session
        .run(CQ_FA1)
        .then(callback1)
        .catch(function (error) {
            console.log(error);
        });

    //2번째 QUERY!!
    var CQ_FA2 = "MATCH (u:User {uid:'"+ req.payload.uid2 +"'})-[in:INVITE]->(i:Invitation {invitee:'"+ req.payload.mobile +"'}) delete in, i";
    session
        .run(CQ_FA2)
        .subscribe({
            onCompleted: function() {
                // Completed!
                session.close();
            },
            onError: function(error) {
                console.log(error);
            }
        });
}

// main 함수를 route로 exports!!
module.exports = friends_accept;




/* curl로 post 파라미터 보내기~
 curl -X POST -H "Content-Type: application/json" -d '{"uid1":"82eec84f-d200-4e70-acb8-a2c017b87981", "mobile":"01011111111", "uid2":"5b83e448-43aa-45dc-a7cb-49ce02bcc704"}' -i http://192.168.0.11:3000/friends/accept
 */