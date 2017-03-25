/**
 * Created by daniel on 24.03.2017.
 */

var fs = require('fs');
var faker = require('faker')

var serverHelper = require('./ServerHelper');
serverHelper.init();

var serverPort = 3000;

var json = serverHelper.getJSON();

var endpointsAndModels = generateEndpoints(json['paths'])

var contentToSave = generateServerContentString(endpointsAndModels)
saveFileServer(contentToSave)


function generateServerContentString(endpointsAndModelsList) {
    var content = "var serverHelper = require('./ServerHelper');\n" +
        "serverHelper.init()\n\n" +
        "var faker = require('faker')\n" +
        "var jsonServer = require('json-server')\n" +
        "var server = jsonServer.create()\n" +
        "var middlewares = jsonServer.defaults()\n" +
        "server.listen(" + serverPort + ", function () {\n" +
        "console.log('OMNIA JSON Server is running on port: '+" + serverPort + ")" +
        "})\n\n"

    var list = endpointsAndModelsList
    Object.getOwnPropertyNames(list).forEach(
        function (val, idx, array) {
            var modelName = list[val].modelName
            var endpointName = list[val].endpointName
            var method = "get"
            var responseType = list[val].responseType // array or object

            if (modelName != undefined) {
                if (isSimpleType(modelName)) {
                    // var resp = serverHelper.generateFakeByType(1, modelName, modelName)
                    // log(resp)

                    var response = "serverHelper.generateFakeByType(req.params.id, '" + modelName + "', '" + modelName + "')"
                    content = content +
                        "\n\n" +
                        "server." + method + "('" + endpointName + "', function (req, res) {" +
                        "\n\t" +
                        "console.log(req.query)" +
                        "\n\n\t" +
                        "res.status(" + 200 + ").send(" + response + ")" +
                        "\n" +
                        "})"

                    // log(modelName + " = isSimpleType")

                } else {
                    var model = getModelByName(modelName)
                    var containsContent = model['content']

                    if (containsContent == undefined) { //obiekt
                        // log(endpointName)
                        // log(modelName)
                        content = content + generateObjectResponseString(modelName, endpointName, method)

                    } else if (containsContent["type"] == "array") {

                        content = content + generateArrayResponseString(modelName, endpointName, method)

                    } else { // obiekt
                        content = content + generateObjectResponseString(modelName, endpointName, method)

                    }
                }
            }
        }
    );
    return content
}

function generateObjectResponseString(modelName, endpointName, method) {
    var m = serverHelper.getModelByName(modelName)
    var resp = serverHelper.generateFakeObjectResponse(m, 44)
    // log("\n\n RESP: " + endpointName)
    // log(m)
    // log("FAKE")
    // log(resp)

    var response = "serverHelper.generateFakeObjectResponse(serverHelper.getModelByName('" + modelName + "'), req.params.id)"

    var content =
        "\n\n" +
        "server." + method + "('" + endpointName + "', function (req, res) {" +
        "\n\t" +
        "console.log(req.params.id)" +
        "\n\n\t" +
        "res.status(" + 200 + ").send(" + response + ")" +
        "\n" +
        "})"

    return content
}

function generateArrayResponseString(modelName, endpointName, method) {
// var model = getModelByName(modelName)
    // var testParams = {
    //     "size": 1,
    //     "page": 0
    // };
    // var resp = serverHelper.generateFakeArrayResponse(model, testParams)
    // var response = JSON.stringify(resp)
    // log("\n\n RESP: " + endpointName)
    // log(resp)

    var response = "serverHelper.generateFakeArrayResponse(serverHelper.getModelByName('" + modelName + "'), req.query)"
    var content =
        "\n\n" +
        "server." + method + "('" + endpointName + "', function (req, res) {" +
        "\n\t" +
        "console.log(req.query)" +
        "\n\n\t" +
        "res.status(" + 200 + ").send(" + response + ")" +
        "\n" +
        "})"

    // log(modelName + " = array")
    return content
}

function generateEndpoints(endpoints) {
    var endpointsAndModels = []

    Object.getOwnPropertyNames(endpoints).forEach(
        function (val, idx, array) {
            // log("\n")
            // log(val)

            var methods = json["paths"][val]
            var modelName = undefined
            var endpointName = val.replace("{", ":")
            endpointName = endpointName.replace("}", "")

            for (var method in methods) {
                if (method != "get") {
                    break
                }
                var t = json["paths"][val][method]
                var responses = Object.keys(t["responses"]);

                if (t["responses"]['200'] != undefined) {
                    var response200 = t["responses"]['200']

                    var description = response200['description']
                    if (description == "OK") {
                        var schema = response200['schema']
                        var responseType = "object"

                        if (schema != undefined) {
                            if (schema['type'] == undefined) {
                                var ref = schema["$ref"]
                                modelName = getModelName(ref)
                            } else {
                                var type = schema['type']
                                var ref = schema["items"]['$ref']
                                if (ref != undefined) {
                                    modelName = getModelName(ref)
                                } else {
                                    modelName = schema["items"].type
                                }
                            }
                        }
                    }
                } else {
                    log("\nBłąd in generateEndpoints()\n")
                    return
                }
            }

            if (modelName != undefined) {
                endpointsAndModels.push({
                    "endpointName": endpointName,
                    "modelName": modelName
                })
            }
        }
    );

    return endpointsAndModels
}

function getModelName(ref) {
    return ref.replace("#/definitions/", "")
}

function getModelByName(name) {
    return json["definitions"][name].properties
}

function isSimpleType(typeStr) {
    if ("string" == typeStr) {
        return true
    } else if ("integer" == typeStr) {
        return true
    } else if ("number" == typeStr) {
        return true
    } else if ("bool" == typeStr || "boolean" == typeStr) {
        return true
    }
    return false
}

function log(msg) {
    console.log(msg)
}

function saveFileServer(content) {
    var filename = "server.js"
    fs.writeFile(filename, content, function (err) {
        if (err) {
            return console.log(err);
        }
        log("\n ----- The file was saved! type \"node " + filename + "\" in your console -----\n");
    });
}
