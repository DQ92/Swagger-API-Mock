///<reference path='src/node.d.ts'/>


"use strict";
import fs = require('fs');
import {FileManager} from "./src/FileManager";
import {ServerGenerator, SwaggerEndpoint, SwaggerParser} from "./src/SwaggerParser";


// Config  //
var swaggerJSONFilename = "j.json";
var wordsToRemove = ["Dto", "List", "View", "ListView"];

var serverJSFilename = "server.js";
var swiftEntitiesFilename = "entities.swift";


var fileManager = new FileManager();
let swaggerJSON = fileManager.parseJSON(swaggerJSONFilename);


let swaggerParser = new SwaggerParser(swaggerJSON)
let serverGenerator = new ServerGenerator(swaggerParser.endpoints, swaggerParser)


