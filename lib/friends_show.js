/*
    1. 내 친구의 properties를  보여주는 API.
*/


//db.js 호출
var session = require('./db');

const friends_show = function(req, reply) {
    console.log("............................friends_show in ");
    var friendPropertiesArray = new Array();
    var friendProperties;
    var responseObject = {};

    //1번째 CALLBACK!!!!!
    function callback1 (result){
        console.log("............................callback1 in friendsshow");
        for(var x=0; x<result.records.length; x++){
            friendProperties = {
                "uid":result.records[x]._fields[0],
                "mobile":result.records[x]._fields[1],
                "name":result.records[x]._fields[2],
                "image_url":result.records[x]._fields[3]
            };
            
            friendPropertiesArray[x]=friendProperties;
        }
        
        responseObject.friends=friendPropertiesArray;
        reply(responseObject);
        //reply.view('friends_show',{properties:responseObject.friends});
        console.log("............................friends_show out ");
        
        session.close();
    }

    //1번째 QUERY!!
    var CQ_FS1 = "MATCH (u1:User {uid:'"+ req.payload.uid +"'})-[:FRIEND]->(n) return n.uid, n.mobile, n.name, n.image_url";
    session
        .run(CQ_FS1)
        .then(callback1)
        .catch(function (error) {
            console.log(error);
        });
}

// main 함수를 route로 exports!!
module.exports = friends_show;



/* curl로 post 파라미터 보내기~
 curl -X POST -H "Content-Type: application/json" -d '{"uid":"cbc978bb-941e-469a-be98-e58dacc18251"}' -i http://192.168.0.11:3000/friends/show
 */