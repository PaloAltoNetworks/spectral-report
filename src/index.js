const { Command, Option } = require("commander");
const { version } = require("../package.json");
const { exists } = require("./utils");
const { lint } = require("./linter");
const { json, html, csv } = require("./report");

const program = new Command();

program.version(version, "-v, --version", "output the current version");

program.name("spectral-report")
    .usage("-s \"path-to-spec-file\" [-r \"path-to-rule-file\"] [-n \"report-name\"] [-f \"report-format\"]")
    .requiredOption("-s, --spec <openapi spec>", "path to openapi specification")
    .addOption(new Option("-r, --ruleset <rule file>", "path to rules file"))
    .addOption(new Option("-n, --name <report name>", "report name").
        default("spectral-report"))
    .addOption(new Option("-f, --format <format>", "report format")
        .choices(["json", "html", "csv"])
        .default("json", "json"));

program.parse(process.argv);

const options = program.opts();
const { spec, ruleset, name, format } = options;

if (!exists(spec)) {
    throw Error(`Unable to resolve ${spec}`);
};

if (ruleset && !exists(ruleset)) {
    throw Error(`Unable to resolve ${ruleset}`);
};

switch (format) {
    case "html":
        lint(spec, ruleset, name, html);
        break;
    case "csv":
        lint(spec, ruleset, name, csv);
        break;
    default:
        lint(spec, ruleset, name, json);
        break;
}
