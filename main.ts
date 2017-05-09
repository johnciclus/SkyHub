import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as request from 'request';
import * as mongodb from 'mongodb';

let app = express();
let MongoClient = mongodb.MongoClient;
let url = "http://54.152.221.29/images.json";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

request(url, function(error, response, body){
    let data = JSON.parse(body);
    console.log(data.images);
});

app.get('/', function (req, res) {
    request(url, function(error, response, body){
        let data = JSON.parse(body);
        console.log(data.images);
        res.setHeader('Content-Type', 'application/json');
        return res.send(JSON.stringify(data.images));
    });
});

app.listen(3000, function () {
    console.log('Express app listening on port 3000')
});
