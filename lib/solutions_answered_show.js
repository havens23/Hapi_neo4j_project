/*
 1. 내가 작성한 Solutions(Answered)의 properties를 response 해주는 API.
 (response 해줘야하는 properties는 아직 미정. 정해지면, 코드 수정이 필요!)
 */


//db.js 호출
var session = require('./db');

const solutions_answered_show = function(req, reply) {
    console.log("............................solutions_answered_show in ");
    var solutionProperties;
    var acceptedSolutionProperties;
    var solutionPropertiesArray = new Array();
    var acceptedSolutionPropertiesArray = new Array();
    var responseObject={};

    //2번째 CALLBACK!!!!!
    function callback2 (result){
        console.log("............................callback2 in solutions_answered_show");
        if(result.records[0]._fields[0]){
            for(var x=0; x<result.records.length; x++){
                acceptedSolutionProperties = {
                    "content": result.records[x]._fields[0],
                    "author_id": result.records[x]._fields[1],
                    "author_name": result.records[x]._fields[2],
                    "category": result.records[x]._fields[3],
                    "image_url": result.records[x]._fields[4],
                    "me_id": result.records[x]._fields[5],
                    "state": result.records[x]._fields[6]
                };
                acceptedSolutionPropertiesArray[x]=acceptedSolutionProperties;
            }
            responseObject.acceptedSolutions=acceptedSolutionPropertiesArray;
        }
        reply(responseObject);
        console.log("[response]\n" + JSON.stringify(responseObject, null, 2));

        console.log("............................solutions_answered_show out ");
        
        session.close();
    }

    //1번째 CALLBACK!!!!!
    function callback1 (result){
        console.log("............................callback1 in solutions_answered_show");
        var me_id = result.records[0]._fields[5];
        
        for(var x=0; x<result.records.length; x++){
            solutionProperties = {
                "content": result.records[x]._fields[0],
                "author_id": result.records[x]._fields[1],
                "author_name": result.records[x]._fields[2],
                "category": result.records[x]._fields[3],
                "image_url": result.records[x]._fields[4],
                "me_id": result.records[x]._fields[5],
                "state": result.records[x]._fields[6]
            };
            solutionPropertiesArray[x]=solutionProperties;
        }

        responseObject.Solutions=solutionPropertiesArray;
        //reply(responseObject);
        
        //session.close();
        
        var CQ_SAS2 = "OPTIONAL MATCH (u:User {uid:'"+ req.payload.uid +"'})-[:ANSWERED]->(m {state:'Called by needCreator'})-[:BELONGS_TO]->(n) " +
            "RETURN m.content, m.author_id, m.author_name, m.category, m.image_url, m.me_id, m.state";
        session
            .run(CQ_SAS2)
            .then(callback2)
            .catch(function (error) {
                console.log(error);
            });
    }

    //1번째 QUERY!!
    var CQ_SAS1 = "MATCH (u:User {uid:'"+ req.payload.uid +"'})-[:ANSWERED]->(m {state:'Not Called'})-[:BELONGS_TO]->(n) " +
        "RETURN m.content, m.author_id, m.author_name, m.category, m.image_url, m.me_id, m.state";
    session
        .run(CQ_SAS1)
        .then(callback1)
        .catch(function (error) {
            console.log(error);
        });
}

// main 함수를 route로 exports!!
module.exports = solutions_answered_show;



/* curl로 post 파라미터 보내기~
 curl -X POST -H "Content-Type: application/json" -d '{"uid":"2551d889-1b69-4743-af88-79a48aa1e5cb"}' -i http://192.168.0.11:3000/solutions/answered_show
 */