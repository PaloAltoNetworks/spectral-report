const linter = (specPath, rulesPath) => {
    const { Spectral, isOpenApiv2, isOpenApiv3 } = require("@stoplight/spectral");

    const spectral = new Spectral();

    spectral.registerFormat("oas2", isOpenApiv2);
    spectral.registerFormat("oas3", isOpenApiv3);

    console.log(specPath, rulesPath);

}

module.exports = {
    linter
}

