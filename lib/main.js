const { fileExists, formatJSON } = require("./utils");
const { lint } = require("./linter");
const { generateReport } = require("./report");
const {
  bundleAndLoadRuleset,
} = require("@stoplight/spectral-ruleset-bundler/with-loader");
const path = require("path");
const fs = require("fs");

exports.main = ({ specPath, rulesetPath, reportName, reportFormat }) => {
  if (!fileExists(specPath)) {
    throw Error(`Unable to resolve ${specPath}`);
  }

  if (rulesetPath && !fileExists(rulesetPath)) {
    throw Error(`Unable to resolve ${rulesetPath}`);
  }

  if (rulesetPath) {
    const bundle = bundleAndLoadRuleset(path.resolve(rulesetPath), {
      fs,
      fetch,
    });
    bundle.then((customRuleSet) => {
      const linter = lint(specPath, customRuleSet);
      const lines = linter ? linter.lines : [];

      if (linter) {
        linter.results.then((results) => {
          generateReport(formatJSON(results), reportName, reportFormat, lines);
        });
      }
    });
  } else {
    const linter = lint(specPath);
    const lines = linter ? linter.lines : [];

    if (linter) {
      linter.results.then((results) => {
        generateReport(formatJSON(results), reportName, reportFormat, lines);
      });
    }
  }
};
