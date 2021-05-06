const path = require("path");
const fs = require("fs");

const exists = (filepath) => {
    return fs.existsSync(path.join(filepath));
}

const loadFile = (filepath) => {
    return fs.readFileSync(path.join(filepath), { encoding: "utf8" });
}

const writeToFile = (data, filename) => {
    fs.writeFileSync(path.join(filename), data, { encoding: "utf8" });
}

const filterJson = (obj) => {
    let filteredObj = [];
    obj.forEach(o => {
        let newObj = {};
        newObj.line = (o.range.start.line + 1) + ":" + (o.range.start.character + 1);
        newObj.severity = o.severity;
        newObj.code = o.code;
        newObj.message = o.message;
        newObj.path = o.path.join(".");

        filteredObj.push(newObj);
    });
    return filteredObj;
}

module.exports = {
    exists,
    loadFile,
    writeToFile,
    filterJson
};
