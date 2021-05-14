const { lint } = require("../lib/linter");
const { loadFile } = require("../lib/utils");
const { Spectral } = require("@stoplight/spectral");
const path = require("path");

jest.mock("@stoplight/spectral", () => {
    return {
        Spectral: jest.fn().mockImplementation(() => {
            return {
                registerFormat: jest.fn((param, fn) => { }),
                loadRuleset: jest.fn((param) => { return Promise.resolve(() => { }) }),
                run: jest.fn((param) => { return Promise.resolve(() => { return []; }) })
            }
        })
    };
});

jest.mock("../lib/utils.js", () => {
    return {
        loadFile: jest.fn((path) => {
            return "";
        })
    };
});

afterEach(() => {
    // jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("linter", () => {
    it("lint() - without ruleset", async () => {
        const spectral = new Spectral();

        await lint("/fake/spec/path");

        expect(Spectral).toHaveBeenCalled();

        // TODO: Fix the test cases

        // expect(spectral.registerFormat).toHaveBeenCalled();

        // await expect(spectral.loadRuleset.mock.results[0]).resolves;
        // expect(spectral.loadRuleset).toHaveBeenCalled();

        // await expect(spectral.run.mocks.results[0]).resolves;
        // expect(spectral.run).toHaveBeenCalled();

        expect(loadFile).toHaveBeenCalled();
    });

    it("lint() - with ruleset", async () => {
        const spectral = new Spectral();

        await lint("/fake/spec/path", "/fake/rules/path");

        expect(Spectral).toHaveBeenCalled();
        // TODO: Fix the test cases

        // expect(spectral.registerFormat).toHaveBeenCalled();

        // await expect(spectral.loadRuleset.mock.results[0]).resolves;
        // expect(spectral.loadRuleset).toHaveBeenCalled();

        // await expect(spectral.run.mocks.results[0]).resolves;
        // expect(spectral.run).toHaveBeenCalled();
        expect(loadFile).toHaveBeenCalled();
    });
});