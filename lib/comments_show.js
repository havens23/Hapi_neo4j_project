/*
 1. 내 친구의 properties를  보여주는 API.
 */


//db.js 호출
var session = require('./db');

const comments_show = function(req, reply) {
    console.log("............................comments_show in ");
    var commentPropertiesArray = new Array();
    var commentProperties={};
    var responseObject={};

    //1번째 CALLBACK!!!!!
    function callback1 (result){
        console.log("............................callback1 in comments_show");
        for(var x=0; x<result.records.length; x++){
            commentProperties={
                "author_name": result.records[x]._fields[0].properties.author_name,
                "content": result.records[x]._fields[0].properties.content,
                "createtime": result.records[x]._fields[0].properties.createtime,
                "type": result.records[x]._fields[0].properties.type
            }
            commentPropertiesArray[x]=commentProperties;
        }
        
        responseObject.comments=commentPropertiesArray;
        reply(responseObject);
        console.log("[response]\n" + JSON.stringify(responseObject, null, 2));
        console.log("............................comments_show out ");
        
        session.close();
    }

    //1번째 QUERY!!
    var CQ_CS1 = "MATCH (c:Comment {need_id:'"+ req.payload.need_id +"'}) " +
        "RETURN c ORDER BY c.createtime";
        //"RETURN c.author_name, c.content, c.createtime, c.type";
    session
        .run(CQ_CS1)
        .then(callback1)
        .catch(function (error) {
        console.log(error);
    });
}

// main 함수를 route로 exports!!
module.exports = comments_show;



/* curl로 post 파라미터 보내기~
 curl -X POST -H "Content-Type: application/json" -d '{"need_id":"0d8b6cb5-99cf-4559-af44-94ce0a02feee"}' -i http://192.168.0.11:3000/comments/show
 */