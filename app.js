const Hapi = require('hapi');
// Path, Inert, server는 파일 업로드 테스트가 끝나면 삭제!!
const Path = require('path');
const Inert = require('inert');
const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public/images')
            }
        }
    }
});

server.connection({
    host: '192.168.0.11',
    port: 3000
});

//Route configuration
server.register({
    register: require('hapi-router'),
    options: {
        routes: './routes/*.js', // uses glob to include files
    }
}, function (err) {
    if (err) throw err;
});


// jade configuration
server.register(require('vision'), function(err) {
    if (err) {
        throw err;
    }
    server.views({
        engines: { jade: require('jade') },
        path: __dirname + '/templates',
        compileOptions: {
            pretty: true
        }
    });
});

/////////////////////////////////////////////////////////////////
// file download configuration

server.register(Inert, function(){});
server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: '.',
            redirectToSlash: true,
            index: true
        }
    }
});
/////////////////////////////////////////////////////////////////

// Start the server
server.start(function(err){
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
