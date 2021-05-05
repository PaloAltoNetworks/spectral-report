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
module.exports = {
    exists,
    loadFile,
    writeToFile
};
