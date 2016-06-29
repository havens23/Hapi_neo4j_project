/*
 1. 아직 Me 노드의 Properties를 전부 구현하지는 않음.
 properties가 확정이 된 후, 수정이 필요함. (solutions_create와 연계가 필요함)

 2. reply를 현재 모든 properties를 response하고 있음. 선택적인 response가 필요할 시 수정.
 */


//db.js 호출
var session = require('./db');

const solutions_update = function(req, reply) {
    console.log("............................solutions_update in ");

    var solutionProperties = {};
    var responseObject = {};
    var now = (new Date).getTime();

    //1번째 CALLBACK!!!!!
    function callback1 (result){
        console.log("............................callback1 in solutions_update");
        solutionProperties ={            
            "author_name" : result.records[0]._fields[0],            
            "content" : result.records[0]._fields[1],
            "category" : result.records[0]._fields[2],
            "updatetime" : result.records[0]._fields[3],
            "image_url" : result.records[0]._fields[4],
            "thumbnail_url" : result.records[0]._fields[5],
            "state": result.records[0]._fields[6]
        };

        responseObject = solutionProperties;
        reply(responseObject);
        console.log("............................solutions_update out ");
        
        session.close();
    }

    //1번째 QUERY!!
    var CQ_SU1 = "MATCH (u:User {uid:'"+ req.payload.uid +"'})-[:ANSWERED]->(m:Me {me_id:'"+ req.payload.me_id +"'})" +
        "SET m.author_name='"+ req.payload.name +"', m.content='"+ req.payload.content +"', " +
        "m.category='"+ req.payload.category +"', m.updatetime='"+ now +"', m.image_url='"+req.payload.image_url+"', " +
        "m.thumbnail_url='"+ req.payload.thumbnail_url +"', m.state='"+ req.payload.state +"' RETURN m.author_name, m.content, m.category, " +
        "m.updatetime, m.image_url, m.thumbnail_url, m.state";
    session
        .run(CQ_SU1)
        .then(callback1)
        .catch(function (error) {
            console.log(error);
        });
}

// main 함수를 route로 exports!!
module.exports = solutions_update;




/* curl로 post 파라미터 보내기~
 curl -X POST -H "Content-Type: application/json" -d '{"state":"read","url":"hya1.jpg","category":"연예","content":"연기","name":"박보영","uid":"6616ca09-801b-45cb-a577-0e062e88fd16","need_id":"53b91632-d945-40b7-b207-67602de0891f"}' -i http://192.168.0.11:3000/solutions/update
 */