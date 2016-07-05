//db.js 호출
var session = require('./db');

const users_register = function(req, reply) {
    console.log("............................users_register in ");
    
    //1번째 CALLBACK!!!!!
    function callback1 (result){
        console.log("-------------------------callback1 in users_register");
        var responseObject={};
        
        responseObject.mobile=result.records[0]._fields[0].properties.mobile;
        reply(responseObject);
        //reply.redirect('/');
        console.log("............................users_register out ");
        
        session.close();
    }
    
    //1번째 QUERY!!
    var CQ_UR1 = " MATCH (a:User {uid:'"+ req.payload.uid +"'}) SET a.name='"+ req.payload.name +"'," +
        " a.image_url='"+ req.payload.image_url +"' RETURN a";
    session
        .run(CQ_UR1)
        .then(callback1)
        .catch(function (error) {
            console.log(error);
        });
}

// main 함수를 route로 exports!!
module.exports = users_register;


/* curl로 post 파라미터 보내기~ 
 curl -X POST -H "Content-Type: application/json" -d '{ "uid":"743f0af1-f30b-4792-92f1-2467adb67c21", "name":"서서이", "image_url":"hya.jpg"}' -i http://192.168.0.11:3000/users/register
 */