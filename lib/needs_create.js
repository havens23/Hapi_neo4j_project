/*
    1. 아직 Need 노드의 Properties를 전부 구현하지는 않음. category가 fix된 후에 수정이 필요함.
    2. reply를 현재 모든 properties를 response하고 있음. 선택적인 response가 필요할 시 수정.
*/

//uuid 모듈 호출
var uuid = require('uuid');
//db.js 호출
var session = require('./db');

const needs_create = function(req, reply) {
    console.log("............................needs_create in ");
    
    var uid = uuid.v4();
    var now = (new Date).getTime();
    var responseObject = {};
    var needProperties;
    
    //1번째 CALLBACK!!!!!
    function callback1(result) {
        console.log("............................callback1 in needs_create....");
        // var needProperties = result.records[0]._fields[0].properties;
        var needId = result.records[0]._fields[0].properties.need_id;

        needProperties = {
            "need_id" : result.records[0]._fields[0].properties.need_id,
            "createtime" : result.records[0]._fields[0].properties.createtime,
            "image_url" : result.records[0]._fields[0].properties.image_url,
            "endtime" : result.records[0]._fields[0].properties.endtime,
            "starttime" : result.records[0]._fields[0].properties.starttime,
            "thumbnail_url" : result.records[0]._fields[0].properties.thumbnail_url,
            "type" : result.records[0]._fields[0].properties.type,
            "content" : result.records[0]._fields[0].properties.content,
            "bet_point" : result.records[0]._fields[0].properties.bet_point,
            "tag" : result.records[0]._fields[0].properties.tag,
            "state" : result.records[0]._fields[0].properties.state,
            "category" : result.records[0]._fields[0].properties.category,
            "author_id" : result.records[0]._fields[0].properties.uid,
            "count_of_me" : result.records[0]._fields[0].properties.count_of_me.low,
            "count_of_collabo" : result.records[0]._fields[0].properties.count_of_collabo.low,
            "count_of_comment" : result.records[0]._fields[0].properties.count_of_comment.low,
            "author_name" : result.records[0]._fields[0].properties.name
        };

        responseObject = needProperties;
        //console.log("[response]\n" + JSON.stringify(responseObject, null, 2));
        reply(responseObject);

        session.close();

        //2번째 QUERY!!
        var CQ_NC2 ="MATCH (u:User {uid:'"+ req.payload.uid +"'}), (n:Need {need_id:'"+ needId +"'}) " +
            "CREATE (u)-[p:PUBLISHED {created_at:'"+ now +"'}]->(n) RETURN p";
        session
            .run(CQ_NC2)
            .subscribe({
                onCompleted: function() {
                    // Completed!
                    session.close();
                },
                onError: function(error) {
                    console.log(error);
                }
            });

        console.log("............................needs_create out ");
    }
    
    //1번째 QUERY!!
    var CQ_NC1 = "CREATE (n:Need {need_id:'"+ uid +"', author_id:'"+ req.payload.uid +"', author_name:'"+ req.payload.name +"', " +
        "content:'"+ req.payload.content +"', tag:'"+ req.payload.tag +"', createtime:'"+ now +"', starttime:'"+ req.payload.starttime +"', endtime:'"+ req.payload.endtime +"', category:'"+ req.payload.category +"', " +
        "image_url:'"+ req.payload.image_url +"', thumbnail_url:'"+ req.payload.thumbnail_url +"', type:'"+ req.payload.type +"', state:'opened', bet_point:'"+ req.payload.bet_point +"', count_of_me:0, count_of_collabo:0, count_of_comment:0}) " +
        "RETURN n";
    session
        .run(CQ_NC1)
        .then(callback1)
        .catch(function (error) {
            console.log(error);
        });
}

// main 함수를 route로 exports!!
module.exports = needs_create;



/* curl로 post 파라미터 보내기~
 curl -X POST -H "Content-Type: application/json" -d '{"bet_point":"15","thumbnail_url":"does.jpg","starttime":"111","endtime":"111","image_url":"does.jpg","type":"0","tag":"인터랙티","category":"취업","content":"does interactive","name":"송시욱","uid":"e1fe7630-c1f1-4141-9bc0-3854b9f39927"}' -i http://192.168.0.11:3000/needs/create
 */