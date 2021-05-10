const { fileExists, loadFile, writeToFile, filterJson, formatJSON } = require("../lib/utils");
const fs = require("fs");

describe("Utils", () => {
    it("fileExists()", () => {
        let spy = jest.spyOn(fs, "existsSync");

        spy.mockImplementation((path) => {
            return true;
        });

        let output = fileExists("/dummy/path/to/file.json");
        expect(spy).toHaveBeenCalled();
        expect(output).toEqual(true);
    });

    it("loadFile()", () => {
        let spy = jest.spyOn(fs, "readFileSync");

        spy.mockImplementation((path, options) => {
            return "{}"
        });

        let output = loadFile("/dummy/path/to/file.json");

        expect(output).toEqual("{}");
        expect(spy).toHaveBeenCalled();
    });

    it("writeToFile()", () => {
        let spy = jest.spyOn(fs, "writeFileSync");

        spy.mockImplementation((path, data, options) => {
        });

        writeToFile("dummy-data", "dummyfile.json");

        expect(spy).toHaveBeenCalled();
    });

    it("formatJSON()", () => {
        let mockInput = [
            {
                "code": "openapi-tags",
                "message": "OpenAPI object should have non-empty `tags` array.",
                "path": [],
                "severity": 1,
                "range": {
                    "start": {
                        "line": 0,
                        "character": 0
                    },
                    "end": {
                        "line": 170,
                        "character": 40
                    }
                }
            }
        ];

        let expectedOutput = [
            {
                "line": "1:1",
                "severity": "warn",
                "code": "openapi-tags",
                "message": "OpenAPI object should have non-empty `tags` array.",
                "path": ""
            }
        ];

        const output = formatJSON(mockInput);

        expect(output).toEqual(expectedOutput);

    });
});
