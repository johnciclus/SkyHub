"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
var Jimp = require("jimp");
var fs = require("fs");
function download(uri, path, name, callback) {
    request.head(uri, function (err, res, body) {
        var filename = path + name + ".jpg";
        request(uri).pipe(fs.createWriteStream(filename)).on('close', function () {
            callback(name);
        });
    });
}
exports.download = download;
function transform(filename, size, callback) {
    var path = __dirname + '/public/images/';
    Jimp.read(path + filename + '.jpg', function (err, image) {
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
        image.resize(width, height).write(path + filename + "-" + size + ".jpg");
    });
}
exports.transform = transform;
