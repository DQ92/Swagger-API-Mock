/**
 * Created by daniel on 24.03.2017.
 */

var fs = require('fs');
var faker = require('faker');
var json = JSON.parse(fs.readFileSync('j.json').toString());
var defaultSize = 10
var defaultPage = 0
var maxPageCount = 5


module.exports = {

    init: function () {
        console.log("Helper initialized")
    },

    test: function (obj) {
        var idx = 0;
        for (var field in obj) {
            var type = obj[field]['type'];
            if (this.isSimpleType(type)) {
                obj[field] = this.generateFakeByType(idx, type, field)
            } else {
                if (this.isArray(type)) {
                    var refModelName = this.modelNameIfRefInArray(obj, field);
                    if (refModelName != undefined) {
                        var innerModel = this.getModelByName(refModelName);
                        obj[field] = this.test(innerModel)
                    } else { // Lista prostych typów

                        var typeInArray = obj[field]['items'].type.replace("[", "");
                        typeInArray = typeInArray.replace("]", "");
                        obj[field] = this.generateFakeList(typeInArray, field, 1)
                    }
                } else {
                    //własny typ
                    if (obj[field]['$ref'] != undefined) {
                        var refModelName = this.modelNameIfRefInObject(obj, field);
                        var innerModel = json["definitions"][refModelName];
                        obj[field] = this.test(innerModel)
                    } else {
                        //log("ERROR! Unknown type! : " + obj[field] + " / " + field)
                    }
                }
            }
            idx = idx + 1
        }
        return obj
    },

    generateFakeArrayResponse: function (model, params) {
        if (params != undefined && model['content'] != undefined) {
            var size = defaultSize;
            var page = defaultPage;

            if (params['size'] != undefined) {
                size = Number(params.size)
            }
            if (params['page'] != undefined) {
                page = Number(params.page)
            }

            var start = (size * page) + 1;
            var list = [];

            for (var idx = start; idx < (size + start); idx++) {
                var fakeResult = this.test(model);
                list.push(fakeResult['content'])
            }

            var isLast = false;
            if (page >= maxPageCount) {
                isLast = true;
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
    },

    modelNameIfRefInArray: function (obj, fieldName) {
        if (obj[fieldName]['items'] != undefined) {
            if (obj[fieldName]['items']['$ref'] != undefined) {
                var path = obj[fieldName]['items']['$ref'];
                path = path.replace("#/definitions/", "");
                return path
            }
        }
        return undefined
    },

    modelNameIfRefInObject: function (obj, fieldName) {
        if (obj[fieldName]['$ref'] != undefined) {
            var path = obj[fieldName]['$ref'];
            path = path.replace("#/definitions/", "");
            return path
        }
        return undefined
    },

    generateFakeList: function (typeInArray, fieldName, count) {
        var tempList = [];
        for (var i = 0; i < count; i = i + 1) {
            var fake = this.generateFakeByType(i, typeInArray, fieldName);
            tempList.push(fake)
        }
        return tempList
    },

    getModelByName: function (name) {
        return json["definitions"][name].properties
    },

    isArray: function (typeStr) {
        if ("array" == typeStr) {
            return true
        }
        return false
    },

    isSimpleType: function (typeStr) {
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
    },

    generateFakeByType: function (id, type, fieldName) {
        var fake = undefined;

        if ("string" == type) {
            if (fieldName.indexOf("name") !== -1) {
                return faker.name.title()
            }
            if (fieldName.indexOf("image") !== -1) {
                return "https://source.unsplash.com/collection/102" + Number(id) + "/100x100"
            }
            if (fieldName.indexOf("date") !== -1 || fieldName.indexOf("Date") !== -1) {
                return this.generateFakeDate(id)
            }
            if (fieldName.indexOf("email") !== -1) {
                return faker.internet.email()
            }
            if (fieldName.indexOf("address") !== -1) {
                return faker.address.streetName() + ", " + faker.address.city()
            }
            if (fieldName.indexOf("city") !== -1) {
                return faker.address.city()
            }
            if (fieldName.indexOf("phone") !== -1) {
                return faker.phone.phoneNumber()
            }
            if (fieldName.indexOf("latitude") !== -1) {
                return faker.address.latitude()
            }
            if (fieldName.indexOf("longitude") !== -1) {
                return faker.address.longitude()
            }
            if (fieldName.indexOf("lead") !== -1) {
                return faker.lorem.text()
            }
            if (fieldName.indexOf("description") !== -1) {
                return faker.lorem.text()
            }
            if (fieldName.indexOf("url") !== -1 || fieldName.indexOf("Url") !== -1) {
                return faker.internet.url()
            }
            return faker.lorem.words()
        } else if ("integer" == type) {
            if (fieldName.indexOf("id") !== -1 || fieldName.indexOf("Id") !== -1) {
                return id
            }
            return 8765
        } else if ("number" == type) {
            if (fieldName.indexOf("latitude") !== -1) {
                return faker.address.latitude()
            }
            if (fieldName.indexOf("longitude") !== -1) {
                return faker.address.longitude()
            }

            return 9123
        } else if ("bool" == type || "boolean" == type) {
            return false
        }
        return fake
    },

    generateFakeDate: function (id) {
        return faker.date.past()
    }
};

