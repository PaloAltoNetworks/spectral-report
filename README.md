# Spectral Report

## Overview

`spectral-report` is a tool for linting and reporting openAPI specifications. It is built over [@stoplight/spectral](https://stoplight.io/open-source/spectral/).

## Installation

You can install `spectral-report` using npm:

```
npm install -g spectral-report
```

## Usage

You can run `spectral-report` using command:

```
spectral-report -s "path-to-spec-file"
```

For more options:

```
Usage: spectral-report -s "path-to-spec-file" [-r "path-to-rule-file"] [-n "report-name"] [-f "report-format"]

Options:
  -v, --version                   output the current version
  -s, --specPath <openapi spec>   path to openapi specification
  -r, --rulesetpath <rule file>   path to rules file
  -n, --reportName <report name>  report name (default: "spectral-report")
  -f, --reportFormat <format>     report format (choices: "json", "html", "csv", default: json)
  -h, --help                      display help for command
  ```

  ## License

  This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
  