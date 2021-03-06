# json-log-filter

_Note: This is experimental software and has not been extensively tested in production environments!_

This is a tiny utility program for applying filters to structured JSON logs. It is designed to consume output from other programs that produce logs in JSON format, such as the following:

-   Go applications using the [logrus](https://github.com/sirupsen/logrus) library
-   Node.js applications using the [pino](https://github.com/pinojs/pino) library
-   Python applications using the [json-logging-python](https://github.com/bobbui/json-logging-python) library

JSON logs consist of stringified JSON object values, each value on a line terminated by a line feed character.

Note that you may need an intermediary transport middleware if your logs are not
output in the format expected by this utility. Support for flexible filter
expressions is planned for a future release.

The utility runs on Node.js.

## Usage

Build the module using the `build` script from package.json:

```console
$ yarn run build
```

Run the utility by executing the main module. Optionally, you can specify command line arguments (see below).

```console
$ node .
```

Use this utility as part of a UNIX-style pipe to filter out log entries produced by another process.

For example, use in conjunction with [`pino-pretty`](https://github.com/pinojs/pino-pretty) to focus on interesting lines:

```console
$ example-app | node . --min-level 50 --invalid-json=skip | npx pino-pretty
```

## Command line options

-   `--help` _(Optional)_: Print out instructions for usage.

-   `--min-level` _(Optional)_: Specify minimum level as a command line argument of type integer (see above example). All lines with a `level` entry lower than the specified value will be ignored. Levels without a `level` entry will not be filtered out.

-   `--filter-expression` _(Optional)_: Specify a [JMESPath](https://jmespath.org/) expression to use as a filter. The expression will be evaluated against every JSON log entry object, and only values for which the expression evaluates to `true` will pass the filter. Note that the expression must always result in a value of type `boolean` to be considered valid. Example: `` --filter-expression="meta.importance > `100`" ``

-   `--invalid-json` (`error` | `skip` | `pass`) _(Optional, defaults to `error`)_: Specify behavior when consuming invalid JSON lines. With `error`, the process exits with a non-zero exit code. With `skip`, the invalid line is silently filtered out and ignored. With `pass`, the invalid line passes the filter and is output to stdout as-is.

-   `--dry-run` _(Optional)_: Displays filter results with colorized output: lines that pass the specified filter rules are displayed in bold green text. Lines that would be filtered out are displayed in gray text. Using this option requires stdout to be a terminal with color support (set the `FORCE_COLOR` environment variable to `1` to always use colored output; see [details](https://github.com/chalk/supports-color/)).

-   `--debug-print-config` _(Optional)_: Print out resolved configuration and exit.

## Development

Run the following command to run a simple automatic test suite:

```console
$ yarn run test
```
