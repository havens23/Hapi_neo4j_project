//Handler
var needs_create = require('../lib/needs_create');
var needs_show_need = require('../lib/needs_show_need');
var needs_update = require('../lib/needs_update');
var needs_called = require('../lib/needs_called');
var needs_close = require('../lib/needs_close');
var	UploadDownload = require('../controller/uploadDownload');


module.exports = [   
    {
        method: 'POST',
        path: '/needs/create',
        handler: needs_create
    },
    {
        method: 'POST',
        path: '/needs/show_need',
        handler: needs_show_need
    },
    {
        method: 'POST',
        path: '/needs/update',
        handler: needs_update
    },
    {
        method: 'POST',
        path: '/needs/called',
        handler: needs_called
    },
    {
        method: 'POST',
        path: '/needs_close',
        handler: needs_close
    },    
    {
        method: 'POST',
        path: '/needs/upload',
        config: UploadDownload
    }
]