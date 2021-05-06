const { writeToFile } = require("./utils");

const json = (messages, filename) => {
    let data = JSON.stringify(messages, null, 4);
    writeToFile(data, filename + ".json");
}
const html = (messages, filename) => {
    // writeToFile(data, filename + ".html");
    console.log("html report coming soon");
}
const csv = (messages, filename) => {
    let data = "line,code,message,path\n";
    messages.forEach(o => {
        data += o.line + "," + o.code + "," + o.message + "," + o.path + "\n";
    });
    writeToFile(data, filename + ".csv");
}

module.exports = {
    json,
    html,
    csv
}
