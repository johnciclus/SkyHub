import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as request from 'request';
import { MongoClient } from 'mongodb';
import { download, transform } from './ImageFunctions';

let app = express();
let mongoURL = 'mongodb://localhost:27017/skyhub';
let url = "http://54.152.221.29/images.json";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.listen(3000, function () {
    console.log('Express app listening on port 3000')
});

request(url, function(error, response, body){
    let path = __dirname+'/public/images/';
    let data = JSON.parse(body);
    let images = data.images;
    let name, url;

    for(let image of images){
        url = image.url;
        name = url.substring(url.lastIndexOf("/")+1, url.lastIndexOf("."));

        download(url, path, name, function(_name){
            transform(_name, 'small', function(){
                console.log('Image small transformation done');
            });

            transform(_name, 'medium', function(){
                console.log('Image medium transformation done');
            });

            transform(_name, 'large', function(){
                console.log('Image large transformation done');
            });

        });
    }

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
});


app.get('/', function (req, res) {
    request(url, function(error, response, body){
        let data = JSON.parse(body);
        let path = "http://localhost:3000/images/";
        let name, url;
        let images = [];

        for(let image of data.images) {
            url = image.url;
            name = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
            images.push({url: url, small: path+name+"-small.jpg", medium: path+name+"-medium.jpg", large: path+name+"-large.jpg"})
        }

        res.setHeader('Content-Type', 'application/json');
        return res.send(JSON.stringify(images));
    });
});

app.get('/images/:imageId', function (req, res) {
    let imageId = req.params.imageId;
    let size = req.query.size;

    console.log(imageId)
    console.log(size)

    return res.send('/images');
});


