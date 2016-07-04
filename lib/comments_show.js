/*
 1. 내 친구의 properties를  보여주는 API.
 */


//db.js 호출
var session = require('./db');

const comments_show = function(req, reply) {
    console.log("............................comments_show in ");
    var commentPropertiesArray = new Array();
    var commentIdArray = new Array();
    var commentUserImageUrlArray = new Array();
    var commentProperties={};
    var responseObject={};
    
    //1번째 CALLBACK!!!!!
    function callback1 (result){
        console.log("............................callback1 in comments_show");
        //commentIdArray[0]="'"+result.records[0]._fields[0].properties.author_id+"'";
        for(var x=0; x<result.records.length; x++){
            commentProperties={
                "author_id": result.records[x]._fields[0].properties.author_id,
                "author_name": result.records[x]._fields[0].properties.author_name,
                "content": result.records[x]._fields[0].properties.content,
                "createtime": result.records[x]._fields[0].properties.createtime,
                "type": result.records[x]._fields[0].properties.type,
                "image_url" : result.records[x]._fields[0].properties.image_url
            }            
            commentPropertiesArray[x]=commentProperties;
        }
        responseObject.comments=commentPropertiesArray;

        reply(responseObject);
        console.log("[response]\n" + JSON.stringify(responseObject, null, 2));

        session.close();
    }

    //1번째 QUERY!!
    var CQ_CS1 = "MATCH (c:Comment {need_id:'"+ req.payload.need_id +"'}) " +
        "RETURN c ORDER BY c.createtime";
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
 curl -X POST -H "Content-Type: application/json" -d '{"need_id":"1c91673c-bd1d-4c57-aeb2-857eed06efb2"}' -i http://192.168.0.11:3000/comments/show
 */