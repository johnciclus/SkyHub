"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb = require("mongodb");
var server = new mongodb.Server('localhost', 27017, { auto_reconnect: true });
var db = new mongodb.Db('skyhub', server, { w: 1 });
var Images;
db.open(function () { });
db.collection('images', function (error, images_collection) {
    if (error) {
        console.error(error);
        return;
    }
    Images = images_collection;
});
function setImage(image, callback) {
    Images.insertOne(image, function (error, result) {
        if (error) {
            console.error(error);
            return;
        }
        callback();
    });
}
exports.setImage = setImage;
function getImage(imageId, callback) {
    Images.find({ _id: new mongodb.ObjectID(imageId) }, function (error, image) {
        if (error) {
            console.error(error);
            return;
        }
        console.log(imageId);
        console.log(image);
        callback(image);
    });
}
exports.getImage = getImage;
function getImages(callback) {
    Images.find().toArray(function (error, images) {
        callback(images);
    });
}
exports.getImages = getImages;
/*
MongoClient.connect(mongoURL, function(err, db) {
    if (err) throw err;
    let imagesCollection = db.collection('images')

    imagesCollection.remove({});

    imagesCollection.find().toArray(function (err, result) {
        if (err) throw err;

        console.log(result)
    });

    db.close();
});
*/ 
