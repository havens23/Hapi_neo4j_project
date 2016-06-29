//Handler
var requests_create = require('../lib/requests_create');
var requests_received_create = require('../lib/requests_received_create');
var requests_show_request = require('../lib/requests_show_request');
var requests_received = require('../lib/requests_received');
var requests_stopped = require('../lib/requests_stopped');
var requests_history = require('../lib/requests_history');



module.exports = [
    {
        method: 'POST',
        path: '/requests/create',
        handler: requests_create
    },
    {
        method: 'POST',
        path: '/requests/received_create',
        handler: requests_received_create
    },
    {
        method: 'POST',
        path: '/requests/show_request',
        handler: requests_show_request
    },
    {
        method: 'POST',
        path: '/requests/received',
        handler: requests_received
    },
    {
        method: 'POST',
        path: '/requests/stopped',
        handler: requests_stopped
    },
    {
        method: 'POST',
        path: '/requests/history',
        handler: requests_history
    }
]
