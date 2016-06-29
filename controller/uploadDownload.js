/*
    1. file upload를 처리해주는 API.
    2. uid 값을 받아서 db에 image_url을 저장.
*/

var Fs = require('fs');
var Path = require('path');

const UploadDownload = {
    files: {
        relativeTo: Path.join(__dirname, '/public/images')
    },
    handler: function(req, reply){
        console.log("-------------------------UploadDownload in");
        console.log("-------------------------"+req.payload.uid);

        var ret = new Array();
        var data = req.payload;
        var url = "http://52.78.53.134:3000";

        //console.log(data);
        //console.log("....................."+data.file);
        if(data.file.length===undefined){
            var name = data.file.hapi.filename;
            var path = Path.join(__dirname, '../public/images/'+name);
            var file = Fs.createWriteStream(path);

            file.on('error', function (err) {
                console.error(err)
            });
            ret[0] = {
                filename: data.file.hapi.filename,
                headers: data.file.hapi.headers,
                path: path
            }

            data.file.pipe(file);
        }

        else{
            for(var i = 0; i < data.file.length; i++){
                if(data.file[i]){
                    var g = data.file[i];
                    console.log(g);
                    var name = g.hapi.filename;
                    //console.log(name);

                    var path = Path.join(__dirname, '../public/images/'+name);
                    var file = Fs.createWriteStream(path);
                    file.on('error', function (err){
                        console.error(err);
                    });

                    ret[i] = {
                        filename: g.hapi.filename,
                        headers: g.hapi.headers,
                        path: path
                    }
                    g.pipe(file);
                }
            }
        }reply(url+'/'+name);
    },
    payload: {
        output : 'stream',
        parse: true,
        uploads: 'up_files',
        timeout: 30034,
        // allow: 'multipart/form-data',
        failAction: 'log',
        maxBytes: 3000000
    }
}

// main 함수를 route로 exports!!
module.exports = UploadDownload;



/*exports.upladfile = {

    payload: {
        maxBytes: 209715200, // MAX 200M ?
        output: 'stream',
        parse: false,
        //allow: 'multipart/form-data'
    },
    handler: function(req, reply) {
        console.log("................................... uploadFile in");
        var form = new multiparty.Form();

        /!*var CQ_UD1 = " MATCH (a:User {uid:'"+ req.payload.uid +"'}) " +
            "SET a.image_url='"+ req.payload.files.file[0].originalFilename +"' RETURN a";
        session.run(CQ_UD1);*!/

        form.parse(req.payload, function(err, fields, files) {
            console.log("........................................ uploadDownload in");
            if (err) return reply(err);
            else upload(files, reply);
        });
    }
};

//
// ** Be sure to have BaseFolder !!!
//

var upload = function(files, reply) {
    var Config={BaseFolder: './public/images/'};
    console.log("........................................"+files);
    //console.log ("........................................"+files.file[0].originalFilename);
    console.log ("........................................"+files.file.length);
    
    fs.readFile(files.file[0].path, function(err, data) {
        console.log(files.file[0].originalFilename);
        fs.writeFile(Config.BaseFolder + files.file[0].originalFilename, data, function(err) {
            if (err)  return reply(err);
            else return reply('File uploaded to: ' + Config.BaseFolder + files.file[0].originalFilename);
        });
    });
};*/