const { loadFile, writeToFile } = require("./utils");
const Handlebars = require("handlebars");
const path = require("path");
const _ = require("underscore");

const generateJSONReport = (messages, filename) => {
    let data = JSON.stringify(messages, null, 4);

    writeToFile(data, filename + ".json");
}

const generateHTMLReport = (messages, filename) => {
    let jsonObj = {
        "messages": messages,
        "timestamp": new Date().toLocaleString()
    };

    let severityDist = _.countBy(messages, "severity");

    jsonObj.messageCount = messages.length;
    jsonObj.errorCount = severityDist.error || 0;
    jsonObj.warnCount = severityDist.warn || 0;
    jsonObj.infoCount = severityDist.info || 0;
    jsonObj.hintCount = severityDist.hint || 0;

    let htmlStr = loadFile(path.join(__dirname, "/templates/template.html"));

    // https://stackoverflow.com/a/22103990
    Handlebars.registerHelper("inc", (val) => {
        return parseInt(val) + 1;
    });

    let template = Handlebars.compile(htmlStr);
    let data = template(jsonObj);

    writeToFile(data, filename + ".html");
}

const generateCSVReport = (messages, filename) => {
    let data = "line,severity,code,message,path\n";

    messages.forEach(o => {
        data += o.line + "," + o.severity + "," + o.code + "," + o.message + "," + o.path + "\n";
    });

    writeToFile(data, filename + ".csv");
}

exports.generateReport = (messages, filename, format) => {
    switch (format.toLowerCase()) {
        case "html":
            generateHTMLReport(messages, filename);
            break;
        case "csv":
            generateCSVReport(messages, filename);
            break;
        default:
            generateJSONReport(messages, filename);
            break;
    }
}
