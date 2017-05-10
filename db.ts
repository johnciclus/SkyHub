import * as mongoose from 'mongoose';

let db = mongoose.connection;

mongoose.Promise = global.Promise;
/**
 * Connect with database service and define database
 */
mongoose.connect('localhost', 'skyhub');

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    console.log('MondgoDB is connected!')
});

/**
 * Define Image Schema for working with images
 * @type {mongoose.Schema}
 */
let ImageSchema = new mongoose.Schema({
    url: String,
    name: String,
    image: { data: Buffer, contentType: String }
});

/**
 * Creates a Image Model
 */
let Image = mongoose.model('Image', ImageSchema);

/**
 * Public function for remove all data in Image Collection
 */
export function remove(){
    //mongoose.connection.on('open', function (){
    Image.remove(function(err, result){
        if (err) throw err;
        console.log('removed old docs');
    })
    //});
}

/**
 * Public function for save an image in Image Collection
 * @param object
 * @param callback
 */
export function setImage(object: ImagesSchema, callback: (result) => void) {
    let image = new Image(object);
    image.save(function(error, result) {
        if(error) { console.error(error); return; }
        callback(result);
    });
}

/**
 * Public function for get an image in Image Collection
 * @param imageName
 * @param callback
 */
export function getImage(imageName: string, callback: (image: ImagesSchema) => void) {
    imageName = imageName.substring(0,imageName.indexOf('.'));
    Image.find({name: imageName}, function(error, result) {
        if(error) { console.error(error); return; }
        callback(result[0]);
    });
}

/**
 * Public function for get all images in Image Collection
 * @param callback
 */
export function getImages(callback: (images: ImagesSchema[]) => void) {
    Image.find({}, function(error, result) {
        if(error) { console.error(error); return; }
        callback(result);
    });
}