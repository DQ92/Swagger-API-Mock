"use strict";
var util_1 = require("util");
var faker = require('faker');
var ServerFaker = (function () {
    function ServerFaker() {
    }
    ServerFaker.prototype.generateFakeObject = function (model) {
        var self = this;
        console.log("Model");
        console.log(model);
        var fields = Object.keys(model);
        console.log(fields);
        var id = 0;
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
            var val = fields_1[_i];
            console.log(val);
            var fieldName = fields[val];
            console.log(fieldName);
            id = id + 1;
        }
        ;
        return model;
    };
    ServerFaker.prototype.generateObjectStringMethod = function (model, params) {
        var properties = model.properties;
        var id = 9999;
        var self = this;
        console.log(params);
        if (!util_1.isNullOrUndefined(params.id)) {
        }
        Object.getOwnPropertyNames(properties).forEach(function (val, idx, array) {
            console.log("\n\n val: " + val + " / " + properties[val]);
            if (!util_1.isNullOrUndefined(properties[val])) {
                console.log(model[val]);
                var fake = self.generateFakeByType(id, properties[val].type, val);
                if (fake != undefined) {
                    properties[val] = fake;
                }
            }
            else {
                var newFake = self.generateFakeObject(properties[val]);
                console.log("\n\n newFake: ");
                console.log(newFake);
            }
        });
        this.log(model);
        return model;
    };
    ServerFaker.prototype.generateArrayStringMethod = function (model, params) {
        var properties = model.properties;
        var page = 0;
        var size = 10;
        if (!util_1.isNullOrUndefined(params['page'])) {
            page = Number(params['page']);
        }
        if (!util_1.isNullOrUndefined(params['size'])) {
            size = Number(params['size']);
        }
        var start = (size * page) + 1;
        var list = new Array();
        var fields = Object.keys(properties);
        for (var idx = start; idx < (size + start); idx++) {
            var copy = this.clone(properties);
            for (var i in fields) {
                var fieldName = fields[i];
                var type = copy[fieldName].type;
                var fake = this.generateFakeByType(idx, type, fieldName);
                if (fake != undefined) {
                    copy[fieldName] = fake;
                }
            }
            list.push(copy);
        }
        var isLast = false;
        if (page >= 5) {
            isLast = true;
            list = [];
        }
        var response = {
            "contents": list,
            'isLast': isLast,
            'page': page + 1,
            'size': size
        };
        return response;
    };
    ServerFaker.prototype.clone = function (obj) {
        var clone = {};
        for (var property in obj)
            clone[property] = obj[property];
        return clone;
    };
    ServerFaker.prototype.generateFakeByType = function (id, type, fieldName) {
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
            if (fieldName.indexOf("id") !== -1 || fieldName.indexOf("Id") !== -1) {
                return id;
            }
            return 9123;
        }
        else if ("bool" == type || "boolean" == type) {
            return false;
        }
        return fake;
    };
    ServerFaker.prototype.generateFakeModel = function (id, model) {
        var self = this;
        Object.getOwnPropertyNames(model.properties).forEach(function (val, idx, array) {
            var type = model['type'];
            var fake = self.generateFakeByType(id, type, val);
            if (fake != undefined) {
                model.properties[val] = fake;
            }
        });
        this.log("\n\n");
        this.log(model.properties);
    };
    ServerFaker.prototype.generateFakeDate = function (id) {
        return faker.date.past();
    };
    ServerFaker.prototype.log = function (msg) {
    };
    return ServerFaker;
}());
exports.ServerFaker = ServerFaker;
