const config = require('./config');


const belongToGap = (pos, startPos, lastPos) => {
    return pos >= startPos && pos <= lastPos
};

const belongToLowercaseSymbols = (charcode) => {
    return belongToGap(charcode, config.lowercaseSymbol.startIndex, config.lowercaseSymbol.lastIndex);
};

const belongToUppercaseSymbols = (charcode) => {
    return belongToGap(charcode, config.uppercaseSymbol.startIndex, config.uppercaseSymbol.lastIndex);
};

const getNegativeShiftPos = (pos, shift, startPos, lastPos) => {
    const delta = startPos - pos + shift - 1;
    return pos - shift < startPos ? lastPos - delta : pos - shift;
};

const getPositiveShiftPos = (pos, shift, startPos, lastPos) => {
    const delta = pos + shift - lastPos;
    return pos + shift > lastPos ? startPos - 1 + delta : pos + shift; 
};

const getShiftedPos = (pos, shift, startPos, lastPos) => {
    const isNegativeShift = shift < 0;
    const absShift = Math.abs(shift);
    const gap = lastPos - startPos + 1;
    const finitedShift =  absShift / gap > 1 
        ? (absShift % gap > 1 ? absShift % gap - 1 : 0)
        : absShift;

    return isNegativeShift ? getNegativeShiftPos(pos, finitedShift, startPos, lastPos) : getPositiveShiftPos(pos, finitedShift, startPos, lastPos)
};

const getLowercaseShiftedPos = (charcode, shift) => {
    return getShiftedPos(charcode, shift, config.lowercaseSymbol.startIndex, config.lowercaseSymbol.lastIndex);
};

const getUppercaseShiftedPos = (charcode, shift) => {
    return getShiftedPos(charcode, shift, config.uppercaseSymbol.startIndex, config.uppercaseSymbol.lastIndex);
};

const encodeString = (str, shift) => {
    let output = '';
    const length = str.length;
    for (let i = 0; i < length; i++) {
        const inputCharcode = str.charCodeAt(i);
        let outputCharcode;
        if (belongToLowercaseSymbols(inputCharcode)) {
            outputCharcode = getLowercaseShiftedPos(inputCharcode, shift);
        } else if (belongToUppercaseSymbols(inputCharcode)) {
            outputCharcode = getUppercaseShiftedPos(inputCharcode, shift);
        } else {
            outputCharcode = inputCharcode;
        }
        output += String.fromCharCode(outputCharcode);
    }
    console.log(output);
};

const decodeString = (str, shift) => {
    const negativeShift = 0 - shift;
    encodeString(str, negativeShift);
};

module.exports = {
    encode: (str, shift) => encodeString(str, shift),
    decode: (str, shift) => decodeString(str, shift)
}