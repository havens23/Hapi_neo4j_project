/*
    1. 친구의 전화번호를 파라미터로 넘겨받아서 Invitation이라는 노드를 생성하고,
        초대 받은 사람의 mobile(invitee)를 response하는 API.
*/

//db.js 호출
var session = require('./db');

const friends_invite = function(req, reply) {
    console.log("............................friends_invite in ");
    var now = (new Date).getTime();
    var err = {};

    //4번째 CALLBACK!!!!!
    function callback4 (result){
        console.log("............................callback4 in friends_invite");
        var Invitee = result.records[0]._fields[0];
        var responseObject = {};
        
        responseObject.invitee=Invitee;       

        //!!!!!!!!!!!!!!! reply !!!!!!!!!!!!!!!!!!!!
        reply(responseObject);
        //reply(responseObject).redirect('/');
        console.log("............................friends_invite result out ");

        session.close();
    }

    //3번째 CALLBACK!!!!!
    function callback3 (){
        console.log("............................callback3 in friends_invite");

        //session.close();

        //4번째 QUERY!!
        var CQ_FI3 = "MATCH (in:Invitation) WHERE in.userid='"+ req.payload.uid +"' and in.invitee='"+ req.payload.mobile +"' " +
            "return in.invitee"
        session
            .run(CQ_FI3)
            .then(callback4)
            .catch(function (error) {
                console.log(error);
            });
    }

    //2번재 CALLBACK!!!!!
    function callback2 (result){
        console.log("............................callback2 in friends_invite");
        if(result.records[0]!==undefined){
            if(result.records[0]._fields[0].low===30){
                err.error = {errorcode:2, error_message:"초대하신 친구는 이미 30명의 친구들과 피플로드를 사용하고 있습니다."};
                return reply(err);
            }
            else if(result.records[0]._fields[1]){
                err.error = {
                    errorcode: 3,
                    error_message: "친구분이 먼저 당신을 초대했네요~",
                    uid: result.records[0]._fields[2]
                };
                return reply(err);
            }    
        }

        //session.close();
        
        //3번째 QUERY!!
        var CQ_FI3 = "CREATE (i:Invitation {userid:'"+ req.payload.uid +"', invitee:'"+ req.payload.mobile +"'}) WITH i MATCH (u:User {uid:'"+ req.payload.uid +"'} ) " +
            "CREATE (u)-[:INVITE {createtime:'"+ now +"'}]->(i)";
        session
            .run(CQ_FI3)
            .then(callback3)
            .catch(function (error) {
                console.log(error);
            });
    }

    //1번째 CALLBACK!!!!!
    function callback1 (result){
        console.log("............................callback1 in friends_invite");
        if(result.records[0]){
            err.error = {errorcode:1, error_message:"이미 초대한 친구입니다."};
            return reply(err);
        }

        //session.close();

        //2번째 QUERY!!
        var CQ_FI2 ="MATCH (a:User {uid:'"+ req.payload.uid +"'}), (u:User {mobile:'"+ req.payload.mobile +"'})" +
            "with a,u OPTIONAL MATCH (u)-[:INVITE]->(i:Invitation {invitee:a.mobile}) " +
            "RETURN u.number_of_friends, i.invitee, u.uid";
        session
            .run(CQ_FI2)
            .then(callback2)
            .catch(function (error) {
                console.log(error);
            });
    }
    //1번째 QUERY!!
    var CQ_FI1 = "MATCH (i:Invitation {invitee:'"+ req.payload.mobile +"'}) RETURN i";
    session
        .run(CQ_FI1)
        .then(callback1)
        .catch(function (error) {
            console.log(error);
        });
}


// main 함수를 route로 exports!!
module.exports = friends_invite;



/* curl로 post 파라미터 보내기~
 curl -X POST -H "Content-Type: application/json" -d '{ "uid":"e1fe7630-c1f1-4141-9bc0-3854b9f39927", "mobile":"01011111151"}' -i http://192.168.0.11:3000/friends/invite
 */