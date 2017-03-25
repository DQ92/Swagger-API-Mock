"use strict";
var fs = require('fs');
var FileManager = (function () {
    function FileManager() {
    }
    FileManager.prototype.parseJSON = function (fileName) {
        var json = JSON.parse(fs.readFileSync(fileName).toString());
        return json;
    };
    FileManager.prototype.saveFileServer = function (content) {
        var filename = "server.ts";
        fs.writeFile(filename, content, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("\n ----- The file was saved! type \"node " + filename + "\" in your console -----\n");
        });
    };
    return FileManager;
}());
exports.FileManager = FileManager;
