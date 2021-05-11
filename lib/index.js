#!/usr/bin/env node

const { argumentParser } = require("./argumentParser");
const { main } = require("./main");

const {
    specPath,
    rulesetPath,
    reportName,
    reportFormat
} = argumentParser();

main({
    specPath,
    rulesetPath,
    reportName,
    reportFormat
});
