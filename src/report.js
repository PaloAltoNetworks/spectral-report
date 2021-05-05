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
    // writeToFile(data, filename + ".csv");
    console.log("csv report coming soon");
}

module.exports = {
    json,
    html,
    csv
}
