const { loadFile, writeToFile } = require("./utils");
const Handlebars = require("handlebars");
const path = require("path");
const _ = require("underscore");
const range = require("lodash/range");

const generateJSONReport = (messages, filename) => {
  let data = JSON.stringify(messages, null, 4);

  writeToFile(data, filename + ".json");
};

const generateHTMLReport = (messages, filename, lines) => {
  messages.map((message) => {
    const lineNo = parseInt(message.line.split(":")[0]);
    const start = lineNo >= 15 ? lineNo - 15 : 0;
    const end = lineNo + 15;
    const lineRangeArray = range(start + 1, end + 1);
    const codeSnippetArray = lines.slice(start, end);
    // const codeSnippetMap = () => {
    //   let snippets = [];
    // htmlCodeSnippet = () => {
    //   return `<pre>` +
    let snippets = [];
    lineRangeArray.forEach((line, index) => {
      const code = codeSnippetArray[index];
      const className = line === lineNo ? "report__code--highlight" : "";
      obj = { line: line, code: code, class: className };
      snippets.push(obj);
    });

    const codeSnippet = lines.slice(start, end).join("\n");
    message.snippet = codeSnippet;
    message.snippets = snippets;
    if (message.code.includes("owasp")) {
      message.type = "OWASP";
    } else {
      message.type = "DEFAULT";
    }
  });
  let jsonObj = {
    messages: messages,
    timestamp: new Date().toLocaleString(),
  };
  let owaspMessages = messages.filter((message) => {
    return message.type === "OWASP";
  });

  let severityDist = _.countBy(messages, "severity");
  let owaspSeverityDist = _.countBy(owaspMessages, "severity");

  jsonObj.messageCount = messages.length;
  jsonObj.errorCount = severityDist.error || 0;
  jsonObj.warnCount = severityDist.warn || 0;
  jsonObj.infoCount = severityDist.info || 0;
  jsonObj.hintCount = severityDist.hint || 0;

  // OWASP counts
  jsonObj.owaspMessageCount = owaspMessages.length;
  jsonObj.owaspErrorCount = owaspSeverityDist.error || 0;
  jsonObj.owaspWarnCount = owaspSeverityDist.warn || 0;
  jsonObj.owaspInfoCount = owaspSeverityDist.info || 0;
  jsonObj.owaspHintCount = owaspSeverityDist.hint || 0;

  let htmlStr = loadFile(path.join(__dirname, "/templates/template.html"));

  // https://stackoverflow.com/a/22103990
  Handlebars.registerHelper("inc", (val) => {
    return parseInt(val) + 1;
  });

  Handlebars.registerHelper("ifEquals", function (arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  });

  Handlebars.registerHelper("json", function (context) {
    return JSON.stringify(context);
  });

  let template = Handlebars.compile(htmlStr);
  let data = template(jsonObj);

  writeToFile(data, filename + ".html");
};

const generateCSVReport = (messages, filename) => {
  let data = "line,severity,code,message,path\n";

  messages.forEach((o) => {
    data +=
      o.line +
      "," +
      o.severity +
      "," +
      o.code +
      "," +
      o.message +
      "," +
      o.path +
      "\n";
  });

  writeToFile(data, filename + ".csv");
};

exports.generateReport = (messages, filename, format, lines) => {
  switch (format.toLowerCase()) {
    case "html":
      generateHTMLReport(messages, filename, lines);
      break;
    case "csv":
      generateCSVReport(messages, filename);
      break;
    default:
      generateJSONReport(messages, filename);
      break;
  }
};
