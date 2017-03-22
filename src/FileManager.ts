/**
 * Created by daniel on 21.03.2017.
 */

import fs = require('fs');

export class FileManager {

    constructor() {

    }

    parseJSON(fileName: string) {
        var json = JSON.parse(fs.readFileSync(fileName).toString());
        return json
    }

    saveFileServer(content: string) {
        // console.log(content)


        var filename = "server.ts"
        fs.writeFile(filename, content, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("\n ----- The file was saved! type \"node " + filename + "\" in your console -----\n");
        });
    }

}
