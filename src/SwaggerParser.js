"use strict";
var util_1 = require("util");
var faker = require('faker');
var ServerFaker_1 = require("./ServerFaker");
var SwaggerParser = (function () {
    function SwaggerParser(json) {
        var self = this;
        this.json = json;
        this.endpoints = new Array();
        this.models = new Array();
        Object.getOwnPropertyNames(json["paths"]).forEach(function (val, idx, array) {
            self.endpoints.push(new SwaggerEndpoint(val, json["paths"][val]));
        });
        Object.getOwnPropertyNames(json["definitions"]).forEach(function (val, idx, array) {
            self.models.push(new SwaggerModel(val, json["definitions"][val]));
        });
    }
    SwaggerParser.prototype.getModelByName = function (name) {
        return this.json["definitions"][name];
    };
    SwaggerParser.prototype.getModelByNameWithInner = function (name) {
        var model = this.json["definitions"][name];
        var self = this;
        Object.getOwnPropertyNames(model.properties).forEach(function (val, idx, array) {
            var type = model['properties'][val].type;
            if (type[0] == '[') {
                if (type != '[string]' && type != '[number]') {
                    var objName = type.replace("]", "");
                    objName = objName.replace("[", "");
                    var modelFromDef = self.getModelByNameWithInner(objName)['properties'];
                    model['properties'][val] = [];
                    model['properties'][val].push(modelFromDef);
                }
            }
        });
        return model;
    };
    return SwaggerParser;
}());
exports.SwaggerParser = SwaggerParser;
var SwaggerModel = (function () {
    function SwaggerModel(name, content) {
        this.originalModelName = name;
        var self = this;
        this.properties = content['properties'];
        var temp = content['properties'];
        if (!util_1.isNullOrUndefined(temp)) {
            var keys = Object.keys(temp);
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                self.prepare(key, temp[key]);
            }
        }
        this.log("\n\n\n\n");
        this.log(name);
        this.log(this.properties);
    }
    SwaggerModel.prototype.prepare = function (key, value) {
        var format = value['format'];
        var typeStr = value['type'];
        switch (typeStr) {
            case "array": {
                if (util_1.isNullOrUndefined(value['items'])) {
                    this.log("ERROR! ref \n");
                }
                else {
                    if (util_1.isNullOrUndefined(value['items'].$ref)) {
                        this.type = "[" + value['items']['type'] + "]";
                    }
                    else {
                        this.type = "[" + this.getModelName(value['items'].$ref) + "]";
                    }
                }
                break;
            }
            case "string": {
                this.type = "string";
                break;
            }
            case "integer": {
                this.type = "integer";
                break;
            }
            case "number": {
                this.type = "number";
                break;
            }
            case "boolean": {
                this.type = "boolean";
                break;
            }
        }
        if (util_1.isNullOrUndefined(format)) {
            this.properties[key] = { 'type': this.type };
        }
        else {
            this.properties[key] = { 'type': this.type, 'format': format };
        }
    };
    SwaggerModel.prototype.getModelName = function (ref) {
        return ref.replace("#/definitions/", "");
    };
    SwaggerModel.prototype.log = function (msg) {
    };
    return SwaggerModel;
}());
exports.SwaggerModel = SwaggerModel;
var SwaggerEndpoint = (function () {
    function SwaggerEndpoint(endpointName, content) {
        this.endpointName = endpointName;
        this.methods = Object.keys(content);
        this.responsesCode = new Array();
        this.log("\n" + endpointName);
        for (var _i = 0, _a = this.methods; _i < _a.length; _i++) {
            var method = _a[_i];
            var t = content[method];
            var responses = Object.keys(t["responses"]);
            for (var _b = 0, responses_1 = responses; _b < responses_1.length; _b++) {
                var resp = responses_1[_b];
                this.responsesCode.push(resp);
                var obj = t["responses"][resp];
                var description = obj['description'];
                if (description == "OK") {
                    var schema = obj['schema'];
                    this.responseType = ResponseType.Object;
                    if (!util_1.isNullOrUndefined(schema)) {
                        if (schema['type'] == undefined) {
                            var ref = schema["$ref"];
                            this.modelName = this.getModelName(ref);
                        }
                        else {
                            var type = schema['type'];
                            var ref = schema["items"].$ref;
                            this.responseType = ResponseType.Array;
                            if (!util_1.isNullOrUndefined(ref)) {
                                this.modelName = this.getModelName(ref);
                            }
                            else {
                                this.modelName = schema["items"].type;
                            }
                        }
                        this.log(this.methods);
                        this.log(this.responsesCode);
                        this.log(this.responseType);
                        this.log(this.modelName);
                    }
                }
            }
        }
        this.log("\n");
    }
    SwaggerEndpoint.prototype.getModelName = function (ref) {
        return ref.replace("#/definitions/", "");
    };
    SwaggerEndpoint.prototype.log = function (msg) {
    };
    return SwaggerEndpoint;
}());
exports.SwaggerEndpoint = SwaggerEndpoint;
var ResponseType;
(function (ResponseType) {
    ResponseType[ResponseType["Array"] = "array"] = "Array";
    ResponseType[ResponseType["Object"] = "object"] = "Object";
})(ResponseType || (ResponseType = {}));
;
var FieldType;
(function (FieldType) {
    FieldType[FieldType["Array"] = "array"] = "Array";
    FieldType[FieldType["Object"] = "object"] = "Object";
    FieldType[FieldType["String"] = "string"] = "String";
    FieldType[FieldType["Integer"] = "integer"] = "Integer";
    FieldType[FieldType["Number"] = "number"] = "Number";
    FieldType[FieldType["Boolean"] = "boolean"] = "Boolean";
})(FieldType || (FieldType = {}));
;
var ServerGenerator = (function () {
    function ServerGenerator(endpoints, swaggerParser) {
        this.s = new ServerFaker_1.ServerFaker();
        this.swaggerParser = swaggerParser;
        this.endpoints = endpoints;
        this.serverContent =
            "import jsonServer = require('json-server');\n" +
                "import {ServerFaker} from './src/ServerFaker';\n" +
                "var server = jsonServer.create()\n" +
                "server.listen(3001, function () {console.log('OMNIA JSON Server is running!')})\n\n\n" +
                "let s = new ServerFaker() \n\n";
        var self = this;
        for (var _i = 0, _a = this.endpoints; _i < _a.length; _i++) {
            var endpoint = _a[_i];
            if (endpoint.endpointName == '/omnia/news') {
                var content = this.generateEndpointCode(endpoint);
                this.serverContent = this.serverContent + content;
            }
        }
    }
    ServerGenerator.prototype.generateEndpointCode = function (endpoint) {
        var modelName = endpoint.modelName;
        var method = endpoint.methods[0];
        var model = this.swaggerParser.getModelByName(modelName);
        if (util_1.isNullOrUndefined(model)) {
            this.log("\n ERROR! Model undefined!  Dla " + endpoint.endpointName);
            return "";
        }
        if (endpoint.responseType == ResponseType.Object) {
            var endpointName = endpoint.endpointName.replace("{", ":");
            endpointName = endpointName.replace("}", "");
            var properties = model['properties'];
            var self_1 = this;
            var res_1 = "";
            Object.getOwnPropertyNames(properties).forEach(function (val, idx, array) {
                var type = model['properties'][val].type;
                if (type[0] == '[') {
                    if (type != '[string]' && type != '[number]') {
                        var objName = type.replace("]", "");
                        objName = objName.replace("[", "");
                        var modelFromDef = self_1.swaggerParser.getModelByNameWithInner(objName)['properties'];
                        model['properties'][val] = [];
                        model['properties'][val].push(modelFromDef);
                    }
                }
            });
            var modelToString = model;
            var str = JSON.stringify(modelToString);
            this.log("\n\n\n\n");
            res_1 = "s.generateObjectStringMethod(" + str + ", req.params)";
            var content = "\n\n" + "server." + method + "('" + endpointName + "', function (req, res) {\n" +
                "\tres.status(" + 200 + ").send(\n\t" + res_1 + "\n)})";
            return content;
        }
        else {
            var modelName_1 = endpoint.modelName;
            var method_1 = endpoint.methods[0];
            var model_1 = this.swaggerParser.getModelByName(modelName_1);
            var endpointName = endpoint.endpointName.replace("{", ":");
            endpointName = endpointName.replace("}", "");
            var res = "";
            res = "s.generateArrayStringMethod(" + JSON.stringify(model_1) + ", req.query)";
            var content = "\n\n" + "server." + method_1 + "('" + endpointName + "', function (req, res) {\n" +
                "\tres.status(" + 200 + ").send(\n\t" + res + "\n)})";
            return content;
        }
    };
    ServerGenerator.prototype.paginationObj = function () {
        return {
            "first": "false",
            "last": "false",
            "number": 10,
            "numberOfElements": 10,
            "size": 100,
            "totalElements": 20,
            "totalPages": 10
        };
    };
    ServerGenerator.prototype.generateFakeByType = function (id, type, fieldName) {
        var fake = undefined;
        if ("string" == type) {
            if (fieldName.indexOf("name") !== -1) {
                return faker.name.title();
            }
            if (fieldName.indexOf("image") !== -1) {
                return "https://source.unsplash.com/collection/102" + Number(id) + "/100x100";
            }
            if (fieldName.indexOf("date") !== -1 || fieldName.indexOf("Date") !== -1) {
                return this.generateFakeDate(id);
            }
            if (fieldName.indexOf("email") !== -1) {
                return faker.internet.email();
            }
            if (fieldName.indexOf("address") !== -1) {
                return faker.address.streetName() + ", " + faker.address.city();
            }
            if (fieldName.indexOf("city") !== -1) {
                return faker.address.city();
            }
            if (fieldName.indexOf("phone") !== -1) {
                return faker.phone.phoneNumber();
            }
            if (fieldName.indexOf("latitude") !== -1) {
                return faker.address.latitude();
            }
            if (fieldName.indexOf("longitude") !== -1) {
                return faker.address.longitude();
            }
            if (fieldName.indexOf("lead") !== -1) {
                return faker.lorem.text();
            }
            if (fieldName.indexOf("description") !== -1) {
                return faker.lorem.text();
            }
            if (fieldName.indexOf("url") !== -1 || fieldName.indexOf("Url") !== -1) {
                return faker.internet.url();
            }
            return faker.lorem.words();
        }
        else if ("integer" == type) {
            if (fieldName.indexOf("id") !== -1 || fieldName.indexOf("Id") !== -1) {
                return id;
            }
            return 8765;
        }
        else if ("number" == type) {
            if (fieldName.indexOf("latitude") !== -1) {
                return faker.address.latitude();
            }
            if (fieldName.indexOf("longitude") !== -1) {
                return faker.address.longitude();
            }
            return 9123;
        }
        else if ("bool" == type) {
            return false;
        }
        return fake;
    };
    ServerGenerator.prototype.generateFakeModel = function (id, model) {
        var self = this;
        Object.getOwnPropertyNames(model.properties).forEach(function (val, idx, array) {
            var type = model['type'];
            var fake = self.generateFakeByType(id, type, val);
            if (fake != undefined) {
                model.properties[val] = fake;
            }
        });
    };
    ServerGenerator.prototype.generateFakeDate = function (id) {
        return faker.date.past();
    };
    ServerGenerator.prototype.log = function (msg) {
        console.log(msg);
    };
    return ServerGenerator;
}());
exports.ServerGenerator = ServerGenerator;
