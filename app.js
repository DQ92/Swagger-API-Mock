/**
 * Created by daniel on 24.03.2017.
 */

var fs = require('fs');
var faker = require('faker')
var wordsToRemove = ["Dto", "List", "View", "ListView"]


var json = JSON.parse(fs.readFileSync('j.json').toString());

var dtos = json['definitions'] //['PageOfLawFirmList']['properties']
// log(dtos)

for(var d in dtos) {
    var result = test(dtos[d].properties, 1)

    log("\n\n" + d + " \n ")
    log(result)
}

// var result = test(dto, 1)
// log("\n WYNIK:")
// log(result)



function test(obj, countInArray) {
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
                    // var tempList = []
                    // for(var i=0; i<countInArray; i=i+1) {
                    //     var t = test(innerModel, 1)
                    //     tempList.push(t)
                    // }
                    obj[field] = test(innerModel, 1)
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
                    log("ERROR! Unknown type! : " + obj[field] + " / " + field)
                }
            }
        }
        idx = idx + 1
    }

    return obj
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