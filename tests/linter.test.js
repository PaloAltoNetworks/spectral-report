const { lint } = require("../lib/linter");
const { loadFile } = require("../lib/utils");
const { Spectral } = require("@stoplight/spectral");
const path = require("path");

jest.mock("../lib/utils.js", () => {
    return {
        loadFile: jest.fn((path) => {
            return "";
        })
    };
});

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("linter", () => {
    it("lint() - without ruleset", async () => {
        const spectral = new Spectral();

        let spyRegisterFormat = jest.spyOn(spectral, "registerFormat");
        // spyRegisterFormat.mockImplementation((param, fn) => { });

        let spyLoadRuleset = jest.spyOn(spectral, "loadRuleset");
        // spyLoadRuleset.mockImplementation((ruleset) => {
        //     return Promise.resolve(() => { });
        // });

        let spyRun = jest.spyOn(spectral, "run");
        // spyRun.mockImplementation((spec) => {
        //     return Promise.resolve(() => { });
        // });

        let spyPath = jest.spyOn(path, "resolve");
        spyPath.mockImplementation((path) => { return ""; });

        await lint("/fake/spec/path");
        expect(spectral.registerFormat).toHaveBeenCalled();
        expect(loadFile).toHaveBeenCalled();
        // await expect(spyLoadRuleset.mock.results[0]).resolves;
        // expect(spyPath).not.toHaveBeenCalled();
        // expect(spyRun).toHaveBeenCalled();

    });
});