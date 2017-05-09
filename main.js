"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var mongodb = require("mongodb");
var app = express();
var MongoClient = mongodb.MongoClient;
var url = "http://54.152.221.29/images.json";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
request(url, function (error, response, body) {
    var data = JSON.parse(body);
    console.log(data.images);
});
app.get('/', function (req, res) {
    request(url, function (error, response, body) {
        var data = JSON.parse(body);
        console.log(data.images);
        res.setHeader('Content-Type', 'application/json');
        return res.send(JSON.stringify(data.images));
    });
});
app.listen(3000, function () {
    console.log('Express app listening on port 3000');
});
