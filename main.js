"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var db = require("./db");
var fs = require("fs");
var ImageFunctions_1 = require("./ImageFunctions");
var url = "http://54.152.221.29/images.json";
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.listen(3000, function () {
    console.log('Express app listening on port 3000');
});
app.get('/', function (req, res) {
    request(url, function (error, response, body) {
        var data = JSON.parse(body);
        var path = "http://localhost:3000/images/";
        var name, url;
        var images = [];
        for (var _i = 0, _a = data.images; _i < _a.length; _i++) {
            var image = _a[_i];
            url = image.url;
            name = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
            images.push({ url: url, small: path + name + "-small.jpg", medium: path + name + "-medium.jpg", large: path + name + "-large.jpg" });
        }
        res.setHeader('Content-Type', 'application/json');
        return res.send(JSON.stringify(images));
    });
});
app.get('/image/:imageid', function (req, res) {
    console.log('getting image ' + req.params.imageid);
    db.getImage(req.params.imageid, function (file) {
        console.log('Get Image');

        console.log(file);
        res.contentType(file.image.contentType);
        res.send(file.image.data);
    });
});
request(url, function (error, response, body) {
    var path = __dirname + '/public/images/';
    var data = JSON.parse(body);
    var images = data.images;
    var name, url;
    var image = { url: 'http://localhost:3000/images/b737_5-large.jpg',
        image: {
            data: fs.readFileSync("/www/SkyHub/public/images/b737_1.jpg"),
            contentType: 'image/jpg'
        } };
    db.setImage(image, function () {
        console.log('set image');
    });
    db.getImages(function (images) {
        console.log(images);
    });
    for (var _i = 0, images_1 = images; _i < images_1.length; _i++) {
        var image_1 = images_1[_i];
        url = image_1.url;
        name = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
        ImageFunctions_1.download(url, path, name, function (_name) {
            ImageFunctions_1.transform(_name, 'small', function () {
                console.log('Image small transformation done');
            });
            ImageFunctions_1.transform(_name, 'medium', function () {
                console.log('Image medium transformation done');
            });
            ImageFunctions_1.transform(_name, 'large', function () {
                console.log('Image large transformation done');
            });
        });
    }
});
