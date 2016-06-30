/*
    1. 내 주소록에 있는 번호들로 피플로드 가입자를 선출하여 response
    2. 나를 초대한 피플로드 가입자의 uid를 내 번호를 인자로 검색하여 response
    3. 2번에서 검색된 uid로 다시 검색하여 그 유저의 properties를 최종적으로 response하는 API.
*/


//db.js 호출
var session = require('./db');

const friends_sync = function(req, reply) {
    console.log("............................friends sync in ");

    var stringMobiles;
    var userProperties;
    var userPropertiesArray = new Array();
    var responseObject01 = {};
    var inviteMeUidArray = new Array();
    var stringInviteMeUid;
    var inviteMeUserProperties;
    var inviteMeUserPropertiesArray = new Array();
    var responseObject02 = {};
    var x=0, y=0;

    stringMobiles="'"+req.payload.mobiles[x]+"'"
    for(var x=1; x<req.payload.mobiles.length; x++) {
        //console.log("............................for문 in ");
        //console.log("............................ "+req.payload.mobiles[x]);
        stringMobiles+=",'"+req.payload.mobiles[x]+"'";
    }
    //console.log("............................for문 end ");
    //console.log("" + req.payload.mobiles);
    //console.log("............................."+stringMobiles);

    //3번째 CALLBACK!!!!!
    function callback3 (result){
        console.log("............................callback3 in friends sync");

        //console.log(result.records[0]._fields[0].properties);
        for(var z=0; z<result.records.length; z++) {
            inviteMeUserProperties = {
                "uid":result.records[z]._fields[0].properties.uid,
                "mobile":result.records[z]._fields[0].properties.mobile,
                "name":result.records[z]._fields[0].properties.name,
                "image_url":result.records[z]._fields[0].properties.image_url
            };
            inviteMeUserPropertiesArray[z]=inviteMeUserProperties;
        }
        responseObject02.mobile = responseObject01;
        responseObject02.invite = inviteMeUserPropertiesArray;
        //console.log(responseObject02);

        //################ reply ###################
        reply(responseObject02);
        console.log("............................friends sync out ");
        
        session.close();
    }

    //2번째 CALLBACK!!!!!
    function callback2 (result){
        console.log("............................callback2 in friends sync");
        //console.log("............................ "+result.records[0]._fields[0]);

        for(var w=0; w<result.records.length; w++) {
            inviteMeUidArray[w]=result.records[w]._fields[0];
        }
        stringInviteMeUid="'"+inviteMeUidArray[y]+"'";
        //console.log(stringInviteMeUid);
        for(y=1; y<inviteMeUidArray.length; y++) {
            //console.log("............................for문 in ");
            //console.log("............................ "+inviteMeUidArray[y]);
            stringInviteMeUid+=",'"+inviteMeUidArray[y]+"'";
        }
        
        //session.close();

        //3번째 QUERY!!
        var CQ_FS3 = "MATCH (u:User) WHERE u.uid in ["+ stringInviteMeUid +"] return u"
        session
            .run(CQ_FS3)
            .then(callback3)
            .catch(function (error) {
                console.log(error);
            });
    }
    
    //1번째 CALLBACK!!!!!
    function callback1 (result){
        console.log("............................callback1 in friends sync");

        //console.log(result.records[0]._fields[0].properties);
        for(x=0; x<result.records.length; x++) {
            userProperties = {
                "uid":result.records[x]._fields[0].properties.uid,
                "mobile":result.records[x]._fields[0].properties.mobile,
                "name":result.records[x]._fields[0].properties.name,
                "image":result.records[x]._fields[0].properties.image_url
            };
                userPropertiesArray[x]=userProperties;
            }
        //중복되는 값 제거!
        var uniq = userPropertiesArray.reduce(function(a,b){
            if (a.indexOf(b) < 0 ) a.push(b);
            return a;},[]);
        //console.log(uniq);

        responseObject01= uniq;
        
        //session.close();
        
        //2번째 QUERY!!
        var CQ_FS2 = "MATCH (i:Invitation) WHERE i.invitee='"+ req.payload.mobile +"' return i.userid"
        session
            .run(CQ_FS2)
            .then(callback2)
            .catch(function (error) {
                console.log(error);
            });
    }

    //1번째 QUERY!!
    var CQ_FS1 = "MATCH (a:User) WHERE a.mobile in ["+ stringMobiles +"] return a";
    session
        .run(CQ_FS1)
        .then(callback1)
        .catch(function (error) {
            console.log(error);
        });

}

// main 함수를 route로 exports!!
module.exports = friends_sync;



/* curl로 post 파라미터 보내기~ 
 curl -X POST -H "Content-Type: application/json" -d '{ "mobile":"01011111121","mobiles": ["01079272163","01011111111","01094569155","01011111114"]}' -i http://192.168.0.11:3000/friends/sync
 */