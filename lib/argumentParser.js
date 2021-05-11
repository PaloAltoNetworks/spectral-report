const { Command, Option } = require("commander");
const { version } = require("../package.json");

exports.argumentParser = () => {
    const program = new Command();

    program.version(version, "-v, --version", "output the current version");

    program.name("spectral-report")
        .usage("-s \"path-to-spec-file\" [-r \"path-to-rule-file\"] [-n \"report-name\"] [-f \"report-format\"]")
        .requiredOption("-s, --specPath <openapi spec>", "path to openapi specification")
        .addOption(new Option("-r, --rulesetPath <rule file>", "path to rules file"))
        .addOption(new Option("-n, --reportName <report name>", "report name").
            default("spectral-report"))
        .addOption(new Option("-f, --reportFormat <format>", "report format")
            .choices(["json", "html", "csv"])
            .default("json", "json"));

    program.parse(process.argv);

    const options = program.opts();
    const { specPath, rulesetPath, reportName, reportFormat } = options;

    return ({
        specPath,
        rulesetPath,
        reportName,
        reportFormat
    });
}
