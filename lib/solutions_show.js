/*
    1. 나에게 온 Solutions의 properties를 response 해주는 API.
        (response 해줘야하는 properties는 아직 미정. 정해지면, 코드 수정이 필요!)
*/


//db.js 호출
var session = require('./db');

const solutions_show = function(req, reply) {
    console.log("............................solutions_show in ");
    
    var solutionProperties;
    var solutionPropertiesArray = new Array();
    var responseObject={};

    //1번째 CALLBACK!!!!!
    function callback1 (result){
        console.log("............................callback1 in solutions_show");
        //console.log(result.records[0]._fields[0]);
        
        for(var x=0; x<result.records.length; x++){
            solutionProperties = {
                "content": result.records[x]._fields[0],
                "author_id": result.records[x]._fields[1],
                "author_name": result.records[x]._fields[2],
                "category": result.records[x]._fields[3],
                "image_url": result.records[x]._fields[4],
                "me_id": result.records[x]._fields[5],
                "state": result.records[x]._fields[6],
                "need_id" : result.records[x]._fields[7]
            };
            solutionPropertiesArray[x]=solutionProperties;
        }

        responseObject.Solutions=solutionPropertiesArray;
        reply(responseObject);
        
        console.log("[response]\n" + JSON.stringify(responseObject, null, 2));
        console.log("............................solutions_show out ");

        session.close();
    }

    //1번째 QUERY!!
    var CQ_SS1 = "MATCH (n:Need {need_id:'"+ req.payload.need_id +"'})<-[:BELONGS_TO]-(m:Me) " +
        "WHERE m.state= 'Not Called' or m.state= 'Called by needCreator' or m.state='read' or m.state='keep'" +
        "RETURN m.content, m.author_id, m.author_name, m.category, m.image_url, m.me_id, m.state, m.need_id";
    session
        .run(CQ_SS1)
        .then(callback1)
        .catch(function (error) {
            console.log(error);
        });
}

// main 함수를 route로 exports!!
module.exports = solutions_show;



/* curl로 post 파라미터 보내기~
 curl -X POST -H "Content-Type: application/json" -d '{"need_id":"13b07fc6-140e-426b-becc-1bef12f6be0d"}' -i http://192.168.0.11:3000/solutions/show
 */