/*
    1.내가 please(request)한 needs와 requests 노드를 전부 보여주는 API.
 */


//db.js 호출
var session = require('./db');

const requests_show_request = function(req, reply) {
    console.log("............................requests_show_request in ");
    var needProperties = {};
    var requestProperties = {};
    var needPropertiesArray = new Array();
    var requestPropertiesArray = new Array();
    var responseObject={};

    //1번째 CALLBACK!!!!!
    function callback1 (result){
        console.log("............................callback1 in requests_show_request");

        for(var x=0; x<result.records.length; x++){
            needProperties = {
                "createtime" : result.records[x]._fields[0],
                "need_id" : result.records[x]._fields[1],                
                "image_url" : result.records[x]._fields[2],
                "endtime" : result.records[x]._fields[3],
                "starttime" : result.records[x]._fields[4],
                "thumbnail_url" : result.records[x]._fields[5],
                "type" : result.records[x]._fields[6],
                "content" : result.records[x]._fields[7],
                "bet_point" : result.records[x]._fields[8],
                "tag" : result.records[x]._fields[9],
                "state" : result.records[x]._fields[10],
                "category" : result.records[x]._fields[11],
                "author_id" : result.records[x]._fields[12],
                "author_name" : result.records[x]._fields[13],
                "count_of_me" : result.records[x]._fields[14].low,
                "count_of_collabo" : result.records[x]._fields[15].low,
                "count_of_comment" : result.records[x]._fields[16].low
            };
            needPropertiesArray[x] = needProperties;

            requestProperties={
                "userid" : result.records[x]._fields[17],
                "createtime" : result.records[x]._fields[18],
                "needid" : result.records[x]._fields[19],
                "request_id" : result.records[x]._fields[20],
                "receiverid" : result.records[x]._fields[21],
                "comment" : result.records[x]._fields[22],
                "count" : result.records[x]._fields[23].low
            };
            requestPropertiesArray[x] = requestProperties;
        }
        
        // 중복제거!!!
        var uniq = needPropertiesArray.reduce(function(a,b){
            if (a.indexOf(b) < 0 ) a.push(b);
            return a;},[]);

        responseObject.Needs = uniq;
        responseObject.Requests = requestPropertiesArray;

        reply(responseObject);
        console.log("[response]\n" + JSON.stringify(responseObject, null, 2));
        console.log("............................requests_show_request out");
        
        session.close();
    }

    //1번째 QUERY!!
    var CQ_RSR1 = "MATCH (u:User {uid:'"+ req.payload.uid +"'})-[:PLEASE]->(r:Request)-[:HAS_CONTENT]->(n:Need) with u,r,n " +
        "MATCH (n)<-[h:HAS_CONTENT]-() " +
        "WITH n,r,count(h) AS hs " +
        "SET n.count_of_collabo=hs " +
        "RETURN n.createtime, n.need_id, n.image_url, n.endtime, n.starttime, n.thumbnail_url, n.type, n.content, n.bet_point, n.tag, n.state, " +
        "n.category, n.author_id, n.author_name, n.count_of_me, n.count_of_collabo, n.count_of_comment, " +
        "r.userid, r.createtime, r.needid, r.request_id, r.receiverid, r.comment, r.count";
    session
        .run(CQ_RSR1)
        .then(callback1)
        .catch(function (error) {
            console.log(error);
        });
}


// main 함수를 route로 exports!!
module.exports = requests_show_request;



/* curl로 post 파라미터 보내기~
 curl -X POST -H "Content-Type: application/json" -d '{"uid":"7bf99ea1-5da6-4204-b2e1-7d9b9808f71c"}' -i http://192.168.0.11:3000/requests/show_request
 */