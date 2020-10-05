const encription = require('./encription');
const StreamCaesarTransform = require('./transform');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');
const { program } = require('commander');


program
    .option('-s, --shift [Number]', 'a shift')
    .option('-n, --negative [Boolean]', 'to set negative shift')
    .option('-i, --input [String]', 'an input file')
    .option('-o, --output [String]', 'an output file')
    .option('-a, --actionn [String]', 'an action encode/decode');
program.parse(process.argv);

const shift = program.negative ? 0 - program.shift : program.shift;
const encriptionProcess = program.actionn === 'decode' ? encription.decode : encription.encode; 

if (!program.shift || !program.actionn) {
    process.stderr.write('Shift and encription type are reqired (-s, -a)');
    process.exit();
}

if (program.output) {
    if (typeof program.output !== 'string') {
        console.error(`Output path should has String format`);
        process.exit(1);
    }
    fs.access(program.output, (err) => {
        if (err) {
            console.error(`Output file ${path.resolve(program.output)} does not exist`);
            process.exit(1);
        }
    });
}
if (program.input) {
    if (typeof program.input !== 'string') {
        console.error(`Input path should has String format`);
        process.exit(1);
    }
    fs.access(program.input, (err) => {
        if (err) {
            console.error(`Input file ${path.resolve(program.input)} does not exist`);
            process.exit(1);
        }
    });
}

if (!program.input) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const newLineChar = process.platform === 'win32' ? '\r\n' : '\n';
    rl.setPrompt(`Transformed text has been added to output file${newLineChar}`)

    rl.on('line', function(data) {
        const transformedData = encriptionProcess(data, shift);
        if (program.output) {
            fs.appendFileSync(program.output, `${newLineChar}${transformedData}`);
            rl.prompt();
        } else {
            console.log(transformedData);
        }
    })
} else {
    const outputType = program.output ? fs.createWriteStream(program.output) : process.stdout;
    const caesarTransform = new StreamCaesarTransform({shift, encriptionProcess});
    pipeline(
        fs.createReadStream(program.input),
        caesarTransform,
        outputType,
        err => {
            if (err) {
                throw Error(err);
            }
        }
    )
}
