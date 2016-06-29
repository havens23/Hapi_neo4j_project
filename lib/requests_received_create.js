/*
 1. 나에게 온 needs를 한명 or 여러명한테 동시에 플리즈하는 API.
 */


//uuid 모듈 호출
var uuid = require('uuid');
//db.js 호출
var session = require('./db');

const requests_received_create = function(req, reply) {
    console.log("............................requests_received_create in ");
    var x=0,y=0;
    var uid = uuid.v4();
    var now = (new Date).getTime();
    var requestProperties = {};
    var stringUids1;
    var stringUids2;

    stringUids1="'"+req.payload.uids[x]+"'";
    for(var x=1; x<req.payload.uids.length; x++) {
        //console.log("............................for문 in ");
        //console.log("............................ "+req.payload.uids[x]);
        stringUids1+=",'"+req.payload.uids[x]+"'";
    }

    //3번째 CALLBACK!!!!!
    function callback3 (result){
        console.log("............................callback3 in requests_received_create");
        requestProperties={
            "userid" : result.records[0]._fields[0],
            "createtime" : result.records[0]._fields[1],
            "needid" : result.records[0]._fields[2],
            "request_id" : result.records[0]._fields[3],
            "receiverid" : result.records[0]._fields[4],
            "comment" : result.records[0]._fields[5],
            "count" : result.records[0]._fields[6].low,
            "bookmark" : result.records[0]._fields[7]
        }
        
        reply(requestProperties);
        console.log("[response]\n" + JSON.stringify(requestProperties, null, 2));
        console.log("............................requests_received_create out ");

        session.close();
    }

    //2번째 CALLBACK!!!!!
    function callback2 (result){
        console.log("............................callback2 in requests_received_create");
        
        var count = result.records[0]._fields[0].low;        
        
        if(count===4){
            return reply("더이상 플리즈가 불가능합니다");
        }

        count = count + 1;

        session.close();

        //3번째 QUERY!!
        var CQ_RRC3 = "UNWIND ["+stringUids2+"] AS recv " +
            "WITH recv, count(recv) AS nc " +
            "MATCH (a:User {uid:'"+ req.payload.uid +"'}), (b:User {uid:recv}), (n:Need {need_id:'"+ req.payload.need_id +"'}) " +
            "CREATE (a)-[:PLEASE]->(r:Request {request_id:'"+ uid +"',createtime:'"+ now +"',userid:'"+ req.payload.uid +"'," +
            "receiverid:recv, needid:'"+ req.payload.need_id +"',type:'retweet', count:"+ count +", comment:'"+ req.payload.comment +"', bookmark:'false'}), " +
            "(b)-[:RECEIVED]->(r)-[:HAS_CONTENT]->(n)" +
            "SET n.count_of_collabo=n.count_of_collabo + nc " +
            "RETURN r.userid, r.createtime, r.needid, r.request_id, r.receiverid, r.comment, r.count, r.bookmark";
        session
            .run(CQ_RRC3)
            .then(callback3)
            .catch(function (error) {
                console.log(error);
            });
    }

    //1번째 CALLBACK!!!!!
    function callback1 (result) {
        console.log("............................callback1 in requests_received_create");

        if (result.records.length == 0) {
            return reply("콜라보 가능한 친구가 없습니다");
        }

        stringUids2 = "'" + result.records[0]._fields[0] + "'";

        for (y = 1; y < result.records.length; y++) {
            stringUids2 += ",'" + result.records[y]._fields[0] + "'";
        }

        session.close();

        //2번째 QUERY!!
        var CQ_RRC2 = "MATCH (r:Request)" +
            "WHERE r.needid='" + req.payload.need_id + "' and r.receiverid='" + req.payload.uid + "'" +
            "RETURN r.count";
        session
            .run(CQ_RRC2)
            .then(callback2)
            .catch(function (error) {
                console.log(error);
            });
    }

    //1번째 QUERY!!
    var CQ_RRC1 = "UNWIND ["+ stringUids1 +"] AS recv " +
        "MATCH (u1:User {uid:recv}),(u2:User {uid:'"+ req.payload.uid +"'}),(n:Need {need_id:'"+ req.payload.need_id +"'}) " +
        "WHERE NOT (u1)-[]->()-[]->(n) RETURN u1.uid";
    session
        .run(CQ_RRC1)
        .then(callback1)
        .catch(function (error) {
            console.log(error);
        });
}

// main 함수를 route로 exports!!
module.exports = requests_received_create;



/* curl로 post 파라미터 보내기~
 curl -X POST -H "Content-Type: application/json" -d '{"comment":"니가 도와줘!","need_id":"13b07fc6-140e-426b-becc-1bef12f6be0d","uid":"9291c218-8b30-4462-a2d5-992928ad3f3f","uids":["0bf4026f-52c3-485a-8252-8981fb004942"]}' -i http://192.168.0.11:3000/requests/received_create
 */