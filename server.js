var serverHelper = require('./ServerHelper');
serverHelper.init()

var faker = require('faker')
var jsonServer = require('json-server')
var server = jsonServer.create()
var middlewares = jsonServer.defaults()
server.listen(3000, function () {console.log('OMNIA JSON Server is running!')})



 
server.get('/omnia/case/list', function (req, res) {
	res.status(200).send(
	undefined
)
})
 
server.get('/omnia/case/page', function (req, res) {
	res.status(200).send(
	{"contents":[{"caseId":0,"creationDate":"2016-11-18T11:49:13.570Z","lastDate":"2016-06-09T09:13:57.756Z","defendant":"aspernatur sit eveniet","lastAction":"eum perferendis modi","lawFirmId":5,"lawFirmName":"quae vel consequatur","plaintiff":"dolor repellat praesentium","signature":"minima voluptas est","state":"et ipsa eum"}],"last":false,"page":1,"size":1}
)
})
 
server.get('/omnia/case/:id', function (req, res) {
	res.status(200).send(
	undefined
)
})
 
server.get('/omnia/content', function (req, res) {
	res.status(200).send(
	{"contents":[{"categoryId":0,"code":"perferendis ut similique","contentId":2,"languageCode":"qui omnis omnis","name":"Senior Communications Consultant"}],"last":false,"page":1,"size":1}
)
})
 
server.get('/omnia/content/:code', function (req, res) {
	res.status(200).send(
	{"contents":["error cumque molestiae"],"last":false,"page":1,"size":1}
)
})
 
server.get('/omnia/events', function (req, res) {
	res.status(200).send(
	{"contents":[{"categories":{"categoryId":0,"name":"Global Web Strategist"},"eventId":1,"eventStartDate":"2017-02-27T14:58:55.249Z","image":"https://source.unsplash.com/collection/1023/100x100","name":"District Group Orchestrator"}],"last":false,"page":1,"size":1}
)
})
 
server.get('/omnia/events/categories', function (req, res) {
	res.status(200).send(
	undefined
)
})
 
server.get('/omnia/events/:id', function (req, res) {
	res.status(200).send(
	undefined
)
})
 
server.get('/omnia/lawFirms', function (req, res) {
	res.status(200).send(
	{"contents":[{"address":"Padberg Ville, South Celestineview","cardType":"omnis dolor quia","caseCount":8765,"city":"Kundefurt","clientId":4,"creationDate":"2016-10-24T20:52:02.352Z","defaultTranslation":false,"email":"Helmer.Lemke76@hotmail.com","image":"https://source.unsplash.com/collection/1028/100x100","languageCode":"et aut explicabo","lastUpdate":"2017-01-21T12:21:33.127Z","lawFirmId":11,"lawFirmTranslationId":12,"name":"Dynamic Group Assistant","specializations":["labore qui nihil"],"types":["in labore est"],"latitude":"61.2750","longitude":"-19.3542"}],"last":false,"page":1,"size":1}
)
})
 
server.get('/omnia/lawFirms/client', function (req, res) {
	res.status(200).send(
	{"contents":[{"address":"Padberg Ville, South Celestineview","cardType":"omnis dolor quia","caseCount":8765,"city":"Kundefurt","clientId":4,"creationDate":"2016-10-24T20:52:02.352Z","defaultTranslation":false,"email":"Helmer.Lemke76@hotmail.com","image":"https://source.unsplash.com/collection/1028/100x100","languageCode":"et aut explicabo","lastUpdate":"2017-01-21T12:21:33.127Z","lawFirmId":11,"lawFirmTranslationId":12,"name":"Dynamic Group Assistant","specializations":["labore qui nihil"],"types":["in labore est"],"latitude":"61.2750","longitude":"-19.3542"}],"last":false,"page":1,"size":1}
)
})
 
server.get('/omnia/lawFirms/:id', function (req, res) {
	res.status(200).send(
	undefined
)
})
 
server.get('/omnia/legalActions/:caseId', function (req, res) {
	res.status(200).send(
	undefined
)
})
 
server.get('/omnia/news', function (req, res) {
	res.status(200).send(
	{"contents":[{"categories":{"categoryId":0,"languageCode":"perspiciatis debitis qui","name":"Principal Implementation Engineer","published":false,"sortOrder":8765},"image":"https://source.unsplash.com/collection/1021/100x100","languageCode":"fuga id sint","lead":"Consectetur aut exercitationem repellendus aut pariatur autem consequatur.\nAut et ut ullam magni ex.\nUt modi facilis illum magnam id et eius.\nId praesentium explicabo magnam ea ut mollitia quaerat labore.","newsId":4,"publicationDate":"2016-08-23T23:10:42.342Z","title":"accusamus modi dolor"}],"last":false,"page":1,"size":1}
)
})
 
server.get('/omnia/news/categories', function (req, res) {
	res.status(200).send(
	undefined
)
})
 
server.get('/omnia/news/:id', function (req, res) {
	res.status(200).send(
	{"contents":["dolores fugit nihil"],"last":false,"page":1,"size":1}
)
})
 
server.get('/omnia/notification', function (req, res) {
	res.status(200).send(
	{"contents":[{"date":"2017-02-23T17:22:21.908Z","description":"Blanditiis natus ut sint accusantium. Id voluptas incidunt et dolores ullam expedita. Omnis enim eligendi rerum.","notificationId":2,"quantity":8765,"type":"sed omnis soluta"}],"last":false,"page":1,"size":1}
)
})
 
server.get('/omnia/alerts', function (req, res) {
	res.status(200).send(
	{"contents":[{"date":"2017-01-22T00:08:03.208Z","description":"sunt magni porro","alertId":2,"type":"ut aut sunt","caseId":4}],"last":false,"page":1,"size":1}
)
})