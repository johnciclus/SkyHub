import * as request from 'request';
import * as Jimp from 'jimp';
import * as fs from 'fs';

/**
 * Download an image and saves it to disk
 * @param url
 * @param path
 * @param name
 * @param callback
 */
export function download(url, path, name, callback){
    request.head(url, function(err, res, body){
        let filename = path+name+".jpg";
        request(url).pipe(fs.createWriteStream(filename)).on('close', function(){
            let imageObject = {
                url: "http://localhost:3000/image/"+name+".jpg",
                name: name,
                image: {
                    data: fs.readFileSync(filename),
                    contentType: 'image/jpeg'}
            };
            callback(imageObject);
        });
    });
}

/**
 * Transform an image and saves it to disk
 * @param object
 * @param size
 * @param callback
 */
export function transform(object, size, callback){
    let path = __dirname+'/public/images/';
    let name = object.name+"-"+size;

    Jimp.read(path+object.name+'.jpg', function (err, image) {
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
        image.resize(width, height).write(path+name+".jpg", function(){
            let imageObject = {
                url: "http://localhost:3000/image/"+name+".jpg",
                name: name,
                image: {
                    data: fs.readFileSync(path+name+".jpg"),
                    contentType: 'image/jpeg'}
            };
            callback(imageObject);
        });
    });
}