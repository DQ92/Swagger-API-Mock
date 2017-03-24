var serverHelper = require('./ServerHelper');
serverHelper.init()

var faker = require('faker')
var jsonServer = require('json-server')
var server = jsonServer.create()
var middlewares = jsonServer.defaults()
server.listen(3000, function () {console.log('OMNIA JSON Server is running!')})



 
server.get('/omnia/case/list', function (req, res) {
	console.log(req.query)
	res.status(200).send(
	serverHelper.generateFakeArrayResponse(serverHelper.getModelByName('CaseListView'), req.query)
)})
 
server.get('/omnia/case/page', function (req, res) {
	console.log(req.query)
	res.status(200).send(
	serverHelper.generateFakeArrayResponse(serverHelper.getModelByName('PageOfCaseListView'), req.query)
)})
 
server.get('/omnia/case/:id', function (req, res) {
	console.log(req.query)
	res.status(200).send(
	serverHelper.generateFakeArrayResponse(serverHelper.getModelByName('CaseDetailsDto'), req.query)
)})
 
server.get('/omnia/content', function (req, res) {
	console.log(req.query)
	res.status(200).send(
	serverHelper.generateFakeArrayResponse(serverHelper.getModelByName('PageOfContentListView'), req.query)
)})
 
server.get('/omnia/content/:code', function (req, res) {
	console.log(req.query)
	res.status(200).send(
	serverHelper.generateFakeArrayResponse(serverHelper.getModelByName('ContentDetailsDto'), req.query)
)})
 
server.get('/omnia/events', function (req, res) {
	console.log(req.query)
	res.status(200).send(
	serverHelper.generateFakeArrayResponse(serverHelper.getModelByName('PageOfEventListDto'), req.query)
)})
 
server.get('/omnia/events/categories', function (req, res) {
	console.log(req.query)
	res.status(200).send(
	serverHelper.generateFakeArrayResponse(serverHelper.getModelByName('EventCategoryDto'), req.query)
)})
 
server.get('/omnia/events/:id', function (req, res) {
	console.log(req.query)
	res.status(200).send(
	serverHelper.generateFakeArrayResponse(serverHelper.getModelByName('EventDetailsDto'), req.query)
)})
 
server.get('/omnia/lawFirms', function (req, res) {
	console.log(req.query)
	res.status(200).send(
	serverHelper.generateFakeArrayResponse(serverHelper.getModelByName('PageOfLawFirmList'), req.query)
)})
 
server.get('/omnia/lawFirms/client', function (req, res) {
	console.log(req.query)
	res.status(200).send(
	serverHelper.generateFakeArrayResponse(serverHelper.getModelByName('PageOfLawFirmList'), req.query)
)})
 
server.get('/omnia/lawFirms/:id', function (req, res) {
	console.log(req.query)
	res.status(200).send(
	serverHelper.generateFakeArrayResponse(serverHelper.getModelByName('LawFirmDetailsDto'), req.query)
)})
 
server.get('/omnia/legalActions/:caseId', function (req, res) {
	console.log(req.query)
	res.status(200).send(
	serverHelper.generateFakeArrayResponse(serverHelper.getModelByName('LegalActionDto'), req.query)
)})
 
server.get('/omnia/news', function (req, res) {
	console.log(req.query)
	res.status(200).send(
	serverHelper.generateFakeArrayResponse(serverHelper.getModelByName('PageOfNewsListDto'), req.query)
)})
 
server.get('/omnia/news/categories', function (req, res) {
	console.log(req.query)
	res.status(200).send(
	serverHelper.generateFakeArrayResponse(serverHelper.getModelByName('NewsCategoryDto'), req.query)
)})
 
server.get('/omnia/news/:id', function (req, res) {
	console.log(req.query)
	res.status(200).send(
	serverHelper.generateFakeArrayResponse(serverHelper.getModelByName('NewsDetailsDto'), req.query)
)})
 
server.get('/omnia/notification', function (req, res) {
	console.log(req.query)
	res.status(200).send(
	serverHelper.generateFakeArrayResponse(serverHelper.getModelByName('PageOfNotificationDto'), req.query)
)})
 
server.get('/omnia/alerts', function (req, res) {
	console.log(req.query)
	res.status(200).send(
	serverHelper.generateFakeArrayResponse(serverHelper.getModelByName('PageOfAlert'), req.query)
)})