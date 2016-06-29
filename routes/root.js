//Handler
var bookmarks = require('../lib/bookmarks');



module.exports = [
    {
        method: 'POST',
        path: '/bookmarks',
        handler: bookmarks
    }
]
