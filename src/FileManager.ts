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
}
