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
    var count = 0;
    var requestProperties={};
    var requestPropertiesArray = new Array();   
    
    //1번째 CALLBACK!!!!!
    function callback1 (result){
        console.log("............................callback1 in requests_create");
        console.log(count);
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

        requestPropertiesArray[count] = requestProperties;
        
        if(count === req.payload.uids.length-1){
            
            ////////////////// reply!! /////////////////
            reply(requestPropertiesArray);

            console.log("[response]\n" + JSON.stringify(requestPropertiesArray, null, 2));
            console.log("............................requests_create out ");

            session.close();
        }
        count++;
        console.log("............................callback1 out requests_create");
    }
    
    
    for(y=0; y<req.payload.uids.length; y++){
        var uid = uuid.v4();
        var now = (new Date).getTime();

        //1번째 QUERY!!
        var CQ_RC1 = "MATCH (a:User {uid:'"+ req.payload.uid +"'})-[:PUBLISHED]->(n:Need {need_id:'"+ req.payload.need_id +"'}), " +
            "(b:User {uid:'"+ req.payload.uids[y] +"'}) WHERE n.state='opened'" +
            "CREATE (a)-[:PLEASE]->(r:Request {request_id:'"+ uid +"', createtime:'"+ now +"',userid:'"+ req.payload.uid +"'," +
            "receiverid:'"+ req.payload.uids[y] +"', needid:'"+ req.payload.need_id +"',type:'natural', count:1, comment:'null', bookmark:'false'}), " +
            "(b)-[:RECEIVED]->(r)-[:HAS_CONTENT]->(n) " +
            "SET n.count_of_collabo=n.count_of_collabo + 1 " +
            "RETURN r.userid, r.createtime, r.needid, r.request_id, r.receiverid, r.comment, r.count, r.bookmark"
        session
            .run(CQ_RC1)
            .then(callback1)
            .catch(function (error) {
                console.log(error);
            });
    }
    
}

// main 함수를 route로 exports!!
module.exports = requests_create;



/* curl로 post 파라미터 보내기~
 curl -X POST -H "Content-Type: application/json" -d '{"type":"natural","need_id":"cdd76134-8a23-4617-bc34-3df73a31bc1b","uid":"5029720d-12a7-4c04-a053-5d22a7eac97c","uids": ["dbf440fa-45ff-4385-986a-897ac4018722","a80660f6-f708-4bb8-9d9a-c10e77ad3a98"]}' -i http://192.168.0.11:3000/requests/create
 */