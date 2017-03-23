/**
 * Created by daniel on 22.03.2017.
 */

import {isNullOrUndefined} from "util";
import faker = require('faker');
import {SwaggerModel, SwaggerParser} from "./SwaggerParser";


export class ServerFaker {


    generateObjectStringMethod(model: SwaggerModel, params: any) {
        let properties = model.properties
        var id = 9999

        console.log(params)
        if(!isNullOrUndefined(params.id)) {
            id = Number(params.id)
        }

        var fields = Object.keys(properties)
        var copy = this.clone(properties)
        for (var i in fields) {
            var fieldName = fields[i]
            var type = copy[fieldName].type
             var fake = this.generateFakeByType(id, type, fieldName)
            if (fake != undefined) {
                copy[fieldName] = fake
            }
        }

        this.log(copy)
        return copy
    }

    generateArrayStringMethod(model: SwaggerModel, params: any) {
        let properties = model.properties

        var page = 0
        var size = 10
        if(!isNullOrUndefined(params['page'])) {
            page = Number(params['page'])
        }
        if(!isNullOrUndefined(params['size'])) {
            size = Number(params['size'])
        }

        var start: number = (size * page) + 1
        var list = new Array()
        var fields = Object.keys(properties)

        for(var idx=start; idx<(size+start); idx++) {
            var copy = this.clone(properties)
            for (var i in fields) {
                var fieldName = fields[i]
                var type = copy[fieldName].type

                var fake = this.generateFakeByType(idx, type, fieldName)
                if (fake != undefined) {
                    copy[fieldName] = fake
                }
            }
            list.push(copy)
        }

        var isLast = false
        if(page >= 5) {
            isLast = true
            list = []
        }

        let response = {
            "contents": list,
            'isLast': isLast,
            'page': page + 1,
            'size': size
        }

        // this.log(response)
        return response
    }

    clone(obj) {
        var clone = {};
        for (var property in obj) clone[property] = obj[property];
        return clone;
    }

    generateFakeByType(id: number, type: string, fieldName: string) {
        var fake = undefined

        if("string" == type) {
            if(fieldName.indexOf("name") !== -1) {
                return faker.name.title()
            }
            if(fieldName.indexOf("image") !== -1) {
                return "https://source.unsplash.com/collection/102"+Number(id)+"/100x100"
            }
            if(fieldName.indexOf("date") !== -1 || fieldName.indexOf("Date") !== -1) {
                return this.generateFakeDate(id)
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
            if(fieldName.indexOf("id") !== -1 || fieldName.indexOf("Id") !== -1) {
                return id
            }

            return 9123
        }  else if("bool" == type) {
            return false
        }

        return fake
    }

    generateFakeModel(id: number, model: SwaggerModel) {
        // var fields = Object.keys(model)
        let self = this

        Object.getOwnPropertyNames(model.properties).forEach(
            function (val, idx, array) {
                var type = model['type']
                var fake = self.generateFakeByType(id, type, val)
                if (fake != undefined) {
                    model.properties[val] = fake
                }
            }
        );

        this.log("\n\n")
        this.log(model.properties)
    }

    generateFakeDate(id: number) {
        return faker.date.past()
    }

    log(msg: any) {
        // console.log(msg)
    }
}