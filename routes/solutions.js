//Handler
//var	UD = require('../controller/uploadDownload');
var solutions_create = require('../lib/solutions_create');
var solutions_show = require('../lib/solutions_show');
var solutions_answered_show = require('../lib/solutions_answered_show');
var solutions_update = require('../lib/solutions_update');
var solutions_close = require('../lib/solutions_close');
var	UploadDownload = require('../controller/uploadDownload');



module.exports = [
    {
        method: 'POST',
        path: '/solutions/create',
        handler: solutions_create
    },
    {
        method: 'POST',
        path: '/solutions/show',
        handler: solutions_show
    },
    {
        method: 'POST',
        path: '/solutions/answered_show',
        handler: solutions_answered_show
    },
    {
        method: 'POST',
        path: '/solutions/update',
        handler: solutions_update
    },
    {
        method: 'POST',
        path: '/solutions/close',
        handler: solutions_close
    },
    {
        method: 'POST',
        path: '/solutions/upload',
        config: UploadDownload
    }
]
