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
    process.exit(1);
}

const validateIO = (inputPath, outputPath) => {
    return new Promise((res, rej) => {
        if (outputPath) {
            if (typeof outputPath !== 'string') {
                process.stderr.write(`Output path should has String format`);
                rej();
                process.exit(1);
            }
            fs.access(outputPath, (err) => {
                if (err) {
                    process.stderr.write(`Output file ${path.resolve(outputPath)} does not exist`);
                    rej();
                }
                res();
            });
        }
        if (inputPath) {
            if (typeof inputPath !== 'string') {
                process.stderr.write(`Input path should has String format`);
                rej();
            }
            fs.access(inputPath, (err) => {
                if (err) {
                    process.stderr.write(`Input file ${path.resolve(inputPath)} does not exist`);
                    rej();
                }
                res();
            });
        }  
    });
};

validateIO(program.input, program.output)
    .then(() => {
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
                    process.stdout.write(transformedData);
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
    })
    .catch(() => {
        process.exit(1);
    })
