const path = require("path");
const { loadFile } = require("./utils");
const { Spectral, isOpenApiv2, isOpenApiv3 } = require("@stoplight/spectral");

const linter = (specPath, rulesPath, filename, callback) => {
    const spectral = new Spectral();

    spectral.registerFormat("oas2", isOpenApiv2);
    spectral.registerFormat("oas3", isOpenApiv3);

    let spec = loadFile(specPath);
    let ruleset = rulesPath ? path.join(rulesPath) : "spectral:oas";

    spectral.loadRuleset(ruleset)
        .then(() => spectral.run(spec))
        .then((results) => {
            callback(results, filename);
        });
}

module.exports = {
    linter
}

