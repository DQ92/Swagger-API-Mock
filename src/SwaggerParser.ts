import {isNullOrUndefined} from "util";
/**
 * Created by daniel on 21.03.2017.
 */

export class SwaggerParser {

    constructor(json: string) {
        // console.log(json)

        var endpoints = json["paths"];
        // console.log(endpoints);

        Object.getOwnPropertyNames(endpoints).forEach(
            function (val, idx, array) {
                new SwaggerEndpoint(val, endpoints[val]);
            }
        );

        // var models = json["definitions"]
        // console.log(models)
    //
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
        console.log(msg)
    }
}

enum ResponseType {
    Array = "array",
    Object = "object"
};

