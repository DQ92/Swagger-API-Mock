"use strict";
var jsonServer = require('json-server');
var ServerFaker_1 = require('./src/ServerFaker');
var server = jsonServer.create();
server.listen(3001, function () { console.log('OMNIA JSON Server is running!'); });
var s = new ServerFaker_1.ServerFaker();
server.get('/omnia/news', function (req, res) {
    res.status(200).send(s.generateObjectStringMethod({ "properties": { "content": [{ "categories": [{ "categoryId": { "type": "integer", "format": "int64" }, "languageCode": { "type": "string" }, "name": { "type": "string" }, "published": { "type": "boolean" }, "sortOrder": { "type": "integer", "format": "int32" } }], "image": { "type": "string" }, "languageCode": { "type": "string" }, "lead": { "type": "string" }, "newsId": { "type": "integer", "format": "int64" }, "publicationDate": { "type": "string", "format": "date-time" }, "title": { "type": "string" } }], "first": { "type": "boolean" }, "last": { "type": "boolean" }, "number": { "type": "integer", "format": "int32" }, "numberOfElements": { "type": "integer", "format": "int32" }, "size": { "type": "integer", "format": "int32" }, "sort": { "type": "integer" }, "totalElements": { "type": "integer", "format": "int64" }, "totalPages": { "type": "integer", "format": "int32" } } }, req.params));
});
