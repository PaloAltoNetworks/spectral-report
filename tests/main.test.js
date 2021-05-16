const { fileExists, formatJSON } = require("../lib/utils");
const { lint } = require("../lib/linter");
const { generateReport } = require("../lib/report");
const { main } = require("../lib/main");

jest.mock("../lib/utils.js", () => {
    return {
        fileExists: jest.fn(),
        formatJSON: jest.fn((data) => {
            return [];
        })
    };
});

jest.mock("../lib/linter.js", () => {
    return {
        lint: jest.fn((param1, param2) => {
            return Promise.resolve(() => {
            });
        })
    }
});

jest.mock("../lib/report.js", () => {
    return {
        generateReport: jest.fn((param1, param2, param3) => {
        })
    };
});

let mockObj = {
    specPath: "/fake/path",
    reportName: "report",
    reportFormat: "json"
};

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("main", () => {
    it("main() - success", async () => {
        fileExists.mockReturnValueOnce(true);
        main(mockObj);
        expect(fileExists).toHaveBeenCalled();
        expect(lint).toHaveBeenCalled();
        expect(lint).toHaveBeenCalledWith(mockObj.specPath, mockObj.rulesetPath);
        await expect(lint.mock.results[0]).resolves;
        expect(formatJSON).toHaveBeenCalled();
        expect(generateReport).toHaveBeenCalled();
    });

    it("main() throws error due to spec file", () => {
        fileExists.mockReturnValueOnce(false);
        expect(() => { main(mockObj) }).toThrow("Unable to resolve /fake/path");
        expect(fileExists).toHaveBeenCalled();
        expect(fileExists).toHaveBeenCalledWith(mockObj.specPath);
        expect(lint).not.toHaveBeenCalled();
    });

    it("main() throws error due to rules file", () => {
        fileExists.mockReturnValueOnce(true)
            .mockReturnValueOnce(false);
        mockObj.rulesetPath = "/another/fake/path";
        expect(() => { main(mockObj) }).toThrow("Unable to resolve /another/fake/path");
        expect(fileExists).toHaveBeenCalled();
        expect(lint).not.toHaveBeenCalled();
    });
});