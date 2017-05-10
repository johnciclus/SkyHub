"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
var Jimp = require("jimp");
var fs = require("fs");
/**
 * Download an image and saves it to disk
 * @param url
 * @param path
 * @param name
 * @param callback
 */
function download(url, path, name, callback) {
    request.head(url, function (err, res, body) {
        var filename = path + name + ".jpg";
        request(url).pipe(fs.createWriteStream(filename)).on('close', function () {
            var imageObject = {
                url: "http://localhost:3000/image/" + name + ".jpg",
                name: name,
                image: {
                    data: fs.readFileSync(filename),
                    contentType: 'image/jpeg'
                }
            };
            callback(imageObject);
        });
    });
}
exports.download = download;
/**
 * Transform an image and saves it to disk
 * @param object
 * @param size
 * @param callback
 */
function transform(object, size, callback) {
    var path = __dirname + '/public/images/';
    var name = object.name + "-" + size;
    Jimp.read(path + object.name + '.jpg', function (err, image) {
        if (err)
            throw err;
        var width = 320;
        var height = 240;
        switch (size) {
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
        image.resize(width, height).write(path + name + ".jpg", function () {
            var imageObject = {
                url: "http://localhost:3000/image/" + name + ".jpg",
                name: name,
                image: {
                    data: fs.readFileSync(path + name + ".jpg"),
                    contentType: 'image/jpeg'
                }
            };
            callback(imageObject);
        });
    });
}
exports.transform = transform;
