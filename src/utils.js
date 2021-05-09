const { DiagnosticSeverity } = require("@stoplight/types");
const path = require("path");
const fs = require("fs");

const fileExists = (filepath) => {
    return fs.existsSync(path.join(filepath));
}

const loadFile = (filepath) => {
    return fs.readFileSync(path.join(filepath), { encoding: "utf8" });
}

const writeToFile = (data, filename) => {
    fs.writeFileSync(path.join(filename), data, { encoding: "utf8" });
}

const getSeverityMap = () => {
    // https://github.com/stoplightio/spectral/issues/1605#issuecomment-833868820

    const severityMap = {};

    severityMap[DiagnosticSeverity.Error] = "error";
    severityMap[DiagnosticSeverity.Warning] = "warn";
    severityMap[DiagnosticSeverity.Information] = "info";
    severityMap[DiagnosticSeverity.Hint] = "hint";

    return severityMap;
}

const formatJSON = (obj) => {
    const severityMap = getSeverityMap();

    let filteredObj = [];
    obj.forEach(o => {
        let newObj = {};
        newObj.line = (o.range.start.line + 1) + ":" + (o.range.start.character + 1);
        newObj.severity = severityMap[o.severity];
        newObj.code = o.code;
        newObj.message = o.message;
        newObj.path = o.path.join(".");

        filteredObj.push(newObj);
    });
    return filteredObj;
}

module.exports = {
    fileExists,
    loadFile,
    writeToFile,
    formatJSON
};
