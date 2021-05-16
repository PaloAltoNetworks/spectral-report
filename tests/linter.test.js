const { lint } = require("../lib/linter");
const { loadFile } = require("../lib/utils");
const { Spectral } = require("@stoplight/spectral");
const path = require("path");

jest.mock("@stoplight/spectral", function () {
    return {
        Spectral: jest.fn().mockImplementation(function () {
            this.registerFormat = jest.fn().mockImplementation((param, fn) => { });
            this.loadRuleset = jest.fn().mockImplementation((param) => { return Promise.resolve(() => { }) });
            this.run = jest.fn().mockImplementation((param) => { return new Promise((resolve) => { resolve([]) }); });
            return {
                registerFormat: this.registerFormat,
                loadRuleset: this.loadRuleset,
                run: this.run
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

beforeEach(() => {
    Spectral.mockClear();
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe("linter", () => {
    it("lint() - without ruleset", async () => {
        let fakeSpecPath = "/fake/spec/path";
        let output = await lint(fakeSpecPath);

        expect(Spectral).toHaveBeenCalled();

        expect(Spectral.mock.instances[0].registerFormat).toHaveBeenCalledTimes(2);
        expect(Spectral.mock.instances[0].loadRuleset).toHaveBeenCalledTimes(1);
        expect(Spectral.mock.instances[0].loadRuleset).toHaveBeenCalledWith("spectral:oas");
        expect(Spectral.mock.instances[0].run).toHaveBeenCalledTimes(1);
        expect(Spectral.mock.instances[0].run).toHaveBeenCalledWith("");
        expect(loadFile).toHaveBeenCalled();
        expect(output).toEqual([]);
    });

    it("lint() - with ruleset", async () => {
        let fakeSpecPath = "/fake/spec/path";
        let fakeRulesPath = "/fake/rules/path";
        let output = await lint(fakeSpecPath, fakeRulesPath);

        expect(Spectral).toHaveBeenCalled();

        expect(Spectral.mock.instances[0].registerFormat).toHaveBeenCalledTimes(2);
        expect(Spectral.mock.instances[0].loadRuleset).toHaveBeenCalledTimes(1);
        expect(Spectral.mock.instances[0].loadRuleset).toHaveBeenCalledWith(fakeRulesPath);
        expect(Spectral.mock.instances[0].run).toHaveBeenCalledTimes(1);
        expect(Spectral.mock.instances[0].run).toHaveBeenCalledWith("");
        expect(loadFile).toHaveBeenCalled();
        expect(output).toEqual([]);
    });
});
