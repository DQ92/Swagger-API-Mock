/**
 * Created by daniel on 24.03.2017.
 */

var fs = require('fs');
var faker = require('faker')

var serverHelper = require('./ServerHelper');
serverHelper.init()

var json = JSON.parse(fs.readFileSync('j.json').toString());

var dtos = json['definitions'] //['PageOfLawFirmList']['properties']
// log(dtos)

// for(var d in dtos) {
//     var result = test(dtos[d].properties, 1)
//     log("\n\n" + d + " \n ")
//     log(result)
// }

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
        "server.listen(3000, function () {" +
        "console.log('OMNIA JSON Server is running!')" +
        "})\n\n\n"

    var list = endpointsAndModelsList
    Object.getOwnPropertyNames(list).forEach(
        function (val, idx, array) {
            var modelName = list[val].modelName
            var endpointName = list[val].endpointName
            var method = "get"
            var responseType = list[val].responseType // array or object

            if(modelName != undefined) {
                if (isSimpleType(modelName)) {
                    // var fake = generateFakeByType(1, modelName, modelName)
                    // var response = JSON.stringify(fake)
                    // var response = "serverHelper.generateFakeByType(1, " + "'" + modelName + "'" + "," + "'" + modelName +"'"+ ")"
                    // content = content + "\n \n" + "server." + method + "('" + endpointName + "', function (req, res) {\n" +
                    //     "\tres.status(" + 200 + ").send(\n\t" + response + "\n)\n})"
                } else {
                    // if(responseType == "object") {
                    //     var model = getModelByName(modelName)
                    //     var fakeModel = test(model, 1)
                    //
                    // } else { // array

                        var model = getModelByName(modelName)
                        var testParams = {
                            "size": 1,
                            "page": 0
                        };
                        var resp = serverHelper.generateFakeArrayResponse(model, testParams)
                        // var response = JSON.stringify(resp)
                        // log("\n\n RESP: " + endpointName)
                        // log(resp)

                        var response = "serverHelper.generateFakeArrayResponse(serverHelper.getModelByName('"+modelName+"'), req.query)"
                        content = content + "\n \n" + "server." + method + "('" + endpointName + "', function (req, res) {\n" +
                                "\tconsole.log(req.query)\n" +
                            "\tres.status(" + 200 + ").send(\n\t" + response + "\n)})"
                    // }
                }
            }
        }
    );

    return content
}


function generateFakeArrayResponse(model, params) {
    if(params != undefined && model['content'] != undefined) {
        var size = 10
        var page = params.page

        if(params['size'] != undefined) {
            size = Number(params.size)
        }
        if(params['page'] != undefined) {
            page = Number(params.page)
        }

        var start = (size * page) + 1
        var list = new Array()

        for(var idx=start; idx<(size+start); idx++) {
            var fakeResult = test(model)
            list.push(fakeResult['content'])
        }

        var isLast = false
        if(page >= 5) {
            isLast = true
            list = []
        }

        var response = {
            "contents": list,
            'last': isLast,
            'page': page + 1,
            'size': size
        };

        return response

    } else {
        // var result = test(model, 1)
        // return result
    }
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
                if(method != "get") {
                    break
                }
                var t = json["paths"][val][method]
                var responses = Object.keys(t["responses"]);
                var responseType = "object"
                if(t["responses"]['200'] != undefined) {
                    var response200 = t["responses"]['200']

                    var description = response200['description']
                    if (description == "OK") {
                        var schema = response200['schema']
                        if(schema != undefined) {
                            if(schema['type'] == undefined) {
                                var ref = schema["$ref"]
                                modelName = getModelName(ref)
                            } else {
                                responseType = "array"
                                var type = schema['type']
                                var ref = schema["items"]['$ref']
                                if(ref != undefined) {
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

            if(modelName != undefined) {
                endpointsAndModels.push({
                    "endpointName": endpointName,
                    "modelName": modelName,
                    "responseType": responseType
                })
            }
        }
    );

    return endpointsAndModels
}

function test(obj) {
    var idx = 0
    for (var field in obj) {
        var type = obj[field]['type']
        if(isSimpleType(type)) {
            obj[field] = generateFakeByType(idx, type, field)
        } else {
            if(isArray(type)) {
                var refModelName = modelNameIfRefInArray(obj, field)
                if(refModelName != undefined) {
                    var innerModel = getModelByName(refModelName)
                    obj[field] = test(innerModel)
                } else { // Lista prostych typów

                    var typeInArray = obj[field]['items'].type.replace("[", "")
                    typeInArray = typeInArray.replace("]", "")
                    obj[field] = generateFakeList(typeInArray, field, 1)
                }
            } else {
                //własny typ
                if(obj[field]['$ref'] != undefined) {
                    var refModelName = modelNameIfRefInObject(obj, field)
                    var innerModel = json["definitions"][refModelName]
                    obj[field] = test(innerModel)
                } else {
                    //log("ERROR! Unknown type! : " + obj[field] + " / " + field)
                }
            }
        }
        idx = idx + 1
    }
    return obj
}

function getModelName(ref) {
    return ref.replace("#/definitions/", "")
}

function modelNameIfRefInArray(obj, fieldName) {
    if(obj[fieldName]['items'] != undefined) {
        if(obj[fieldName]['items']['$ref'] != undefined) {
            var path = obj[fieldName]['items']['$ref']
            path = path.replace("#/definitions/", "")
            return path
        }
    }
    return undefined
}

function modelNameIfRefInObject(obj, fieldName) {
    if(obj[fieldName]['$ref'] != undefined) {
        var path = obj[fieldName]['$ref']
        path = path.replace("#/definitions/", "")
        return path
    }
    return undefined
}


function generateFakeList(typeInArray, fieldName, count) {
    var tempList = []
    for(var i=0; i<count; i=i+1) {
        var fake = generateFakeByType(i, typeInArray, fieldName)
        tempList.push(fake)
    }
    return tempList
}

function getModelByName(name) {
    return json["definitions"][name].properties
}


function isSimpleType(typeStr) {
    if("string" == typeStr) {
        return true
    } else if("integer" == typeStr) {
        return true
    } else if("number" == typeStr) {
        return true
    }  else if("bool" == typeStr || "boolean" == typeStr ) {
        return true
    }
    return false
}


function isArray(typeStr) {
    if("array" == typeStr) {
        return true
    }
    return false
}


function generateFakeDate(id) {
    return faker.date.past()
}

function generateFakeByType(id, type, fieldName) {
    var fake = undefined

    if("string" == type) {
        if(fieldName.indexOf("name") !== -1) {
            return faker.name.title()
        }
        if(fieldName.indexOf("image") !== -1) {
            return "https://source.unsplash.com/collection/102"+Number(id)+"/100x100"
        }
        if(fieldName.indexOf("date") !== -1 || fieldName.indexOf("Date") !== -1) {
            return generateFakeDate(id)
        }
        if(fieldName.indexOf("email") !== -1) {
            return faker.internet.email()
        }
        if(fieldName.indexOf("address") !== -1) {
            return faker.address.streetName() + ", " + faker.address.city()
        }
        if(fieldName.indexOf("city") !== -1) {
            return faker.address.city()
        }
        if(fieldName.indexOf("phone") !== -1) {
            return faker.phone.phoneNumber()
        }
        if(fieldName.indexOf("latitude") !== -1) {
            return faker.address.latitude()
        }
        if(fieldName.indexOf("longitude") !== -1) {
            return faker.address.longitude()
        }
        if(fieldName.indexOf("lead") !== -1) {
            return faker.lorem.text()
        }
        if(fieldName.indexOf("description") !== -1) {
            return faker.lorem.text()
        }
        if(fieldName.indexOf("url") !== -1 || fieldName.indexOf("Url") !== -1) {
            return faker.internet.url()
        }
        return faker.lorem.words()
    } else if("integer" == type) {
        if(fieldName.indexOf("id") !== -1 || fieldName.indexOf("Id") !== -1) {
            return id
        }
        return 8765
    } else if("number" == type) {
        if(fieldName.indexOf("latitude") !== -1) {
            return faker.address.latitude()
        }
        if(fieldName.indexOf("longitude") !== -1) {
            return faker.address.longitude()
        }

        return 9123
    }  else if("bool" == type || "boolean" == type) {
        return false
    }
    return fake
}



function log(msg) {
    console.log(msg)
}

function clone(obj) {
    var clone = {};
    clone.prototype = obj.prototype;
    for (var property in obj) clone[property] = obj[property];
    return clone;
}

function saveFileServer(content) {
    var filename = "server.js"
    fs.writeFile(filename, content, function(err) {
        if(err) {
            return console.log(err);
        }
        log("\n ----- The file was saved! type \"node " + filename + "\" in your console -----\n");
    });
}
