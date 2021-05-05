const { Command, Option } = require("commander");
const { version } = require("../package.json");
const { exists } = require("./utils");
const { linter } = require("./linter");

const program = new Command();

program.version(version, "-v, --version", "output the current version");

program.name("spectral-report")
    .usage("-s \"path-to-spec-file\" -r \"path-to-rule-file\"")
    .requiredOption("-s, --spec <openapi spec>", "path to openapi specification")
    .requiredOption("-r, --ruleset <rule file>", "path to rules file")
    .addOption(new Option("-e, --export <format>", "report format").choices(["json", "html", "csv"]));

program.parse(process.argv);

const options = program.opts();

const specPath = options.spec;
const rulesPath = options.ruleset;
const format = options.export || "json";

if (!exists(specPath)) {
    throw Error(`Unable to resolve ${specPath}`);
};

if (!exists(rulesPath)) {
    throw Error(`Unable to resolve ${rulesPath}`);
};

const messages = linter(specPath, rulesPath);

switch (format) {
    case "html":
        console.log("Export to html coming soon...");
        break;
    case "csv":
        console.log("Export to csv coming soon...");
        break;
    default:
        console.log("Export to json coming soon...");
        break;
}
