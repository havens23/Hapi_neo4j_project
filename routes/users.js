//Handler
var users_signup = require('../lib/users_signup');
var users_authenticate = require('../lib/users_authenticate');
var users_register = require('../lib/users_register');
var users_information = require('../lib/users_information');
var	UploadDownload = require('../controller/uploadDownload');



module.exports = [
    {
        method: 'POST',
        path: '/users/signup',
        handler: users_signup
    },
    {
        method: 'POST',
        path: '/users/authenticate',
        handler: users_authenticate
    },
    {
        method: 'POST',
        path: '/users/register',
        handler: users_register
    },
    {
        method: 'POST',
        path: '/users/information',
        handler: users_information
    },
    {
        method: 'POST',
        path: '/users/upload',
        config: UploadDownload
    }
]