const { loadFile, writeToFile } = require("./utils");

const json = (messages, filename) => {
    let data = JSON.stringify(messages, null, 4);

    writeToFile(data, filename + ".json");
}

const html = (messages, filename) => {
    const Handlebars = require("handlebars");
    const path = require("path");
    const _ = require("underscore");

    let templateObj = {
        "messages": messages,
        "timestamp": new Date().toLocaleString()
    };

    let severityDist = _.countBy(messages, "severity");

    templateObj.messageCount = messages.length;
    templateObj.errorCount = severityDist.error || 0;
    templateObj.warnCount = severityDist.warn || 0;
    templateObj.infoCount = severityDist.info || 0;
    templateObj.hintCount = severityDist.hint || 0;

    let htmlStr = loadFile(path.join(__dirname, "/templates/template.html"));

    // https://stackoverflow.com/a/22103990
    Handlebars.registerHelper("inc", (val) => {
        return parseInt(val) + 1;
    });

    let template = Handlebars.compile(htmlStr);
    let data = template(templateObj);

    writeToFile(data, filename + ".html");
}

const csv = (messages, filename) => {
    let data = "line,severity,code,message,path\n";

    messages.forEach(o => {
        data += o.line + "," + o.severity + "," + o.code + "," + o.message + "," + o.path + "\n";
    });

    writeToFile(data, filename + ".csv");
}

module.exports = {
    json,
    html,
    csv
}
