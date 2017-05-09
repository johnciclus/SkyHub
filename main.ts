import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as request from 'request';
import * as db from './db'
import * as fs from 'fs';
import { MongoClient } from 'mongodb';
import { download, transform } from './ImageFunctions';

let url = "http://54.152.221.29/images.json";
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.listen(3000, function () {
    console.log('Express app listening on port 3000')
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

app.get('/image/:imageid', (req, res) => {
    console.log('getting image ' + req.params.imageid);
    db.getImage(req.params.imageid, file => {
        res.contentType(file.image.contentType);
        res.send(file.image.data);
    });
});

request(url, function(error, response, body){
    let path = __dirname+'/public/images/';
    let data = JSON.parse(body);
    let images = data.images;
    let name, url;
    let image = {   url:'http://localhost:3000/images/b737_5-large.jpg',
                    image: {
                        data: fs.readFileSync("/www/SkyHub/public/images/b737_1.jpg"),
                        contentType: 'image/jpg'}};

    db.setImage(image, function (){
       console.log('set image')
    });

    db.getImages(function(images){
       console.log(images);
    });

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
});


