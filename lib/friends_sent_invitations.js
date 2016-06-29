/*
    1. 내가 초대를 한 친구들의 목록을 모두 보여주는 API.
    2. 초대를 응한 친구의 목록은 삭제하고 response 해야 하지 않나??
*/


//db.js 호출
var session = require('./db');

const friends_sent_invitations = function(req, reply) {
    console.log("............................friends_sent_invitations in ");

    var x=0, y=0, z=0;
    var inviteeArray = new Array();
    var stringInviteeArray, userProperties;
    var userPropertiesArray = new Array();
    var responseObject={};

    //2번째 CALLBACK!!!!!
    function callback2 (result){
        console.log("............................callback2 in friends_sent_invitations");

        //console.log(result.records[0]._fields[0].properties);
        for(z=0; z<result.records.length; z++) {
            userProperties = {"uid":result.records[z]._fields[0].properties.uid,
                "mobile":result.records[z]._fields[0].properties.mobile,
                "name":result.records[z]._fields[0].properties.name,
                "image_url":result.records[z]._fields[0].properties.image_url};
            userPropertiesArray[z]=userProperties;
        }
        responseObject.invite = userPropertiesArray;
        //console.log(j9);

        //################# reply ###################
        reply(responseObject);
        //reply.view('friends_sent_invitations', {properties:responseObject.invite});
        console.log("............................friends_sent_invitations out ");
        
        session.close();
    }

    //1번째 CALLBACK!!!!!
    function callback1 (result){
        console.log("............................callback1 in friends_sent_invitations");
        //console.log("............................"+result.records[0]._fields[0]);
        for(x=0; x<result.records.length; x++){
            inviteeArray[x]=result.records[x]._fields[0];
        }
        stringInviteeArray="'"+ inviteeArray[y] +"'";
        for(y=1; y<inviteeArray.length; y++){            
            stringInviteeArray+=",'"+inviteeArray[y]+"'";
        }
        
        session.close();
        
        //2번째 QUERY!!
        var CQ_FIS2 = "MATCH (u:User) WHERE u.mobile in ["+ stringInviteeArray +"] return u"
        session
            .run(CQ_FIS2)
            .then(callback2)
            .catch(function (error) {
                console.log(error);
            });
    }

    //1번째 QUERY!!
    var CQ_FSI1 = "MATCH (i:Invitation) WHERE i.userid='"+ req.payload.uid +"' return i.invitee"
    session
        .run(CQ_FSI1)
        .then(callback1)
        .catch(function (error) {
            console.log(error);
        });
}

// main 함수를 route로 exports!!
module.exports = friends_sent_invitations;



/* curl로 post 파라미터 보내기~
 curl -X POST -H "Content-Type: application/json" -d '{ "uid":"cbc978bb-941e-469a-be98-e58dacc18251"}' -i http://192.168.0.11:3000/friends/sent_invitations
 */