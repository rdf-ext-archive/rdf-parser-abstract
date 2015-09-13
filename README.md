# rdf-parser-abstract

Abstract base class for RDF-Interfaces parser implementations.

## Usage

The `AbstractParser` class adds default implementations for `.parse(data, callback, base, filter, graph)` and `.stream(inputStream, base, filter)`.
Only the `.process(data, callback, base, filter, done)` method must be implemented.

Inherit from `AbstractParser`:

	function YourParser () {
	  AbstractParser.call(this, rdf)
	}

	util.inherits(YourParser, AbstractParser)

The `.process` method must call the callback function for every triple: 
	  
	YourParser.prototype.process = function (data, callback, base, filter, done) {
	  filter = filter || function () {
	    return true
	  }
	
	  triples.forEach(function (triple) {
	    if (filter(triple)) {
	      callback(triple)
	    }
	  })
	}
