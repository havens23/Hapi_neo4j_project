const Path = require('path');
const Hapi = require('hapi');
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
server.connection({ port: 3000 });

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

server.start(function(err){

    if (err) {
        throw err;
    }

    console.log('Server running at:', server.info.uri);
});