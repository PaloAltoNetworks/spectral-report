const { exists, formatJSON } = require("./utils");
const { lint } = require("./linter");
const { json, html, csv } = require("./report");

exports.main = ({
    specPath,
    rulesetPath,
    reportName,
    reportFormat }) => {

    if (!exists(specPath)) {
        throw Error(`Unable to resolve ${specPath}`);
    };

    if (rulesetPath && !exists(rulesetPath)) {
        throw Error(`Unable to resolve ${rulesetPath}`);
    };

    const report = reportFormat === "html" ? html : reportFormat === "csv" ? csv : json;

    lint(specPath, rulesetPath).then(
        results => {
            results = formatJSON(results);
            report(results, reportName);
        }
    );
}
