"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === "object") || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
  }
  return to;
};
var __toCommonJS = (mod) =>
  __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/ruleset.ts
var ruleset_exports = {};
__export(ruleset_exports, {
  default: () => ruleset_default,
});
module.exports = __toCommonJS(ruleset_exports);
var import_spectral_functions = require("@stoplight/spectral-functions");
var import_spectral_formats = require("@stoplight/spectral-formats");

// node_modules/@stoplight/types/dist/index.mjs
var HttpParamStyles;
(function (HttpParamStyles2) {
  HttpParamStyles2["Simple"] = "simple";
  HttpParamStyles2["Matrix"] = "matrix";
  HttpParamStyles2["Label"] = "label";
  HttpParamStyles2["Form"] = "form";
  HttpParamStyles2["CommaDelimited"] = "commaDelimited";
  HttpParamStyles2["SpaceDelimited"] = "spaceDelimited";
  HttpParamStyles2["PipeDelimited"] = "pipeDelimited";
  HttpParamStyles2["DeepObject"] = "deepObject";
})(HttpParamStyles || (HttpParamStyles = {}));
var DiagnosticSeverity;
(function (DiagnosticSeverity2) {
  DiagnosticSeverity2[(DiagnosticSeverity2["Error"] = 0)] = "Error";
  DiagnosticSeverity2[(DiagnosticSeverity2["Warning"] = 1)] = "Warning";
  DiagnosticSeverity2[(DiagnosticSeverity2["Information"] = 2)] = "Information";
  DiagnosticSeverity2[(DiagnosticSeverity2["Hint"] = 3)] = "Hint";
})(DiagnosticSeverity || (DiagnosticSeverity = {}));
var NodeType;
(function (NodeType2) {
  NodeType2["Article"] = "article";
  NodeType2["HttpService"] = "http_service";
  NodeType2["HttpServer"] = "http_server";
  NodeType2["HttpOperation"] = "http_operation";
  NodeType2["Model"] = "model";
  NodeType2["Generic"] = "generic";
  NodeType2["Unknown"] = "unknown";
  NodeType2["TableOfContents"] = "table_of_contents";
  NodeType2["SpectralRuleset"] = "spectral_ruleset";
  NodeType2["Styleguide"] = "styleguide";
  NodeType2["Image"] = "image";
})(NodeType || (NodeType = {}));
var NodeFormat;
(function (NodeFormat2) {
  NodeFormat2["Json"] = "json";
  NodeFormat2["Markdown"] = "markdown";
  NodeFormat2["Yaml"] = "yaml";
  NodeFormat2["Javascript"] = "javascript";
  NodeFormat2["Apng"] = "apng";
  NodeFormat2["Avif"] = "avif";
  NodeFormat2["Bmp"] = "bmp";
  NodeFormat2["Gif"] = "gif";
  NodeFormat2["Jpeg"] = "jpeg";
  NodeFormat2["Png"] = "png";
  NodeFormat2["Svg"] = "svg";
  NodeFormat2["Webp"] = "webp";
})(NodeFormat || (NodeFormat = {}));

// src/functions/checkSecurity.ts
var import_spectral_core = require("@stoplight/spectral-core");
var getAllOperations = function* (paths) {
  if (typeof paths !== "object") {
    return;
  }
  const validMethods = [
    "get",
    "head",
    "post",
    "put",
    "patch",
    "delete",
    "options",
    "trace",
  ];
  const operation = { path: "", operation: "" };
  for (const idx of Object.keys(paths)) {
    const path = paths[idx];
    if (typeof path === "object") {
      operation.path = idx;
      for (const httpMethod of Object.keys(path)) {
        typeof path[httpMethod] === "object" &&
          validMethods.includes(httpMethod) &&
          ((operation.operation = httpMethod), yield operation);
      }
    }
  }
};
var checkSecurity_default = (0, import_spectral_core.createRulesetFunction)(
  {
    input: null,
    options: {
      type: "object",
      additionalProperties: false,
      properties: {
        schemesPath: {
          type: "array",
        },
        nullable: true,
        methods: {
          type: "array",
        },
      },
      required: [],
    },
  },
  function checkSecurity(input, options) {
    const errorList = [];
    const { schemesPath: s, nullable, methods } = options;
    const { paths, security } = input;
    for (const { path, operation: httpMethod } of getAllOperations(paths)) {
      if (methods && Array.isArray(methods) && !methods.includes(httpMethod)) {
        continue;
      }
      let { security: operationSecurity } = paths[path][httpMethod];
      let securityRef = [path, httpMethod];
      if (operationSecurity === void 0) {
        operationSecurity = security;
        securityRef = ["$.security"];
      }
      if (!operationSecurity || operationSecurity.length === 0) {
        errorList.push({
          message: `Operation has undefined security scheme in ${securityRef}.`,
          path: ["paths", path, httpMethod, "security", s],
        });
      }
      if (Array.isArray(operationSecurity)) {
        for (const [idx, securityEntry] of operationSecurity.entries()) {
          if (typeof securityEntry !== "object") {
            continue;
          }
          const securitySchemeIds = Object.keys(securityEntry);
          securitySchemeIds.length === 0 &&
            nullable === false &&
            errorList.push({
              message: `Operation referencing empty security scheme in ${securityRef}.`,
              path: ["paths", path, httpMethod, "security", idx],
            });
        }
      }
    }
    return errorList;
  }
);

// src/ruleset.ts
var ruleset_default = {
  formats: [import_spectral_formats.oas2, import_spectral_formats.oas3],
  aliases: {
    ArrayProperties: {
      targets: [
        {
          formats: [
            import_spectral_formats.oas2,
            import_spectral_formats.oas3_0,
          ],
          given: ['$..[?(@ && @.type=="array")]'],
        },
        {
          formats: [import_spectral_formats.oas3_1],
          given: [
            '$..[?(@ && @.type=="array")]',
            '$..[?(@ && @.type && @.type.constructor.name === "Array" && @.type.includes("array"))]',
          ],
        },
      ],
    },
    IntegerProperties: {
      targets: [
        {
          formats: [
            import_spectral_formats.oas2,
            import_spectral_formats.oas3_0,
          ],
          given: ['$..[?(@ && @.type=="integer")]'],
        },
        {
          formats: [import_spectral_formats.oas3_1],
          given: [
            '$..[?(@ && @.type=="integer")]',
            '$..[?(@ && @.type && @.type.constructor.name === "Array" && @.type.includes("integer"))]',
          ],
        },
      ],
    },
    StringProperties: {
      targets: [
        {
          formats: [
            import_spectral_formats.oas2,
            import_spectral_formats.oas3_0,
          ],
          given: ['$..[?(@ && @.type=="string")]'],
        },
        {
          formats: [import_spectral_formats.oas3_1],
          given: [
            '$..[?(@ && @.type=="string")]',
            '$..[?(@ && @.type && @.type.constructor.name === "Array" && @.type.includes("string"))]',
          ],
        },
      ],
    },
  },
  rules: {
    "owasp:api1:2019-no-numeric-ids": {
      description:
        "OWASP API1:2019 - Use random IDs that cannot be guessed. UUIDs are preferred.",
      severity: DiagnosticSeverity.Error,
      given:
        '$.paths..parameters[*][?(@property === "name" && (@ === "id" || @.match(/(_id|Id|-id)$/)))]^.schema',
      then: {
        function: import_spectral_functions.schema,
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
    },
    "owasp:api2:2019-no-http-basic": {
      message:
        "Security scheme uses HTTP Basic. Use a more secure authentication method, like OAuth 2.0.",
      description:
        "Basic authentication credentials transported over network are more susceptible to interception than other forms of authentication, and as they are not encrypted it means passwords and tokens are more easily leaked.",
      severity: DiagnosticSeverity.Error,
      given: "$.components.securitySchemes[*]",
      then: {
        field: "scheme",
        function: import_spectral_functions.pattern,
        functionOptions: {
          notMatch: "basic",
        },
      },
    },
    "owasp:api2:2019-no-api-keys-in-url": {
      message: "ApiKey passed in URL: {{error}}.",
      description:
        "API Keys are (usually opaque) strings that\nare passed in headers, cookies or query parameters\nto access APIs.\nThose keys can be eavesdropped, especially when they are stored\nin cookies or passed as URL parameters.\n```\nsecurity:\n- ApiKey: []\npaths:\n  /books: {}\n  /users: {}\nsecuritySchemes:\n  ApiKey:\n    type: apiKey\n    in: cookie\n    name: X-Api-Key\n```",
      severity: DiagnosticSeverity.Error,
      formats: [import_spectral_formats.oas3],
      given: ['$..[securitySchemes][?(@ && @.type=="apiKey")].in'],
      then: [
        {
          function: import_spectral_functions.pattern,
          functionOptions: {
            notMatch: "^(path|query)$",
          },
        },
      ],
    },
    "owasp:api2:2019-no-credentials-in-url": {
      message: "Security credentials detected in path parameter: {{value}}.",
      description:
        "URL parameters MUST NOT contain credentials such as API key, password, or secret. See [RAC_GEN_004](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/04_Raccomandazioni%20di%20implementazione/04_raccomandazioni-tecniche-generali/01_globali.html?highlight=credenziali#rac-gen-004-non-passare-credenziali-o-dati-riservati-nellurl)",
      severity: DiagnosticSeverity.Error,
      formats: [import_spectral_formats.oas3],
      given: ["$..parameters[?(@ && @.in && @.in.match(/query|path/))].name"],
      then: [
        {
          field: "name",
          function: import_spectral_functions.pattern,
          functionOptions: {
            notMatch:
              "/^.*(client_?secret|token|access_?token|refresh_?token|id_?token|password|secret|api-?key).*$/i",
          },
        },
      ],
    },
    "owasp:api2:2019-auth-insecure-schemes": {
      message:
        "Authentication scheme is considered outdated or insecure: {{value}}.",
      description:
        "There are many [HTTP authorization schemes](https://www.iana.org/assignments/http-authschemes/) but some of them are now considered insecure, such as negotiating authentication using specifications like NTLM or OAuth v1.",
      severity: DiagnosticSeverity.Error,
      formats: [import_spectral_formats.oas3],
      given: ['$..[securitySchemes][?(@.type=="http")].scheme'],
      then: [
        {
          function: import_spectral_functions.pattern,
          functionOptions: {
            notMatch: "^(negotiate|oauth)$",
          },
        },
      ],
    },
    "owasp:api2:2019-jwt-best-practices": {
      message:
        "Security schemes using JWTs must explicitly declare support for RFC8725 in the description.",
      description:
        'JSON Web Tokens RFC7519 is a compact, URL-safe, means of representing claims to be transferred between two parties. JWT can be enclosed in encrypted or signed tokens like JWS and JWE.\n\nThe [JOSE IANA registry](https://www.iana.org/assignments/jose/jose.xhtml) provides algorithms information.\n\nRFC8725 describes common pitfalls in the JWx specifications and in\ntheir implementations, such as:\n- the ability to ignore algorithms, eg. `{"alg": "none"}`;\n- using insecure algorithms like `RSASSA-PKCS1-v1_5` eg. `{"alg": "RS256"}`.\nAn API using JWT should explicit in the `description`\nthat the implementation conforms to RFC8725.\n```\ncomponents:\n  securitySchemes:\n    JWTBearer:\n      type: http\n      scheme: bearer\n      bearerFormat: JWT\n      description: |-\n        A bearer token in the format of a JWS and conformato\n        to the specifications included in RFC8725.\n```',
      severity: DiagnosticSeverity.Error,
      given: [
        '$..[securitySchemes][?(@.type=="oauth2")]',
        '$..[securitySchemes][?(@.bearerFormat=="jwt" || @.bearerFormat=="JWT")]',
      ],
      then: [
        {
          field: "description",
          function: import_spectral_functions.truthy,
        },
        {
          field: "description",
          function: import_spectral_functions.pattern,
          functionOptions: {
            match: ".*RFC8725.*",
          },
        },
      ],
    },
    "owasp:api2:2019-protection-global-unsafe": {
      message: "This operation is not protected by any security scheme.",
      description:
        "Your API should be protected by a `security` rule either at global or operation level. All operations should be protected especially when they\nnot safe (methods that do not alter the state of the server) \nHTTP methods like `POST`, `PUT`, `PATCH` and `DELETE`.\nThis is done with one or more non-empty `security` rules.\n\nSecurity rules are defined in the `securityScheme` section.",
      severity: DiagnosticSeverity.Error,
      given: "$",
      then: [
        {
          function: checkSecurity_default,
          functionOptions: {
            schemesPath: ["securitySchemes"],
            nullable: true,
            methods: ["post", "put", "patch", "delete"],
          },
        },
      ],
    },
    "owasp:api2:2019-protection-global-unsafe-strict": {
      message: "This operation is not protected by any security scheme.",
      description:
        "Check if the operation is protected at operation level.\nOtherwise, check the global `#/security` property.",
      severity: DiagnosticSeverity.Information,
      given: "$",
      then: [
        {
          function: checkSecurity_default,
          functionOptions: {
            schemesPath: ["securitySchemes"],
            nullable: false,
            methods: ["post", "patch", "delete", "put"],
          },
        },
      ],
    },
    "owasp:api2:2019-protection-global-safe": {
      message: "This operation is not protected by any security scheme.",
      description:
        "Check if the operation is protected at operation level.\nOtherwise, check the global `#/security` property.",
      severity: DiagnosticSeverity.Information,
      given: "$",
      then: [
        {
          function: checkSecurity_default,
          functionOptions: {
            schemesPath: ["securitySchemes"],
            nullable: true,
            methods: ["get", "head"],
          },
        },
      ],
    },
    "owasp:api3:2019-define-error-validation": {
      message: "Missing error validation response of either 400 or 422.",
      description:
        "Carefully define schemas for all the API responses, including either 400 or 422 responses which describe errors caused by invalid requests.",
      severity: DiagnosticSeverity.Warning,
      given: "$.paths..responses",
      then: [
        {
          function: import_spectral_functions.schema,
          functionOptions: {
            schema: {
              type: "object",
              oneOf: [
                {
                  required: ["400"],
                },
                {
                  required: ["422"],
                },
              ],
            },
          },
        },
      ],
    },
    "owasp:api3:2019-define-error-responses-401": {
      message: "Operation is missing {{property}}.",
      description:
        "OWASP API Security recommends defining schemas for all responses, even errors. The 401 describes what happens when a request is unauthorized, so its important to define this not just for documentation, but to empower contract testing to make sure the proper JSON structure is being returned instead of leaking implementation details in backtraces.",
      severity: DiagnosticSeverity.Warning,
      given: "$.paths..responses",
      then: [
        {
          field: "401",
          function: import_spectral_functions.truthy,
        },
        {
          field: "401.content",
          function: import_spectral_functions.truthy,
        },
      ],
    },
    "owasp:api3:2019-define-error-responses-500": {
      message: "Operation is missing {{property}}.",
      description:
        "OWASP API Security recommends defining schemas for all responses, even errors. The 500 describes what happens when a request fails with an internal server error, so its important to define this not just for documentation, but to empower contract testing to make sure the proper JSON structure is being returned instead of leaking implementation details in backtraces.",
      severity: DiagnosticSeverity.Warning,
      given: "$.paths..responses",
      then: [
        {
          field: "500",
          function: import_spectral_functions.truthy,
        },
        {
          field: "500.content",
          function: import_spectral_functions.truthy,
        },
      ],
    },
    "owasp:api4:2019-rate-limit": {
      message: "All 2XX and 4XX responses should define rate limiting headers.",
      description:
        "Define proper rate limiting to avoid attackers overloading the API. There are many ways to implement rate-limiting, but most of them involve using HTTP headers, and there are two popular ways to do that:\n\nIETF Draft HTTP RateLimit Headers:. https://datatracker.ietf.org/doc/draft-ietf-httpapi-ratelimit-headers/\n\nCustomer headers like X-Rate-Limit-Limit (Twitter: https://developer.twitter.com/en/docs/twitter-api/rate-limits) or X-RateLimit-Limit (GitHub: https://docs.github.com/en/rest/overview/resources-in-the-rest-api)",
      severity: DiagnosticSeverity.Error,
      formats: [import_spectral_formats.oas3],
      given: "$.paths[*]..responses[?(@property.match(/^(2|4)/))]",
      then: {
        field: "headers",
        function: import_spectral_functions.schema,
        functionOptions: {
          schema: {
            type: "object",
            oneOf: [
              {
                required: ["RateLimit-Limit", "RateLimit-Reset"],
              },
              {
                required: ["X-RateLimit-Limit"],
              },
              {
                required: ["X-Rate-Limit-Limit"],
              },
            ],
          },
        },
      },
    },
    "owasp:api4:2019-rate-limit-retry-after": {
      message: "A 429 response should define a Retry-After header.",
      description:
        "Define proper rate limiting to avoid attackers overloading the API. Part of that involves setting a Retry-After header so well meaning consumers are not polling and potentially exacerbating problems.",
      severity: DiagnosticSeverity.Error,
      formats: [import_spectral_formats.oas3],
      given: "$..responses[429].headers",
      then: {
        field: "Retry-After",
        function: import_spectral_functions.defined,
      },
    },
    "owasp:api4:2019-rate-limit-responses-429": {
      message: "Operation is missing rate limiting response in {{property}}.",
      description:
        "OWASP API Security recommends defining schemas for all responses, even errors. A HTTP 429 response signals the API client is making too many requests, and will supply information about when to retry so that the client can back off calmly without everything breaking. Defining this response is important not just for documentation, but to empower contract testing to make sure the proper JSON structure is being returned instead of leaking implementation details in backtraces. It also ensures your API/framework/gateway actually has rate limiting set up.",
      severity: DiagnosticSeverity.Warning,
      given: "$.paths..responses",
      then: [
        {
          field: "429",
          function: import_spectral_functions.truthy,
        },
        {
          field: "429.content",
          function: import_spectral_functions.truthy,
        },
      ],
    },
    "owasp:api4:2019-array-limit": {
      message: "Schema of type array must specify maxItems.",
      description:
        "Array size should be limited to mitigate resource exhaustion attacks. This can be done using `maxItems`. You should ensure that the subschema in `items` is constrained too.",
      severity: DiagnosticSeverity.Error,
      given: "#ArrayProperties",
      then: {
        field: "maxItems",
        function: import_spectral_functions.defined,
      },
    },
    "owasp:api4:2019-string-limit": {
      message: "Schema of type string must specify maxLength.",
      description:
        "String size should be limited to mitigate resource exhaustion attacks. This can be done using `maxLength`.",
      severity: DiagnosticSeverity.Error,
      given: "#StringProperties",
      then: {
        field: "maxLength",
        function: import_spectral_functions.defined,
      },
    },
    "owasp:api4:2019-string-restricted": {
      message: "Schema of type string must specify a format or pattern.",
      description:
        "To avoid unexpected values being sent or leaked, ensure that strings have either a format or a RegEx pattern. This can be done using `format` or `pattern`.",
      severity: DiagnosticSeverity.Error,
      given: "#StringProperties",
      then: {
        function: import_spectral_functions.schema,
        functionOptions: {
          schema: {
            type: "object",
            oneOf: [
              {
                required: ["format"],
              },
              {
                required: ["pattern"],
              },
            ],
          },
        },
      },
    },
    "owasp:api4:2019-integer-limit": {
      message: "Schema of type integer must specify minimum and maximum.",
      description:
        "Integers should be limited to mitigate resource exhaustion attacks. This can be done using `minimum` and `maximum`, which can with e.g.: avoiding negative numbers when positive are expected, or reducing unreasonable iterations like doing something 1000 times when 10 is expected.",
      severity: DiagnosticSeverity.Error,
      formats: [import_spectral_formats.oas3_1],
      given: "#IntegerProperties",
      then: [
        {
          function: import_spectral_functions.xor,
          functionOptions: {
            properties: ["minimum", "exclusiveMinimum"],
          },
        },
        {
          function: import_spectral_functions.xor,
          functionOptions: {
            properties: ["maximum", "exclusiveMaximum"],
          },
        },
      ],
    },
    "owasp:api4:2019-integer-limit-legacy": {
      message: "Schema of type integer must specify minimum and maximum.",
      description:
        "Integers should be limited to mitigate resource exhaustion attacks. This can be done using `minimum` and `maximum`, which can with e.g.: avoiding negative numbers when positive are expected, or reducing unreasonable iterations like doing something 1000 times when 10 is expected.",
      severity: DiagnosticSeverity.Error,
      formats: [import_spectral_formats.oas2, import_spectral_formats.oas3_0],
      given: "#IntegerProperties",
      then: [
        {
          field: "minimum",
          function: import_spectral_functions.defined,
        },
        {
          field: "maximum",
          function: import_spectral_functions.defined,
        },
      ],
    },
    "owasp:api4:2019-integer-format": {
      message: "Schema of type integer must specify format (int32 or int64).",
      description:
        "Integers should be limited to mitigate resource exhaustion attacks. Specifying whether int32 or int64 is expected via `format`.",
      severity: DiagnosticSeverity.Error,
      given: "#IntegerProperties",
      then: [
        {
          field: "format",
          function: import_spectral_functions.defined,
        },
      ],
    },
    "owasp:api6:2019-no-additionalProperties": {
      message:
        "If the additionalProperties keyword is used it must be set to false.",
      description:
        "By default JSON Schema allows additional properties, which can potentially lead to mass assignment issues, where unspecified fields are passed to the API without validation. Disable them with `additionalProperties: false` or add `maxProperties`.",
      severity: DiagnosticSeverity.Warning,
      formats: [import_spectral_formats.oas3],
      given: '$..[?(@ && @.type=="object" && @.additionalProperties)]',
      then: [
        {
          field: "additionalProperties",
          function: import_spectral_functions.falsy,
        },
      ],
    },
    "owasp:api6:2019-constrained-additionalProperties": {
      message: "Objects should not allow unconstrained additionalProperties.",
      description:
        "By default JSON Schema allows additional properties, which can potentially lead to mass assignment issues, where unspecified fields are passed to the API without validation. Disable them with `additionalProperties: false` or add `maxProperties`",
      severity: DiagnosticSeverity.Warning,
      formats: [import_spectral_formats.oas3],
      given:
        '$..[?(@ && @.type=="object" && @.additionalProperties &&  @.additionalProperties!=true &&  @.additionalProperties!=false )]',
      then: [
        {
          field: "maxProperties",
          function: import_spectral_functions.defined,
        },
      ],
    },
    "owasp:api7:2019-security-hosts-https-oas2": {
      message:
        "All servers defined MUST use https, and no other protocol is permitted.",
      description:
        "All server interactions MUST use the https protocol, so the only OpenAPI scheme being used should be `https`.\n\nLearn more about the importance of TLS (over SSL) here: https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Protection_Cheat_Sheet.html",
      severity: DiagnosticSeverity.Error,
      formats: [import_spectral_formats.oas2],
      given: "$.schemes",
      then: {
        function: import_spectral_functions.schema,
        functionOptions: {
          schema: {
            type: "array",
            items: {
              type: "string",
              const: "https",
            },
          },
        },
      },
    },
    "owasp:api7:2019-security-hosts-https-oas3": {
      message:
        "Server URLs MUST begin https://, and no other protocol is permitted.",
      description:
        "All server interactions MUST use the https protocol, meaning server URLs should begin `https://`.\n\nLearn more about the importance of TLS (over SSL) here: https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Protection_Cheat_Sheet.html",
      severity: DiagnosticSeverity.Error,
      formats: [import_spectral_formats.oas3],
      given: "$.servers..url",
      then: {
        function: import_spectral_functions.pattern,
        functionOptions: {
          match: "/^https:/",
        },
      },
    },
  },
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
module.exports = module.exports.default;
//# sourceMappingURL=ruleset.js.map

export default ruleset_default;
