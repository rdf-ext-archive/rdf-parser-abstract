var
  util = require('util'),
  Readable = require('stream').Readable;


var AbstractParser = function () {
  var self = this;

  this.parse = function (data, callback, base, filter, graph) {
    graph = graph || rdf.createGraph();

    var pushTriple = function (triple) {
      graph.add(triple);
    };

    return new Promise(function (resolve, reject) {
      self.process(data, pushTriple, base, filter, function (error) {
        // callback API
        if (callback) {
          callback(null, graph);
        }

        // Promise API
        if (error) {
          reject(error);
        } else {
          resolve(graph);
        }
      });
    });
  };

  this.stream = function (inputStream, base, filter) {
    var outputStream = new AbstractParser.TripleReadStream();

    AbstractParser.streamToData(inputStream).then(function (data) {
      self.process(data, function (triple) {
        outputStream.push(triple);
      }, base, filter, function (error) {
        if (error) {
          outputStream.emit('error', error);
        } else {
          outputStream.emit('end');
        }
      });
    }).catch(function (error) {
      outputStream.emit('error', error);
    });

    return outputStream;
  };
};


AbstractParser.streamToData = function (stream) {
  return new Promise(function (resolve, reject) {
    if (typeof stream !== 'object' || typeof stream.read !== 'function') {
      return resolve(stream);
    }

    var data;

    stream.on('data', function (chunk) {
      if (!data) {
        data = chunk;
      } else {
        if (Buffer.isBuffer(data)) {
          data = Buffer.concat(data, chunk);
        } else {
          data += data.toString();
        }
      }
    })

    stream.on('end', function() {
      resolve(data);
    });

    stream.on('error', function (error) {
      reject(error);
    });
  });
};


AbstractParser.TripleReadStream = function () {
  Readable.call(this, {objectMode: true});

  this._read = function () {
    return 0;
  };
};

util.inherits(AbstractParser.TripleReadStream, Readable);


module.exports = AbstractParser;
