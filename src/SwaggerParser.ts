import {isNullOrUndefined} from "util";
import faker = require('faker');

/**
 * Created by daniel on 21.03.2017.
 */

export class SwaggerParser {
    endpoints: [SwaggerEndpoint]
    models: [SwaggerModel]
    json: string

    constructor(json: string) {
        let self = this
        this.json = json
        this.endpoints = new Array()
        this.models = new Array()

        Object.getOwnPropertyNames(json["paths"]).forEach(
            function (val, idx, array) {
                self.endpoints.push(new SwaggerEndpoint(val, json["paths"][val]))
            }
        );

        Object.getOwnPropertyNames(json["definitions"]).forEach(
            function (val, idx, array) {
                self.models.push(new SwaggerModel(val, json["definitions"][val]))
            }
        );
    }

    getModelByName(name: string) {
        for (let model of this.models) {
            // console.log(model)
            // console.log("getModelByName")
            // console.log(name)
            if(model.originalModelName == name) {


                let m = new SwaggerModel(name, this.json["definitions"][name])
                // console.log(m)
                return m
            }
        }
    }
}


export class SwaggerModel {

    originalModelName: string
    requiredList: [string]
    properties: {}
    // type: FieldType
    type: string


    constructor(name: string, content: any) {
        this.originalModelName = name

        let self = this
        // this.requiredList = new Array()
        this.properties = content['properties']
        let temp = content['properties']

        if(!isNullOrUndefined(temp)) {
            let keys = Object.keys(temp);
            for (let key of keys) {
                self.prepare(key, temp[key])
            }
        }
        this.log(this.properties)
    }

    prepare(key: string, value: any) {
        // this.log(value)

        let format = value['format']
        let typeStr = value['type']
        switch(typeStr) {
            case "array": {
                if(isNullOrUndefined(value['items'])) {
                    this.log("ERROR! ref \n")
                } else {
                    if(isNullOrUndefined(value['items'].$ref)) {
                        this.type = "[" + value['items']['type'] + "]"
                    } else {
                        this.type = "[" + this.getModelName(value['items'].$ref) + "]"
                    }
                }
                break;
            }
            case "string": {
                this.type = "string" //FieldType.String
                break;
            }
            case "integer": {
                this.type = "integer" //FieldType.Integer
                break;
            }
            case "number": {
                this.type = "number" //FieldType.Number
                break;
            }
            case "boolean": {
                this.type = "boolean" // FieldType.Boolean
                break;
            }
        }
        if(isNullOrUndefined(format)) {
            this.properties[key] = {'type': this.type}
        } else {
            this.properties[key] = {'type': this.type, 'format': format}
        }
    }

    getModelName(ref: string) {
        return ref.replace("#/definitions/", "")
    }

    log(msg: any) {
        // console.log(msg)
    }
}


export class SwaggerEndpoint {
    endpointName: string;
    methods: [string];
    responsesCode: [number];
    responseType: ResponseType
    modelName: string

    constructor(endpointName: string, content: any) {
        this.endpointName = endpointName;
        this.methods = Object.keys(content);
        this.responsesCode = new Array();

        this.log("\n" + endpointName)
        for (let method of this.methods) {
            let t = content[method]
            let responses = Object.keys(t["responses"]);
            for (let resp of responses) {
                this.responsesCode.push(resp)

                let obj = t["responses"][resp]

                let description = obj['description']
                if (description == "OK") {
                    let schema = obj['schema']
                    this.responseType = ResponseType.Object

                    if(!isNullOrUndefined(schema)) {
                        if(schema['type'] == undefined) {
                            let ref = schema["$ref"]
                            this.modelName = this.getModelName(ref)
                        } else {
                            let type = schema['type']
                            let ref = schema["items"].$ref

                            this.responseType = ResponseType.Array

                            if(!isNullOrUndefined(ref)) {
                                this.modelName = this.getModelName(ref)
                            } else {
                                this.modelName = schema["items"].type
                            }
                        }
                        this.log(this.methods)
                        this.log(this.responsesCode)
                        this.log(this.responseType)
                        this.log(this.modelName)
                    }
                }
            }
        }
        this.log("\n")
    }

    getModelName(ref: string) {
        return ref.replace("#/definitions/", "")
    }

    log(msg: any) {
        // console.log(msg)
    }
}


enum ResponseType {
    Array = "array",
    Object = "object"
};


enum FieldType {
    Array = "array",
    Object = "object",
    String = "string",
    Integer = "integer",
    Number = "number",
    Boolean = "boolean"
};


export class ServerGenerator {
    swaggerParser: SwaggerParser
    endpoints: [SwaggerEndpoint]

    constructor(endpoints: [SwaggerEndpoint], swaggerParser: SwaggerParser) {
        this.swaggerParser = swaggerParser
        this.endpoints = endpoints

        var serverContent = ""
        var self = this
        for (let endpoint of this.endpoints) {
            let content = this.generateEndpointCode(endpoint)
            serverContent = serverContent + content
            // this.log(content)
        }
    }

    generateEndpointCode(endpoint: SwaggerEndpoint) {
        if(endpoint.responseType == ResponseType.Object) {
            let modelName = endpoint.modelName
            let method = endpoint.methods[0]


            let model = this.swaggerParser.getModelByName(modelName)
            var endpointName = endpoint.endpointName.replace("{", ":")
            endpointName = endpointName.replace("}", "")

            let res = ""

            if(isNullOrUndefined(model)) {
                return
            } else {
                let fakeModel = this.generateFakeModel(1, model)

                let content = "\n" + "server." + method + "('" + endpointName + "', function (req, res) {\n" +
                    "\tres.status(" + 200 + ").send(\n\t" + res + "\n)\n})"

                // this.log("\n")
                // this.log(endpointName)

                return content
            }
        } else {

        }
    }

    paginationObj() {
        return {
            "first": "false",
            "last": "false",
            "number": 10,
            "numberOfElements": 10,
            "size": 100,
            "totalElements": 20,
            "totalPages": 10
        }
    }

    // generateFakeModel(id, model) {
    //     var temp = clone(model)
    //
    //     var fields = Object.keys(model)
    //     for(i in fields) {
    //         var fieldName = fields[i]
    //         var type = temp[fieldName]
    //         var fake = generateFakeByType(id, type, fieldName)
    //         if(fake != undefined) {
    //             temp[fieldName] = fake
    //         }
    //     }
    //     return temp
    // }

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

        // for(var field in fields) {
        // var fieldName = fields[i]
        // var type = temp[fieldName]
        // var fake = generateFakeByType(id, type, fieldName)
        // if(fake != undefined) {
        //     model[fieldName] = fake
        // }
        // }
    }

    generateFakeDate(id: number) {
        return faker.date.past()
    }

    log(msg: any) {
        console.log(msg)
    }
}