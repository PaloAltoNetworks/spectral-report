const { generateReport } = require("../src/report");
const { loadFile, writeToFile } = require("../src/utils");

jest.mock("../src/utils.js", () => {
    return {
        loadFile: jest.fn((path) => {
            return "";
        }),
        writeToFile: jest.fn((data, filename) => {
        })
    };
});

const messages = [
    {
        "line": "1:1",
        "severity": "warn",
        "code": "openapi-tags",
        "message": "OpenAPI object should have non-empty `tags` array.",
        "path": ""
    }
];

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("report", () => {
    it("generateJSONReport()", () => {
        generateReport(messages, "report", "json");

        expect(writeToFile).toHaveBeenCalled();
        expect(writeToFile).toBeCalledWith(JSON.stringify(messages, null, 4), "report.json");
    });

    it("generateHTMLReport()", () => {
        const Handlebars = require("handlebars");

        let spyRegisterHelper = jest.spyOn(Handlebars, "registerHelper");
        let spyCompile = jest.spyOn(Handlebars, "compile");

        spyRegisterHelper.mockImplementation((name, callback) => {
            callback;
        });

        spyCompile.mockImplementation((str) => {
            return (str) => { return "" };
        });

        generateReport(messages, "report", "html");

        expect(spyRegisterHelper).toHaveBeenCalled();
        expect(spyCompile).toHaveBeenCalled();
        expect(loadFile).toHaveBeenCalled();
        expect(writeToFile).toHaveBeenCalled();
        expect(writeToFile).toBeCalledWith("", "report.html");

    });

    it("generateCSVReport()", () => {
        let mockcsv = "line,severity,code,message,path\n1:1,warn,openapi-tags,OpenAPI object should have non-empty \`tags\` array.,\n";

        generateReport(messages, "report", "csv");

        expect(writeToFile).toHaveBeenCalled();
        expect(writeToFile).toBeCalledWith(mockcsv, "report.csv");
    });

});
