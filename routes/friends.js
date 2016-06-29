//Handler
var friends_sync = require('../lib/friends_sync');
var friends_sync2 = require('../lib/friends_sync2');
var friends_invite = require('../lib/friends_invite');
var friends_sent_invitations = require('../lib/friends_sent_invitations');
var friends_accept = require('../lib/friends_accept');
var friends_block = require('../lib/friends_block');
var friends_show = require('../lib/friends_show');


module.exports = [    
    {
        method: 'POST',
        path: '/friends/sync',
        handler: friends_sync
    },
    {
        method: 'POST',
        path: '/friends/sync2',
        handler: friends_sync2
    },
    {
        method: 'POST',
        path: '/friends/invite',
        handler: friends_invite
    },
    {
        method: 'POST',
        path: '/friends/sent_invitations',
        handler: friends_sent_invitations
    },
    {
        method: 'POST',
        path: '/friends/accept',
        handler: friends_accept
    },
    {
        method: 'POST',
        path: '/friends/block',
        handler: friends_block
    },
    {
        method: 'POST',
        path: '/friends/show',
        handler: friends_show
    }
]
