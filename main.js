"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var dbMongoose = require("./db");
var moment = require("moment");
var ImageFunctions_1 = require("./ImageFunctions");
var url = "http://54.152.221.29/images.json";
var app = express();
var initialTime = moment();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(3000, function () {
    console.log('Express app listening on port 3000');
});
/**
 * Definition of GET request of the URL /, that generates a list of images with url
 */
app.get('/', function (req, res) {
    dbMongoose.getImages(function (images) {
        var response = [];
        var name, url;
        for (var _i = 0, images_1 = images; _i < images_1.length; _i++) {
            var image = images_1[_i];
            url = image.url;
            name = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
            response.push({ url: url }); //small: path+name+"-small.jpg", medium: path+name+"-medium.jpg", large: path+name+"-large.jpg"})
        }
        res.setHeader('Content-Type', 'application/json');
        return res.send(JSON.stringify(response));
    });
});
/**
 * Definition of GET request of the URL /image/:imageName, that allows downloading the image
 */
app.get('/image/:imageName', function (req, res) {
    dbMongoose.getImage(req.params.imageName, function (file) {
        res.contentType(file.image.contentType);
        res.send(file.image.data);
    });
});
/**
 * Delete the data in the Image Collection
 */
dbMongoose.remove();
/**
 * Get the images links, downloading and transforming each image into three size formats
 */
request(url, function (error, response, body) {
    var path = __dirname + '/public/images/';
    var data = JSON.parse(body);
    var images = data.images;
    var name, url;
    var image;
    for (var _i = 0, images_2 = images; _i < images_2.length; _i++) {
        var image_1 = images_2[_i];
        url = image_1.url;
        name = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
        ImageFunctions_1.download(url, path, name, function (_image) {
            dbMongoose.setImage(_image, function (result) {
                console.log('Save image ' + result.name + ' with id: ' + result._id);
            });
            ImageFunctions_1.transform(_image, 'small', function (_imageTransformate) {
                dbMongoose.setImage(_imageTransformate, function (result) {
                    console.log('Save image ' + result.name + ' with id: ' + result._id);
                });
            });
            ImageFunctions_1.transform(_image, 'medium', function (_imageTransformate) {
                dbMongoose.setImage(_imageTransformate, function (result) {
                    console.log('Save image ' + result.name + ' with id: ' + result._id);
                });
            });
            ImageFunctions_1.transform(_image, 'large', function (_imageTransformate) {
                dbMongoose.setImage(_imageTransformate, function (result) {
                    console.log('Save image ' + result.name + ' with id: ' + result._id);
                });
            });
        });
    }
    var finalTime = moment();
    console.log(moment.duration(finalTime.diff(initialTime)));
});
