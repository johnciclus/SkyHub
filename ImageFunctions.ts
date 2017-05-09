import * as request from 'request';
import * as Jimp from 'jimp';
import * as fs from 'fs';

export function download(uri, path, name, callback){
    request.head(uri, function(err, res, body){
        let filename = path+name+".jpg";
        request(uri).pipe(fs.createWriteStream(filename)).on('close', function(){
            callback(name);
        });
    });
}

export function transform(filename, size, callback){
    let path = __dirname+'/public/images/';
    Jimp.read(path+filename+'.jpg', function (err, image) {
        if (err) throw err;
        let width = 320;
        let height = 240;
        switch(size){
            case 'small':
                width = 320;
                height = 240;
                break;
            case 'medium':
                width = 384;
                height = 288;
                break;
            case 'large':
                width = 640;
                height = 480;
                break;
        }
        image.resize(width, height).write(path+filename+"-"+size+".jpg")
    });
}