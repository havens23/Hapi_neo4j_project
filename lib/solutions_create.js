/*
 1. 내가 받은 need에 대한 Answer를 Me노드를 생성하면서 처리해주는 API.
 2. response 로, 무엇을 해줘야 하는지 ??
 */

//uuid 모듈 호출
var uuid = require('uuid');
//db.js 호출
var session = require('./db');

const solutions_create = function(req, reply) {
    console.log("............................solutions_create in ");
    
    var uid = uuid.v4();
    var now = (new Date).getTime();
    var solutionProperties = {};
    var responseObject = {};

    //1번째 CALLBACK!!!!!
    function callback1 (result){
        console.log("............................callback1 in solutions_create");
        var me_id = result.records[0]._fields[0];
        
        solutionProperties ={
            "me_id" : me_id,
            "author_id" : result.records[0]._fields[1],
            "author_name" : result.records[0]._fields[2],
            "need_id" : result.records[0]._fields[3],
            "content" : result.records[0]._fields[4],
            "createtime" : result.records[0]._fields[5],
            "category" : result.records[0]._fields[6],
            "image_url" : result.records[0]._fields[7],
            "thumbnail_url" : result.records[0]._fields[8],
            "state" : result.records[0]._fields[9]
        };
        
        responseObject = solutionProperties;
        reply(responseObject);

        //session.close();

        //2번째 QUERY!!
        var CQ_SC2 = "MATCH (u:User {uid:'"+ req.payload.uid +"'}), (m:Me {me_id:'"+ me_id +"'}), " +
            "(n:Need {need_id:'"+ req.payload.need_id +"'}) " +
            "CREATE (u)-[:ANSWERED]->(m)-[:BELONGS_TO]->(n)" +
            "SET n.count_of_me = n.count_of_me+1";
        session
            .run(CQ_SC2)
            .subscribe({
                onCompleted: function() {
                    // Completed!
                    session.close();
                },
                onError: function(error) {
                    console.log(error);
                }
            });

        console.log("............................solutions_create out ");
    }

    //1번째 QUERY!!
    var CQ_SC1 = "CREATE (m:Me {me_id:'"+ uid +"',author_id:'"+ req.payload.uid +"',author_name:'"+ req.payload.name +"'," +
        "need_id:'"+ req.payload.need_id +"',content:'"+ req.payload.content +"',createtime:'"+ now +"',category:'"+req.payload.category+"'," +
        "image_url:'"+ req.payload.image_url +"',thumbnail_url:'"+ req.payload.thumbnail_url +"',state:'Not Called'}) " +
        "RETURN m.me_id, m.author_id, m.author_name, m.need_id, m.content, m.createtime, m.category, " +
        "m.image_url, m.thumbnail_url, m.state";
    session
        .run(CQ_SC1)
        .then(callback1)
        .catch(function (error) {
            console.log(error);
        });
}

// main 함수를 route로 exports!!
module.exports = solutions_create;



/* curl로 post 파라미터 보내기~
 curl -X POST -H "Content-Type: application/json" -d '{"thumbnail_url":"does.jpg","image_url":"does.jpg","category":"취업","content":"does interactive","name":"user43","uid":"dbf440fa-45ff-4385-986a-897ac4018722","need_id":"cdd76134-8a23-4617-bc34-3df73a31bc1b"}' -i http://192.168.0.11:3000/solutions/create
 */