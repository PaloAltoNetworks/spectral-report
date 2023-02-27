const {
  truthy,
  undefined,
  schema,
  pattern,
} = require("@stoplight/spectral-functions");
const { oas3 } = require("@stoplight/spectral-formats");

const ruleSet = {
  rules: {
    "api-home-get": {
      description: "APIs root path (`/`) MUST have a GET operation.",
      message: "Otherwise people won't know how to get it.",
      given: "$.paths[/]",
      then: {
        field: "get",
        function: truthy,
      },
      severity: "warn",
    },

    // Author: Phil Sturgeon (https://github.com/philsturgeon)
    "no-numeric-ids": {
      description: "Avoid exposing IDs as an integer, UUIDs are preferred.",
      given:
        '$.paths..parameters[*].[?(@property === "name" && (@ === "id" || @.match(/(_id|Id)$/)))]^.schema',
      then: {
        function: schema,
        functionOptions: {
          schema: {
            type: "object",
            not: {
              properties: {
                type: {
                  const: "integer",
                },
              },
            },
            properties: {
              format: {
                const: "uuid",
              },
            },
          },
        },
      },
      severity: "error",
    },

    // Author: Nauman Ali (https://github.com/naumanali-stoplight)
    "no-global-versioning": {
      description:
        "Using global versions just forces all your clients to do a lot more work for each upgrade. Please consider using API Evolution instead.",
      message: "Server URL should not contain global versions",
      given: "$.servers[*].url",
      then: {
        function: pattern,
        functionOptions: {
          notMatch: "/v[1-9]",
        },
      },
      formats: [oas3],
      severity: "warn",
    },
  },
};

module.exports = ruleSet;
export default ruleSet;
