const path = require("path");
const { loadFile } = require("./utils");
const { Spectral, isOpenApiv2, isOpenApiv3 } = require("@stoplight/spectral");

exports.lint = (specPath, rulesPath) => {
    const spectral = new Spectral();

    spectral.registerFormat("oas2", isOpenApiv2);
    spectral.registerFormat("oas3", isOpenApiv3);

    let spec = loadFile(specPath);
    let ruleset = rulesPath ? path.resolve(rulesPath) : "spectral:oas";

    return (spectral.loadRuleset(ruleset)
        .then(() => spectral.run(spec)));
}
