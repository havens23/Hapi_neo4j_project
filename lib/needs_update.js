/*
     1. 아직 Need 노드의 Properties를 전부 구현하지는 않음.
     properties가 확정이 된 후, 수정이 필요함. (needs_create와 연계가 필요함)

     2. reply를 현재 모든 properties를 response하고 있음. 선택적인 response가 필요할 시 수정.
 */


//db.js 호출
var session = require('./db');

const needs_update = function(req, reply) {
    console.log("............................needs_update in ");
    var now = (new Date).getTime();

    //1번째 CALLBACK!!!!!
    function callback1 (result){
        console.log("............................callback1 in needs_update");
        
        var needProperties = result.records[0]._fields[0].properties;
        
        reply(needProperties);
        console.log("............................needs_update out ");
        
        session.close();
    }

    //1번째 QUERY!!
    var CQ_NU1 = "MATCH (n:Need {need_id:'"+ req.payload.need_id +"'})" +
        "SET n.author_name='"+ req.payload.name +"', n.content='"+ req.payload.content +"', n.tag='"+ req.payload.tag +"', " +
        "n.updatetime='"+ now +"', n.starttime='"+ req.payload.starttime +"', n.endtime='"+ req.payload.endtime +"', " +
        "n.category='"+ req.payload.category +"', n.image_url='"+ req.payload.image_url +"', n.thumbnail_url='"+ req.payload.thumbnail_url +"', " +
        "n.type='"+ req.payload.type +"', n.bet_point='"+ req.payload.bet_point +"' RETURN n";
    //var CQ_NU1 = "CREATE (n:Need {need_id:'"+ uid +"'}) return n";
    session
        .run(CQ_NU1)
        .then(callback1)
        .catch(function (error) {
            console.log(error);
        });
}

// main 함수를 route로 exports!!
module.exports = needs_update;



/* curl로 post 파라미터 보내기~
 curl -X POST -H "Content-Type: application/json" -d '{"bet_point":"15","thumbnail_url":"does.jpg","need_id":"1c91673c-bd1d-4c57-aeb2-857eed06efb2","image_url":"ssi1.jpg","state":"0","type":"0","tag":"삼성","category":"직장","content":"삼성전자","name":"서서이"}' -i http://192.168.0.11:3000/needs/update
 */