///<reference path='src/node.d.ts'/>


"use strict";
import fs = require('fs');
import {FileManager} from "./src/FileManager";


// Config  //
var swaggerJSON = "j.json";
var wordsToRemove = ["Dto", "List", "View", "ListView"];

var serverJSFilename = "server.js";
var swiftEntitiesFilename = "entities.swift";


var json = JSON.parse(fs.readFileSync('j.json').toString());
console.log(json)

new FileManager("")

// function paths(json) {
//     var paths = json["paths"]
//     var endpoints = []
//     var methods = []
//
//     var list = []
//
//     for (endpoint in paths) {
//         var methods = Object.keys(paths[endpoint])
//
//         for(var i in methods) {
//             var response = ""
//             var method = methods[i]
//
//             if (paths[endpoint][method] != null) {
//                 if (paths[endpoint][method].responses["200"].schema != null) {
//                     response = paths[endpoint][method].responses["200"].schema.$ref
//                     if(response == undefined) {
//                         response = paths[endpoint][method].responses["200"].schema.items.$ref
//                     }
//                 } else {
//                     print("Błąd dla:" + endpoint)
//                 }
//             } else {
//                 print("Błąd dla :" + endpoint)
//             }
//
//             list.push({
//                 "endpoint": endpoint,
//                 "method": method,
//                 "definition": response
//             })
//         }
//     }
//     return list
// }