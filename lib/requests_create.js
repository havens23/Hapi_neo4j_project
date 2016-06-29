/*
    1. 내가 생성한 need를 한명 or 여러명한테 동시에 플리즈하는 API.
    2. response 로, 생성된 request 노드의 properties를 전송.  
 */


//uuid 모듈 호출
var uuid = require('uuid');
//db.js 호출
var session = require('./db');

const requests_create = function(req, reply) {
    console.log("............................requests_create in ");
    var x=0, y=0;
    var uid = uuid.v4();
    var now = (new Date).getTime();
    var requestProperties={};
    var stringUids1;    

    stringUids1="'"+req.payload.uids[x]+"'";
    for(var x=1; x<req.payload.uids.length; x++) {
        //console.log("............................for문 in ");
        //console.log("............................ "+req.payload.uids[x]);
        stringUids1+=",'"+req.payload.uids[x]+"'";
    }

    //1번째 CALLBACK!!!!!
    function callback1 (result){
        console.log("............................callback1 in requests_create");
        
        requestProperties={
            "userid" : result.records[0]._fields[0],
            "createtime" : result.records[0]._fields[1],
            "needid" : result.records[0]._fields[2],
            "request_id" : result.records[0]._fields[3],
            "receiverid" : result.records[0]._fields[4],
            "comment" : result.records[0]._fields[5],
            "count" : result.records[0]._fields[6].low,
            "bookmark" : result.records[0]._fields[7]
        };
        ////////////////// reply!! /////////////////
        reply(requestProperties);
       
        console.log("[response]\n" + JSON.stringify(requestProperties, null, 2));
        console.log("............................requests_create out ");

        session.close();
    }
    
    //1번째 QUERY!!
    var CQ_RC1 = "UNWIND ["+ stringUids1 +"] AS recv " +
        "WITH recv, count(recv) AS nc " +
        "MATCH (a:User {uid:'"+ req.payload.uid +"'})-[:PUBLISHED]->(n:Need {need_id:'"+ req.payload.need_id +"'}), " +
        "(b:User {uid:recv}) WHERE n.state='opened'" +
        "CREATE (a)-[:PLEASE]->(r:Request {request_id:'"+ uid +"',createtime:'"+ now +"',userid:'"+ req.payload.uid +"'," +
        "receiverid:recv, needid:'"+ req.payload.need_id +"',type:'natural', count:1, comment:'null', bookmark:'false'}), " +
        "(b)-[:RECEIVED]->(r)-[:HAS_CONTENT]->(n) " +
        "SET n.count_of_collabo=n.count_of_collabo + nc " +
        "RETURN r.userid, r.createtime, r.needid, r.request_id, r.receiverid, r.comment, r.count, r.bookmark";
    session
        .run(CQ_RC1)
        .then(callback1)
        .catch(function (error) {
            console.log(error);
        });
}

// main 함수를 route로 exports!!
module.exports = requests_create;



/* curl로 post 파라미터 보내기~
 curl -X POST -H "Content-Type: application/json" -d '{"type":"natural","need_id":"13b07fc6-140e-426b-becc-1bef12f6be0d","uid":"e1fe7630-c1f1-4141-9bc0-3854b9f39927","uids": ["8a0e2435-21f6-4e0f-951f-b40329cc494e"]}' -i http://192.168.0.11:3000/requests/create
 */