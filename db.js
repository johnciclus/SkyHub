"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var db = mongoose.connection;
mongoose.Promise = global.Promise;
/**
 * Connect with database service and define database
 */
mongoose.connect('localhost', 'skyhub');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('MondgoDB is connected!');
});
/**
 * Define Image Schema for working with images
 * @type {mongoose.Schema}
 */
var ImageSchema = new mongoose.Schema({
    url: String,
    name: String,
    image: { data: Buffer, contentType: String }
});
/**
 * Creates a Image Model
 */
var Image = mongoose.model('Image', ImageSchema);
/**
 * Public function for remove all data in Image Collection
 */
function remove() {
    //mongoose.connection.on('open', function (){
    Image.remove(function (err, result) {
        if (err)
            throw err;
        console.log('removed old docs');
    });
    //});
}
exports.remove = remove;
/**
 * Public function for save an image in Image Collection
 * @param object
 * @param callback
 */
function setImage(object, callback) {
    var image = new Image(object);
    image.save(function (error, result) {
        if (error) {
            console.error(error);
            return;
        }
        callback(result);
    });
}
exports.setImage = setImage;
/**
 * Public function for get an image in Image Collection
 * @param imageName
 * @param callback
 */
function getImage(imageName, callback) {
    imageName = imageName.substring(0, imageName.indexOf('.'));
    Image.find({ name: imageName }, function (error, result) {
        if (error) {
            console.error(error);
            return;
        }
        callback(result[0]);
    });
}
exports.getImage = getImage;
/**
 * Public function for get all images in Image Collection
 * @param callback
 */
function getImages(callback) {
    Image.find({}, function (error, result) {
        if (error) {
            console.error(error);
            return;
        }
        callback(result);
    });
}
exports.getImages = getImages;
