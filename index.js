var async = require('async');
var program = require('commander');
var csv = require('fast-csv');
var yelp = require('./lib/yelp');
var fs = require('fs');

// cli configuration
program
  .version('1.0.0')
  .command('convert <input> <output>')
  .action(function(input, output) {

    fs.readFile(input, function(err, data) {

      var res = [];

      var lines = data.toString().split('\n');

      async.eachLimit(lines, 10, function(line, done) {

        var data = line.split(',');
        var term = data[0].toLowerCase().split(/(?=\.[^.]+$)/)[0];
        var loc = data[1].toLowerCase() + ', ' + data[2].toLowerCase();
        var ws = fs.createWriteStream(output);

        yelp.fullLookup(term, loc, function(content, term) {
          console.log(data[0] + ' ' + term);
          res.push(data[0] + ',' + term);
          done();
        });

      }, function(err) {
        if (err) { 
          console.log(err);
        }

        fs.writeFile(output, res.join('\n'), function() {
          console.log('Done!');
        });
      });

    });

  });

program.parse(process.argv);
