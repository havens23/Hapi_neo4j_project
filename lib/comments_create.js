/*
 1. 내가 받은 need에 대한 Answer를 Me노드를 생성하면서 처리해주는 API.
 2. response 로, 무엇을 해줘야 하는지 ??
 */

//uuid 모듈 호출
var uuid = require('uuid');
//db.js 호출
var session = require('./db');

const comments_create = function(req, reply) {
    console.log("............................comments_create in ");

    var uid = uuid.v4();
    var now = (new Date).getTime();
    var responseObject={};

    
    //2번재 CALLBACK!!!!!
    function callback2 (result) {
        console.log("............................callback2 in comments_create");
        var image_url = result.records[0]._fields[0];

        reply(responseObject);
        console.log("[response]\n" + JSON.stringify(responseObject, null, 2));
        
        var CQ_CC3 = "MATCH (c:Comment {author_id:'"+ req.payload.uid +"'}) " +
            "SET c.image_url = '"+ image_url +"'";
        session
            .run(CQ_CC3)
            .subscribe({
                onCompleted: function() {
                    // Completed!
                    session.close();
                },
                onError: function(error) {
                    console.log(error);
                }
            });       

        console.log("............................comments_create out ");
    }
    
    //1번째 CALLBACK!!!!!
    function callback1 (result){
        console.log("............................callback1 in comments_create");
        responseObject.comment = result.records[0]._fields[0].properties;        
        
        var CQ_CC2 = "MATCH (u:User {uid:'"+ req.payload.uid +"'}) " +
            "RETURN u.image_url";
        session
            .run(CQ_CC2)
            .then(callback2)
            .catch(function (error) {
                console.log(error);
            });
    }

    //1번째 QUERY!!
    var CQ_CC1 = "CREATE (c:Comment {comment_id:'"+ uid +"', author_id:'"+ req.payload.uid +"', " +
        "author_name:'"+ req.payload.name +"', content:'"+ req.payload.content +"', createtime:'"+ now +"'," +
        "type:'"+ req.payload.type +"', need_id:'"+ req.payload.need_id +"'}) " +
        "WITH c MATCH (n:Need {need_id:'"+ req.payload.need_id +"'} )" +
        "CREATE (c)-[:BELONGS_TO {createtime:'"+ now +"'}]->(n) " +
        "SET n.count_of_comment = n.count_of_comment + 1 " +
        "RETURN c";
    session
        .run(CQ_CC1)
        .then(callback1)
        .catch(function (error) {
            console.log(error);
        });
}

// main 함수를 route로 exports!!
module.exports = comments_create;



/* curl로 post 파라미터 보내기~
 curl -X POST -H "Content-Type: application/json" -d '{"uid":"7bf99ea1-5da6-4204-b2e1-7d9b9808f71c","name":"user31","content":"오늘보다 더 나은 내일을 위해","type":"0","need_id":"1c91673c-bd1d-4c57-aeb2-857eed06efb2"}' -i http://192.168.0.11:3000/comments/create
 */