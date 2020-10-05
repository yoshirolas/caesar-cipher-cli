const { Transform } = require('stream');
const { StringDecoder } = require('string_decoder');

class StreamCaesarTransform extends Transform {
    constructor(options) {
        super (options)
    
        this._shift = options.shift;
        this._encription = options.encriptionProcess;
        // The stream will have Buffer chunks. The
        // decoder converts these to String instances.
        this._decoder = new StringDecoder('utf-8')
    }
  
    _transform (chunk, encoding, callback) {
        // Convert the Buffer chunks to String.
        if (encoding === 'buffer') {
            chunk = this._decoder.write(chunk)
        }

        const transformedChunk = this._encription(chunk, this._shift);
    
        // Pass the chunk on.
        callback(null, transformedChunk)
    }
};

module.exports = StreamCaesarTransform;