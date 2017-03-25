var serverHelper = require('./ServerHelper');
serverHelper.init()

var faker = require('faker')
var jsonServer = require('json-server')
var server = jsonServer.create()
var middlewares = jsonServer.defaults()
server.listen(3000, function () {
console.log('OMNIA JSON Server is running on port: '+3000)})



server.get('/omnia/case/list', function (req, res) {
	console.log(req.params.id)

	res.status(200).send(serverHelper.generateFakeObjectResponse(serverHelper.getModelByName('CaseListView'), req.params.id))
})

server.get('/omnia/case/page', function (req, res) {
	console.log(req.query)

	res.status(200).send(serverHelper.generateFakeArrayResponse(serverHelper.getModelByName('PageOfCaseListView'), req.query))
})

server.get('/omnia/case/:id', function (req, res) {
	console.log(req.params.id)

	res.status(200).send(serverHelper.generateFakeObjectResponse(serverHelper.getModelByName('CaseDetailsDto'), req.params.id))
})

server.get('/omnia/content', function (req, res) {
	console.log(req.query)

	res.status(200).send(serverHelper.generateFakeArrayResponse(serverHelper.getModelByName('PageOfContentListView'), req.query))
})

server.get('/omnia/content/:code', function (req, res) {
	console.log(req.params.id)

	res.status(200).send(serverHelper.generateFakeObjectResponse(serverHelper.getModelByName('ContentDetailsDto'), req.params.id))
})

server.get('/omnia/events', function (req, res) {
	console.log(req.query)

	res.status(200).send(serverHelper.generateFakeArrayResponse(serverHelper.getModelByName('PageOfEventListDto'), req.query))
})

server.get('/omnia/events/categories', function (req, res) {
	console.log(req.params.id)

	res.status(200).send(serverHelper.generateFakeObjectResponse(serverHelper.getModelByName('EventCategoryDto'), req.params.id))
})

server.get('/omnia/events/:id', function (req, res) {
	console.log(req.params.id)

	res.status(200).send(serverHelper.generateFakeObjectResponse(serverHelper.getModelByName('EventDetailsDto'), req.params.id))
})

server.get('/omnia/lawFirms', function (req, res) {
	console.log(req.query)

	res.status(200).send(serverHelper.generateFakeArrayResponse(serverHelper.getModelByName('PageOfLawFirmList'), req.query))
})

server.get('/omnia/lawFirms/client', function (req, res) {
	console.log(req.query)

	res.status(200).send(serverHelper.generateFakeArrayResponse(serverHelper.getModelByName('PageOfLawFirmList'), req.query))
})

server.get('/omnia/lawFirms/:id', function (req, res) {
	console.log(req.params.id)

	res.status(200).send(serverHelper.generateFakeObjectResponse(serverHelper.getModelByName('LawFirmDetailsDto'), req.params.id))
})

server.get('/omnia/legalActions/document/:id', function (req, res) {
	console.log(req.query)

	res.status(200).send(serverHelper.generateFakeByType(req.params.id, 'string', 'string'))
})

server.get('/omnia/legalActions/:caseId', function (req, res) {
	console.log(req.params.id)

	res.status(200).send(serverHelper.generateFakeObjectResponse(serverHelper.getModelByName('LegalActionDto'), req.params.id))
})

server.get('/omnia/news', function (req, res) {
	console.log(req.query)

	res.status(200).send(serverHelper.generateFakeArrayResponse(serverHelper.getModelByName('PageOfNewsListDto'), req.query))
})

server.get('/omnia/news/categories', function (req, res) {
	console.log(req.params.id)

	res.status(200).send(serverHelper.generateFakeObjectResponse(serverHelper.getModelByName('NewsCategoryDto'), req.params.id))
})

server.get('/omnia/news/:id', function (req, res) {
	console.log(req.params.id)

	res.status(200).send(serverHelper.generateFakeObjectResponse(serverHelper.getModelByName('NewsDetailsDto'), req.params.id))
})

server.get('/omnia/notification', function (req, res) {
	console.log(req.query)

	res.status(200).send(serverHelper.generateFakeArrayResponse(serverHelper.getModelByName('PageOfNotificationDto'), req.query))
})

server.get('/omnia/alerts', function (req, res) {
	console.log(req.query)

	res.status(200).send(serverHelper.generateFakeArrayResponse(serverHelper.getModelByName('PageOfAlert'), req.query))
})