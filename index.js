const encription = require('./encription');

const str = 'ABCDEF143ыыыФФФabcdef';
const shift = 24;

encription.encode(str, shift);
encription.decode(str, shift);
