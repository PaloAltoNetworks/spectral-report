const { fileExists, formatJSON } = require("./utils");
const { lint } = require("./linter");
const { generateReport } = require("./report");

exports.main = ({
    specPath,
    rulesetPath,
    reportName,
    reportFormat }) => {

    if (!fileExists(specPath)) {
        throw Error(`Unable to resolve ${specPath}`);
    };

    if (rulesetPath && !fileExists(rulesetPath)) {
        throw Error(`Unable to resolve ${rulesetPath}`);
    };

    lint(specPath, rulesetPath).then(
        results => {
            generateReport(formatJSON(results), reportName, reportFormat);
        }
    );
}
