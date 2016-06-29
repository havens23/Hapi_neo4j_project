'use strict';

const Hapi = require('hapi');

var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver("bolt://52.79.165.223" );

var session = driver.session();

var CQ_CREATE_PREUSER = "MERGE (au:Authentication {mobile:{mobilePayload}}) SET au.authcode={authcodeVal}, au.timeout={timeoutVal}";
var CQ_REQUEST_RECEIVED = "MATCH (u {uid:{uidParam}})-[:RECEIVED]->( )-[:HAS_CONTENT]->(n) RETURN n"

const server = new Hapi.Server();
server.connection({ port: 3000 });

//
// 나에게 요청이 들어온 니즈를 리스트한다
//
//client : curl -X GET -H "Content-Type: application/json"  -i http://localhost:3000/requests/received/53695949036
//
const requestReceivedHandler = function(request, reply) {
	
        console.log(' request.params.uid : ' + request.params.uid);

        //
        // To write the node property value as an integer, the 'neo4j.int' method should be used
        //
        session
        .run( CQ_REQUEST_RECEIVED, {uidParam:neo4j.int(request.params.uid)})
        //
        // it is only safe to convert Integer instances to JavaScript numbers to use 'toNumber() method.
        //
        .then(function(result) {
                //result.records.forEach(function(record) {
                //        console.log(record.get("needid").toNumber());
                        // 
                        // Using result records, Manipulate response data structure
                        // 
                //});
                //reply(JSON.stringify(result.records));
                reply(result.records);

        });

}

//
// provides AUTH_CODE for new user
// client : curl -X POST -H "Content-Type: application/json" -d '{ "mobile": 1094569155}' -i http://localhost:3000/users/signup
// 
// TODO : 1. generate New Auth_code
//	2. Design Random_Number Generator or Sequencer
//	3. when create, meet UNIQUE constraints
//	4. Design Response Structure for POST Requests and response with it.
//
//	
const createPreUserHandler = function(req, reply) {
	
	console.log("Received mobile as param : " + req.payload.mobile);

	var authcodeVal = Math.floor((Math.random() * 10000000000) + 1);

	console.log("new generated authcodeVal : "+ authcodeVal.toString());

	const EXPIRE_DURATION = 5;

	var now = (new Date).getTime() 
	var timeoutVal = now + EXPIRE_DURATION * 60 * 1000000;

	console.log("timestamp : " + now );
	console.log("timeoutVal : " + timeoutVal );

	
	//var timeoutVal = 
 	console.log("authcodeVal : "+ authcodeVal.toString());
        session
        .run(CQ_NODE_AUTH_SET, { mobilePayload:neo4j.int(req.payload.mobile), authcodeVal:neo4j.int(authcodeVal), timeoutVal:neo4j.int(timeoutVal) } )
}

const authUserHandler = function(req, reply) {

}

const createNeedHandler = function(req, reply) {

}

const createFriendHandler = function(req, reply) {

}

const createRequestHandler = function(req, reply) {

}




server.route([
	{
                method: 'GET',
                path: '/',
                handler: function (request, reply) {
                        reply('Hello, world!');
                }
        },
	{
	// handling simple initiation processes , 1.generate auth_code for mobile 
                method: 'POST',
                path: '/users/signup',
                handler: createPreUserHandler
        },
	{
	// do authenticate via simple auth_code matching
                method: 'POST',
                path: '/users/authenticate',
                handler: authUserHandler
        },
	{
	// create Need node
                method: 'POST',
                path: '/needs',
                handler: createNeedHandler
        },
	{
	// create Friend relationship
                method: 'POST',
                path: '/friends',
                handler: createFriendHandler
        },
	{
	// create request noode & pleased relationship
                method: 'POST',
                path: '/reuests',
                handler: createRequestHandler
        },    
	{
	// list received-needs
    		method: 'GET',
    		path: '/requests/received/{uid}',
    		handler: requestReceivedHandler  
	}, 
]);
	

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
