/*
 1.내가 please(request)한 needs를 전부 보여주는 API.
 */


//db.js 호출
var session = require('./db');

const requests_history = function(req, reply) {
    console.log("............................requests_history in ");
    var collaboHistory;
    var collaboHistoryArray = new Array();
    var friendsHasNeedProperties = {};
    var friendsHasNeedPropertiesArray = new Array();
    var responseObject = {};
    var count;
    var x=0;

    //3번째 CALLBACK!!!!!
    function callback3 (result){
        console.log("............................callback3 in requests_history");
        for(var x=0; x<result.records.length; x++){
            friendsHasNeedProperties = {
                "uid":result.records[x]._fields[0],
                "mobile":result.records[x]._fields[1],
                "name":result.records[x]._fields[2],
                "image_url":result.records[x]._fields[3]
            };

            friendsHasNeedPropertiesArray[x]=friendsHasNeedProperties;
        }

        responseObject.friendsHasNeed=friendsHasNeedPropertiesArray;

        reply(responseObject);
        console.log("[response]\n" + JSON.stringify(responseObject, null, 2));
        console.log("............................requests_history out");

        session.close();
    }

    //2번째 CALLBACK!!!!!
    function callback2 (result){
        console.log("............................callback2 in requests_history");
        if(count==2){
            for(x=0; x<count; x++){
                if(x==1){x=6};
                collaboHistory={
                    "userid":result.records[0]._fields[x],
                    "createtime":result.records[0]._fields[x+1],
                    "needid":result.records[0]._fields[x+2],
                    "request_id":result.records[0]._fields[x+3],
                    "receiverid":result.records[0]._fields[x+4],
                    "count":result.records[0]._fields[x+5].low
                };
                if(x==6){x=1};
                collaboHistoryArray[x]=collaboHistory;
            }
            responseObject.Requests=collaboHistoryArray;

        }
        else if(count==3){
            for(x=0; x<count; x++){
                if(x==1){x=6} else if(x==2){x=12};
                collaboHistory={
                    "userid":result.records[0]._fields[x],
                    "createtime":result.records[0]._fields[x+1],
                    "needid":result.records[0]._fields[x+2],
                    "request_id":result.records[0]._fields[x+3],
                    "receiverid":result.records[0]._fields[x+4],
                    "count":result.records[0]._fields[x+5].low
                };
                if(x==6){x=1} else if(x==12){x=2};
                collaboHistoryArray[x]=collaboHistory;
            }
            responseObject.Requests=collaboHistoryArray;

        }
        else if(count==4){
            for(x=0; x<count; x++){
                if(x==1){x=6} else if(x==2){x=12} else if(x==3){x=18};
                collaboHistory={
                    "userid":result.records[0]._fields[x],
                    "createtime":result.records[0]._fields[x+1],
                    "needid":result.records[0]._fields[x+2],
                    "request_id":result.records[0]._fields[x+3],
                    "receiverid":result.records[0]._fields[x+4],
                    "count":result.records[0]._fields[x+5].low
                };
                if(x==6){x=1} else if(x==12){x=2} else if(x==18){x=3};
                collaboHistoryArray[x]=collaboHistory;
            }

            responseObject.Requests=collaboHistoryArray;
        }

        session.close();

        //3번째 QUERY!!
        var CQ_RH3 = "MATCH (u1:User {uid:'"+ req.payload.uid +"'})-[:FRIEND]->(u2), " +
            "(r1:Request {request_id:'"+ req.payload.request_id +"'}) " +
            "WITH u1,u2,r1 " +
            "MATCH (u2)-[:RECEIVED]->(r2 {needid:r1.needid}) " +
            "RETURN u2.uid, u2.mobile, u2.name, u2.image_url";
        session
            .run(CQ_RH3)
            .then(callback3)
            .catch(function (error) {
                console.log(error);
            });
    }

    //1번째 CALLBACK!!!!!
    function callback1 (result){
        console.log("............................callback1 in requests_history");
        count=result.records[0]._fields[5].low;

        // 1 depth
        if(count==1){
            collaboHistory={
                "userid":result.records[0]._fields[0],
                "createtime":result.records[0]._fields[1],
                "needid":result.records[0]._fields[2],
                "request_id":result.records[0]._fields[3],
                "receiverid":result.records[0]._fields[4],
                "count":result.records[0]._fields[5].low
            };
            responseObject.Requests = collaboHistory;

            //3번째 QUERY!!
            var CQ_RH3 = "MATCH (u1:User {uid:'"+ req.payload.uid +"'})-[:FRIEND]->(u2), " +
                "(r1:Request {request_id:'"+ req.payload.request_id +"'}) " +
                "WITH u1,u2,r1 " +
                "MATCH (u2)-[:RECEIVED]->(r2 {needid:r1.needid}) " +
                "RETURN u2.uid, u2.mobile, u2.name, u2.image_url";
            session
                .run(CQ_RH3)
                .then(callback3)
                .catch(function (error) {
                    console.log(error);
                });
        }

        // 2 depth
        else if(count==2){
            var CQ_RH2= "MATCH ()-[:RECEIVED]->(a)<-[:PLEASE]-()-[:RECEIVED]->(b {needid:'"+ result.records[0]._fields[2] +"'})<-[:PLEASE]-()-[:PUBLISHED]->(n {need_id:'"+ result.records[0]._fields[2] +"'}) " +
                "WHERE a.receiverid = '"+ req.payload.uid +"' and a.needid='"+ result.records[0]._fields[2] +"' " +
                "RETURN b.userid, b.createtime, b.needid, b.request_id, b.receiverid, b.count, " +
                "a.userid, a.createtime, a.needid, a.request_id, a.receiverid, a.count";
            session
                .run(CQ_RH2)
                .then(callback2)
                .catch(function (error) {
                    console.log(error);
                });
        }
        // 3 depth
        else if(count==3){
            var CQ_RH2= "MATCH ()-[:RECEIVED]->(a)<-[:PLEASE]-()-[:RECEIVED]->(b {needid:'"+ result.records[0]._fields[2] +"'})<-[:PLEASE]-()-[:RECEIVED]->(c {needid:'"+ result.records[0]._fields[2] +"'})<-[:PLEASE]-()-[:PUBLISHED]->(n {need_id:'"+ result.records[0]._fields[2] +"'}) " +
                "WHERE a.receiverid = '"+ req.payload.uid +"' and a.needid='"+ result.records[0]._fields[2] +"' " +
                "RETURN c.userid, c.createtime, c.needid, c.request_id, c.receiverid, c.count, " +
                "b.userid, b.createtime, b.needid, b.request_id, b.receiverid, b.count, " +
                "a.userid, a.createtime, a.needid, a.request_id, a.receiverid, a.count";
            session
                .run(CQ_RH2)
                .then(callback2)
                .catch(function (error) {
                    console.log(error);
                });
        }
        // 4 depth
        else if(count==4){
            var CQ_RH2= "MATCH ()-[:RECEIVED]->(a)<-[:PLEASE]-()-[:RECEIVED]->(b {needid:'"+ result.records[0]._fields[2] +"'})<-[:PLEASE]-()-[:RECEIVED]->(c {needid:'"+ result.records[0]._fields[2] +"'})<-[:PLEASE]-()-[:RECEIVED]->(d {needid:'"+ result.records[0]._fields[2] +"'})<-[:PLEASE]-()-[:PUBLISHED]->(n {need_id:'"+ result.records[0]._fields[2] +"'}) " +
                "WHERE a.receiverid = '"+ req.payload.uid +"' and a.needid='"+ result.records[0]._fields[2] +"' " +
                "RETURN d.userid, d.createtime, d.needid, d.request_id, d.receiverid, d.count, " +
                "c.userid, c.createtime, c.needid, c.request_id, c.receiverid, c.count, " +
                "b.userid, b.createtime, b.needid, b.request_id, b.receiverid, b.count, " +
                "a.userid, a.createtime, a.needid, a.request_id, a.receiverid, a.count";
            session
                .run(CQ_RH2)
                .then(callback2)
                .catch(function (error) {
                    console.log(error);
                });
        }
        session.close();
    }

    //1번째 QUERY!!
    var CQ_RH1 = "MATCH (r:Request) " +
        "WHERE r.receiverid='"+ req.payload.uid +"' and  r.request_id='"+ req.payload.request_id +"' " +
        "return r.userid, r.createtime, r.needid, r.request_id, r.receiverid, r.count";
    session
        .run(CQ_RH1)
        .then(callback1)
        .catch(function (error) {
            console.log(error);
        });
}

// main 함수를 route로 exports!!
module.exports = requests_history;




/* curl로 post 파라미터 보내기~
 curl -X POST -H "Content-Type: application/json" -d '{"uid":"9291c218-8b30-4462-a2d5-992928ad3f3f","request_id":"5aa52517-6914-405c-8842-065b6c7f3f7f"}' -i http://192.168.0.11:3000/requests/history
 */