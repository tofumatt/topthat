// Do simple substitutions on a String object.
module.exports = function(string, substitutions) {
  'use strict';

  return string.replace(/\{\{([A-Za-z0-9]+)\}\}/g, function(match, key) {
    return substitutions[key] !== undefined ? substitutions[key] : '';
  });
};
