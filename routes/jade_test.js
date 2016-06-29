//Handler
/*
var users_signup = require('../lib/users_signup');
var users_authenticate = require('../lib/users_authenticate');
*/

const rootHandler = function (request, reply) {
    return reply.view('index', {
        title: 'Haha',
        message: 'Index - Hello World!',
        time: Date()
    });
};
const users = function(req, reply){
    return reply.view('users_signup');
};
const friends = function(req, reply){
    return reply.view('friends_invite');
};
const friends_sent = function(req, reply){
    return reply.view('friends_sent');
};
const friends_received = function(req, reply){
    return reply.view('friends_received');
};
const friends_list = function(req, reply){
    return reply.view('friends_list');
};
const needs = function(req, reply){
    return reply.view('needs');
};
const needs_list = function(req, reply){
    return reply.view('needs_list');
};
const needs_update = function(req, reply){
    return reply.view('needs_update');
};
const needs_upload = function(req, reply){
    return reply.view('needs_upload');
};
const requests = function(req, reply){
    return reply.view('requests');
};
const requests_uid = function(req, reply){
    return reply.view('requests_uid');
};


module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: rootHandler
    },
    {
        method: 'GET',
        path: '/users',
        handler: users
    },
    {
        method: 'GET',
        path: '/friends',
        handler: friends
    },
    {
        method: 'GET',
        path: '/friends/sent',
        handler: friends_sent
    },
    {
        method: 'GET',
        path: '/friends/received',
        handler: friends_received
    },
    {
        method: 'GET',
        path: '/friends/list',
        handler: friends_list
    },
    {
        method: 'GET',
        path: '/needs',
        handler: needs
    },
    {
        method: 'GET',
        path: '/needs/list',
        handler: needs_list
    },
    {
        method: 'GET',
        path: '/needs/update',
        handler: needs_update
    },
    {
        method: 'GET',
        path: '/needs_upload',
        handler: needs_upload
    },
    {
        method: 'GET',
        path: '/requests',
        handler: requests
    },
    {
        method: 'GET',
        path: '/requests/uid',
        handler: requests_uid
    }
]