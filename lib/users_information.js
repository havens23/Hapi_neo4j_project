/*
 1. User의 properties를  보여주는 API.
 */

//db.js 호출
var session = require('./db');

const users_information = function(req, reply) {
    console.log("............................users_information in ");
    var userProperties = {};
    var responseObject = {};
    
    //1번째 CALLBACK!!!!!
    function callback1 (result){
        console.log("............................callback1 in users_information");

        userProperties = {
            "uid" : result.records[0]._fields[0],
            "image_url" : result.records[0]._fields[1],
            "name" : result.records[0]._fields[2],
            "mobile" : result.records[0]._fields[3]
        };

        responseObject = userProperties;
        reply(responseObject);

        console.log("............................users_information out ");
        
        session.close();
    }

    //1번째 QUERY!!
    var CQ_UI1 = "MATCH (u:User {uid:'"+ req.payload.uid +"'}) " +
        "RETURN u.uid, u.image_url, u.name, u.mobile";
    session
        .run(CQ_UI1)
        .then(callback1)
        .catch(function(error){
            console.log("error");
        });
}

// main 함수를 route로 exports!!
module.exports = users_information;



/* curl로 post 파라미터 보내기~
 curl -X POST -H "Content-Type: application/json" -d '{"uid":"e1fe7630-c1f1-4141-9bc0-3854b9f39927"}' -i http://192.168.0.11:3000/users/information
 */