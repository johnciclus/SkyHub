import * as mongodb from 'mongodb';

let server = new mongodb.Server('localhost', 27017, {auto_reconnect: true});
let db = new mongodb.Db('skyhub', server, { w: 1 });
let Images;

db.open(function() {});
db.collection('images', function(error, images_collection) {
    if(error) { console.error(error); return; }
    Images = images_collection;
});

export interface Image {
    url: string;
    image: { data: Buffer, contentType: String };
}

export function setImage(image: Image, callback: () => void) {
    Images.insertOne(image, function(error, result) {
        if(error) { console.error(error); return; }
        callback();
    });
}

export function getImage(imageId: string, callback: (image: Image) => void) {
    Images.find({_id: new mongodb.ObjectID(imageId)}, function(error, image) {
        if(error) { console.error(error); return; }
        console.log(imageId);
        console.log(image);
        callback(image);
    });
}

export function getImages(callback: (images: Image[]) => void) {
    Images.find().toArray(function(error, images) {
        callback(images);
    });
}


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