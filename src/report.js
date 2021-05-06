const Handlebars = require("handlebars");
const path = require("path");
const { loadFile, writeToFile } = require("./utils");

const json = (messages, filename) => {
    let data = JSON.stringify(messages, null, 4);

    writeToFile(data, filename + ".json");
}

const html = (messages, filename) => {
    let htmlStr = loadFile(path.join(__dirname, "/templates/template.html"));

    // https://stackoverflow.com/a/22103990
    Handlebars.registerHelper("inc", (val) => {
        return parseInt(val) + 1;
    });

    let template = Handlebars.compile(htmlStr);
    let data = template(messages);

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
