import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as request from 'request';
import * as dbMongoose from './db';
import * as moment from 'moment';
import { download, transform } from './ImageFunctions';

let url = "http://54.152.221.29/images.json";
let app = express();
let initialTime = moment();
let finalTime, diff;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(3000, function () {
    console.log('Express app listening on port 3000')
});

/**
 * Definition of GET request of the URL /, that generates a list of images with url
 */
app.get('/', function (req, res) {
    initialTime = moment();
    dbMongoose.getImages(function(images){
        let response = [];
        let name, url;

        for(let image of images) {
            url = image.url;
            name = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
            response.push({url: url}) //small: path+name+"-small.jpg", medium: path+name+"-medium.jpg", large: path+name+"-large.jpg"})
        }
        res.setHeader('Content-Type', 'application/json');
        printDuration()
        return res.send(JSON.stringify(response));
    });
});

/**
 * Definition of GET request of the URL /image/:imageName, that allows downloading the image
 */
app.get('/image/:imageName', (req, res) => {
    dbMongoose.getImage(req.params.imageName, file => {
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
request(url, function(error, response, body){
    let path = __dirname+'/public/images/';
    let data = JSON.parse(body);
    let images = data.images;
    let name, url;
    let image;

    for(let image of images){
        url = image.url;
        name = url.substring(url.lastIndexOf("/")+1, url.lastIndexOf("."));

        download(url, path, name, function(_image){

            dbMongoose.setImage(_image, function (result) {
                console.log('Save image '+result.name+' with id: '+result._id)
            });

            transform(_image, 'small', function(_imageTransformate){
                dbMongoose.setImage(_imageTransformate, function (result) {
                    console.log('Save image '+result.name+' with id: '+result._id)
                });
            });

            transform(_image, 'medium', function(_imageTransformate){
                dbMongoose.setImage(_imageTransformate, function (result) {
                    console.log('Save image '+result.name+' with id: '+result._id)
                });
            });

            transform(_image, 'large', function(_imageTransformate){
                dbMongoose.setImage(_imageTransformate, function (result) {
                    console.log('Save image '+result.name+' with id: '+result._id)
                });
            });
        });
    }
});

function printDuration(){
    finalTime = moment();
    diff = moment.duration(finalTime.diff(initialTime))
    console.log( diff._milliseconds + ' milliseconds');
}

