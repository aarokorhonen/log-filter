import arg from "arg";

const helpMessage = `\
Usage:          node index.js [minlevel]
Example usage:  node index.js 30

Options:        --help    Prints this message
`;

const printHelpMessage = () => {
    console.log(helpMessage);
};

const parseMinLogLevel = (minLevel: string | undefined): number | undefined => {
    if (minLevel === undefined) {
        return undefined;
    } else {
        const int = parseInt(minLevel, 10);
        if (Number.isNaN(int)) {
            console.error(`Invalid log level supplied: "${minLevel}"`);
            process.exit(1);
        } else {
            return int;
        }
    }
};

const behaviors = ["error", "skip", "pass"] as const;

type Behavior = typeof behaviors[number];

const isBehavior = (input: string): input is Behavior =>
    (behaviors as readonly string[]).includes(input);

const parseBehavior = (input: string, label: string): Behavior => {
    if (isBehavior(input)) {
        return input;
    } else {
        console.error(`Invalid value for option ${label}: "${input}"`);
        process.exit(1);
    }
};

interface Config {
    dryRun: boolean;
    minLogLevel: number | undefined;
    invalidJson: Behavior;
    filterExpression: string | undefined;
}

export const parseConfigFromArgs = (slicedArgV: string[]): Config => {
    try {
        const args = arg(
            {
                "--help": Boolean,
                "--dry-run": Boolean,
                "--min-level": parseMinLogLevel,
                "--invalid-json": (input) =>
                    parseBehavior(input, "--invalid-json"),
                "--filter-expression": String,
                "--debug-print-config": Boolean,
            },
            {
                argv: slicedArgV,
                permissive: false,
            },
        );

        if (args._.length > 0) {
            throw new Error(`command not supported: ${args._[0]}`);
        }

        if (args["--help"]) {
            printHelpMessage();
            process.exit(0);
        }

        const config: Config = {
            dryRun: args["--dry-run"] === true,
            minLogLevel: args["--min-level"],
            invalidJson: args["--invalid-json"] ?? "error",
            filterExpression: args["--filter-expression"],
        };

        if (args["--debug-print-config"]) {
            console.log(JSON.stringify(config, null, 4));
            process.exit(0);
        }

        return config;
    } catch (err) {
        console.error(String(err));
        console.error("  Run with --help to see usage\n");
        process.exit(1);
    }
};
