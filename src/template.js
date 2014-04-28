// Do simple substitutions on a String object.
'use strict';

module.exports = function(string, substitutions) {
  return string.replace(/\{\{([A-Za-z0-9]+)\}\}/g, function(match, key) {
    return substitutions[key] !== undefined ? substitutions[key] : '';
  });
};
