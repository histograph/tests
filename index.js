var test = require('tape');
var fs = require('fs');
var url = require('url');
var util = require('util');
var async = require('async');
var request = require('request');
var yaml = require('js-yaml');
var config = require('histograph-config');
var tests = yaml.safeLoad(fs.readFileSync('./tests.yml', 'utf8'));

function objToUrlParams(obj) {
  return Object.keys(obj).map(function(key) {
    return key + '=' + obj[key];
  }).join('&');
}

function objectContainsObject(larger, smaller) {
  if (!larger && !smaller) {
    return true;
  } else if (!larger && smaller) {
    return false;
  }

  return Object.keys(smaller).every(function(key) {
    var c = smaller[key].constructor;
    if (c === Object) {
      return objectContainsObject(larger[key], smaller[key]);
    } else if (c === Array) {
      console.error('Arrays not yet supported in objectContainsObject()');
      return false;
    } else {
      return smaller[key] === larger[key];
    }
  });
}

async.eachSeries(tests, function(q, callback) {
  var params = objToUrlParams(q.query);
  var u = url.resolve(config.api.baseUrl, 'search?' + params);
  test(util.format('Query: `%s`', u), function(t) {
    request(u, { json: true }, function(error, response, geojson) {
      q.concepts.forEach(function(expectedConcept) {
        var containsConcept = geojson.features.some(function(resultingConcept) {
          return expectedConcept.pits.every(function(expectedPit) {
            return resultingConcept.properties.pits.some(function(resultingPit) {
              return objectContainsObject(resultingPit, expectedPit);
            });
          });
        });

        if (containsConcept) {
          t.pass('OK');
        } else {
          t.fail('Not all PITs found in concept:' + JSON.stringify(expectedConcept));
        }
      });

      t.end();
      callback();
    });
  });
});
