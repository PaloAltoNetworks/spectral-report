const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");
const { loadFile, splitLines } = require("./utils");
const { oas } = require("@stoplight/spectral-rulesets");
const owasp = require("@stoplight/spectral-owasp-ruleset");
const { Spectral } = require("@stoplight/spectral-core");
const {
  bundleAndLoadRuleset,
} = require("@stoplight/spectral-ruleset-bundler/with-loader");

exports.lint = (specPath, customRuleSet) => {
  const spectral = new Spectral();
  let spec = loadFile(specPath);
  let lines = splitLines(specPath);
  let results;

  if (customRuleSet) {
    spectral.setRuleset(customRuleSet);
    results = { results: spectral.run(spec), lines: lines };
    return results;
  } else {
    const defaultRules = {
      extends: [oas, owasp],
    };
    spectral.setRuleset(defaultRules);
    results = { results: spectral.run(spec), lines: lines };
    return results;
  }
};
