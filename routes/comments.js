//Handler
var comments_create = require('../lib/comments_create');
var comments_show = require('../lib/comments_show');



module.exports = [
    {
        method: 'POST',
        path: '/comments/create',
        handler: comments_create
    },
    {
        method: 'POST',
        path: '/comments/show',
        handler: comments_show
    }
]
