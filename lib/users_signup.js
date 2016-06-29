//uuid 모듈 호출
var uuid = require('uuid');
//db.js 호출
var session = require('./db');

const users_signup = function(req, reply) {
    console.log("............................users_signup in ");

    var uid = uuid.v4();
    var authcode = Math.floor((Math.random() * 1000000) + 1);
    var now = (new Date).getTime();

    //2번째 CALLBACK!!!!!
    function callback2 (result){
        console.log("............................callback2 in users_signup");
        var userProperties = result.records[0]._fields[0].properties;

        //################### reply #####################
        reply(userProperties);
        //reply.view('users_authenticate', {uid:userProperties.uid,
        //    authcode:userProperties.authcode, mobile:userProperties.mobile});
        
        console.log("............................users_signup out ");
        
        session.close();
    }
    
    //1번째 CALLBACK!!!!!
    function callback1 (result){
        console.log("............................callback1 in users_signup");
        //console.log("............................result"+result);

        //result.record[0]이 null 인데 result.record[0]._field[0]으로 조건문을 형성하면 이하 코드가 전부 실행이 안되는 현상이 발생함.
        if(result.records[0]){
            var err = {};
            err.error = {
                errorcode: 1, 
                error_message: "이미 가입한 사용자",
                uid: result.records[0]._fields[0].properties.uid
            };
            return reply(err);
        }
        
        session.close();
        
        //2번째 QUERY!!
        var CQ_US2 = "MERGE (au:Authentication {mobile:'"+ req.payload.mobile +"'}) SET au.authcode='"+ authcode +"', au.timeout='"+ now +"'" +
                     ", au.uid='"+ uid +"' RETURN au";
        session
            .run(CQ_US2)
            .then(callback2)
            .catch(function (error) {
                console.log(error);
            });
    }
    
    //1번째 QUERY!!
    var CQ_US1 ="match (u:User {mobile:'"+ req.payload.mobile +"'}) return u"
    session
        .run(CQ_US1)
        .then(callback1)
        .catch(function (error) {
            console.log(error);
        });
}

// main 함수를 route로 exports!!
module.exports = users_signup;


/* curl로 post 파라미터 보내기~ 
curl -X POST -H "Content-Type: application/json" -d '{"mobile": "01011111116"}' -i http://192.168.0.11:3000/users/signup
 */