/*
    1. user 노드를 생성하는 API.
    2. 전 단계에서 생성된 authenticate 노드는 삭제된다.
*/

//uuid 모듈 호출
var uuid = require('uuid');
//db.js 호출
var session = require('./db');


const users_authenticate = function(req, reply) {
    console.log("-------------------------users_authenticate in");
    var uid = uuid.v4();

    //2번째 CALLBACK!!!!!
    function callback2(result) {
        console.log("-------------------------callback2 in users_authenticate");
        
        var Response_Object={};
        Response_Object.uid=result.records[0]._fields[0].properties.uid;        

        //################### reply #####################
        reply(Response_Object);
        //reply.view('users_register',{uid:Response_Object.uid});
        console.log("-------------------------users_authenticate out ");
        
        session.close();
    }
    
    //1번째 CALLBACK!!!!!
    function callback1(result){
        console.log("-------------------------callback1 in users_authenticate");
          
        var time= result.records[0].get("timeout");
        var now = (new Date).getTime();
        var timeout = parseInt(now)-parseInt(time);        
        
        if (timeout <60000) {
            
            //2번째 QUERY!!
            var CQ_UA2 ="CREATE (b:User {mobile:'"+ req.payload.mobile +"', countrycode:'"+ req.payload.countrycode +"', " +
                "password:'"+ req.payload.password +"', uid:'"+ uid +"', select_of_use:'"+ req.payload.select_of_use +"', " +
                "sms:'"+ req.payload.sms +"', terms_of_use:'true', location_of_use:'true', necessary_of_use:'true', " +
                "commerce_of_use:'true', account_point:0, number_of_friends:0}) RETURN b";
            session
                .run(CQ_UA2)
                .then(callback2)
                .catch(function (error) {
                    console.log(error);
                });
            
            //3번째 QUERY!!
            var CQ_UA3 ="MATCH (a:Authentication {uid:'"+ req.payload.uid +"'}) DELETE a";
            session
                .run(CQ_UA3)
                .subscribe({
                    onCompleted: function() {
                        // Completed!
                        session.close();
                    },
                    onError: function(error) {
                        console.log(error);
                    }
                });
        } else{
            reply('인증번호를 다시 받으세요');
        }

        //session.close();
    }


    //1번째 QUERY!!
    var CQ_UA1 = "MATCH (a:Authentication {uid:'"+ req.payload.uid  +"', authcode:'"+ req.payload.authcode +"'}) RETURN a.timeout AS timeout";
    session
        .run(CQ_UA1)
        .then(callback1)
        .catch(function (error) {
            console.log(error);
        });
}

// main 함수를 route로 exports!!
module.exports = users_authenticate;


/* curl로 post 파라미터 보내기~ 
curl -X POST -H "Content-Type: application/json" -d '{"uid":"17da45c5-11f7-4bb4-8be6-31b796e3ed33", "authcode":588985, "select_of_use":"true","sms":"true", "mobile":"01011111113", "countrycode":81, "password":1234}' -i http://192.168.0.11:3000/users/authenticate
 */