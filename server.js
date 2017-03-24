var serverHelper = require('./ServerHelper');
serverHelper.init()

var faker = require('faker')
var jsonServer = require('json-server')
var server = jsonServer.create()
var middlewares = jsonServer.defaults()
server.listen(3000, function () {console.log('OMNIA JSON Server is running!')})


