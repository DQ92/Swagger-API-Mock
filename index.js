"use strict";
var FileManager_1 = require("./src/FileManager");
var SwaggerParser_1 = require("./src/SwaggerParser");
var swaggerJSONFilename = "j.json";
var wordsToRemove = ["Dto", "List", "View", "ListView"];
var serverJSFilename = "server.js";
var swiftEntitiesFilename = "entities.swift";
var fileManager = new FileManager_1.FileManager();
var swaggerJSON = fileManager.parseJSON(swaggerJSONFilename);
var swaggerParser = new SwaggerParser_1.SwaggerParser(swaggerJSON);
var serverGenerator = new SwaggerParser_1.ServerGenerator(swaggerParser.endpoints, swaggerParser);
fileManager.saveFileServer(serverGenerator.serverContent);
