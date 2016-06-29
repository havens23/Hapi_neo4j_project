/*
    1. 나의 need를 response 해주는 API. (response 해줘야하는 properties는 아직 미정. 정해지면, 코드 수정이 필요!)

    2. 나에게 온 needs를 response 해주는 API는 (### Requests_Received에서 구현 ###)
 */

//db.js 호출
var session = require('./db');

const
needs_show_need = function(req, reply) {
    console.log("............................needs_show_need in ");
    var needProperties;
    var needPropertiesArray = new Array();
    var responseObject = {};

    // 1번째 CALLBACK!!!!!
    function callback1(result) {
        console.log("............................callback1 in needs_show_need");
        console.log(result.records[0]);

        if (result.records[0] === undefined) {
            console.log(responseObject);
            responseObject.Needs = [];
            return reply(responseObject);
        }
        
        for (var x = 0; x < result.records.length; x++) {            
            needProperties = {
                "need_id" : result.records[x]._fields[0],
                "createtime" : result.records[x]._fields[1],
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
        }

        responseObject.Needs = needPropertiesArray;
        //console.log("[response]\n" + JSON.stringify(responseObject, null, 2));
        
        reply(responseObject);
        console.log("[response]\n" + JSON.stringify(responseObject, null, 2));
        // reply.view('needs_show',{properties:responseObject.Needs});
        console.log("............................needs_show_need out ");
        
        session.close();
    }

    // 1번째 QUERY!!
    var CQ_NSN1 = "MATCH(u:User{uid:'"+req.payload.uid+"'})-[p:PUBLISHED]->(n:Need) " +
        "RETURN n.need_id, n.createtime, n.image_url, n.endtime, n.starttime, n.thumbnail_url, n.type, n.content," +
        "n.bet_point, n.tag, n.state, n.category, n.author_id, n.author_name, n.count_of_me, n.count_of_collabo, n.count_of_comment";
    session
        .run(CQ_NSN1)
        .then(callback1)
        .catch(function (error) {
            console.log(error);
        });
}

// main 함수를 route로 exports!!
module.exports = needs_show_need;



/* curl로 post 파라미터 보내기~
 curl -X POST -H "Content-Type: application/json" -d '{"uid":"cd6b8074-723b-4ea0-bc11-f40461e3cf3e"}' -i http://192.168.0.11:3000/needs/show_need
 */