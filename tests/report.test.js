const { generateReport } = require("../lib/report");
const { loadFile, writeToFile } = require("../lib/utils");

jest.mock("../lib/utils.js", () => {
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

const messages1 = [
    {
        "line": "1:1",
        "severity": "warn",
        "code": "openapi-tags",
        "message": "OpenAPI object should have non-empty `tags` array.",
        "path": ""
    },
    {
        "line": "3:12",
        "severity": "error",
        "code": "info-contact",
        "message": "Info object should contain `contact` object.",
        "path": "info"
    },
    {
        "line": "1:12",
        "severity": "info",
        "code": "info-description",
        "message": "OpenAPI object info `description` must be present and non-empty string.",
        "path": "info"
    },
    {
        "line": "17:19",
        "severity": "hint",
        "code": "operation-description",
        "message": "Operation `description` must be present and non-empty string.",
        "path": "paths./pets.get"
    }
];

const messages2 = [];

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

    it("generateHTMLReport() - no messages reported", () => {
        const Handlebars = require("handlebars");

        let spyRegisterHelper = jest.spyOn(Handlebars, "registerHelper");
        let spyCompile = jest.spyOn(Handlebars, "compile");

        spyRegisterHelper.mockImplementation((name, callback) => {
            callback();
        });

        spyCompile.mockImplementation((str) => {
            return (str) => { return "" };
        });

        generateReport(messages1, "report", "html");

        expect(spyRegisterHelper).toHaveBeenCalled();
        expect(spyCompile).toHaveBeenCalled();
        expect(loadFile).toHaveBeenCalled();
        expect(writeToFile).toHaveBeenCalled();
        expect(writeToFile).toBeCalledWith("", "report.html");

    });

    it("generateHTMLReport() - at least one message of each severity reported", () => {
        const Handlebars = require("handlebars");

        let spyRegisterHelper = jest.spyOn(Handlebars, "registerHelper");
        let spyCompile = jest.spyOn(Handlebars, "compile");

        spyRegisterHelper.mockImplementation((name, callback) => {
            callback();
        });

        spyCompile.mockImplementation((str) => {
            return (str) => { return "" };
        });

        // Cover all branches of severity
        generateReport(messages2, "report", "html");

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
