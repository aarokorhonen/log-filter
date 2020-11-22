import readline from "readline";
import { printHelpMessage } from "./args";

const rl = readline.createInterface({
    input: process.stdin,
    terminal: false,
});

const parseMinLogLevel = (arg: string | undefined) => {
    if (arg === undefined) {
        return undefined;
    } else {
        const int = parseInt(arg, 10);
        if (Number.isNaN(int)) {
            console.error(`Invalid log level supplied: ${arg}`);
            process.exit(1);
        } else {
            return int;
        }
    }
};

const argument = process.argv[2];

if (argument === "--help") {
    printHelpMessage();
    process.exit(0);
}

const minLogLevel = parseMinLogLevel(argument);

rl.on("line", (line) => {
    const entry = JSON.parse(line);
    if (
        typeof minLogLevel === "number" &&
        typeof entry.level === "number" &&
        entry.level < minLogLevel
    ) {
        return;
    } else {
        const output = JSON.stringify(entry);
        process.stdout.write(`${output}\n`);
    }
});