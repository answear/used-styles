'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.loadSerializedLookup = exports.serializeStylesLookup = void 0;
var async_1 = require('./utils/async');
function serializeStylesLookup(def) {
  (0, async_1.assertIsReady)(def);
  return {
    lookup: def.lookup,
    ast: def.ast,
    urlPrefix: def.urlPrefix,
  };
}
exports.serializeStylesLookup = serializeStylesLookup;
function loadSerializedLookup(def) {
  assertValidLookup(def);
  return {
    isReady: true,
    lookup: def.lookup,
    ast: def.ast,
    urlPrefix: def.urlPrefix,
    /**
     * Serialized style definition is already ready,
     * so `then` here is just a noop for compatibility
     */
    then: function (res) {
      if (res) {
        res();
      }
      return Promise.resolve();
    },
  };
}
exports.loadSerializedLookup = loadSerializedLookup;
function assertValidLookup(def) {
  if (typeof def === 'string') {
    throw new Error(
      'used-styles: got a string instead of serialized style definition object, make sure to parse it back to JS object first'
    );
  }
  if (!('lookup' in def) || typeof def.lookup !== 'object') {
    throw new Error('used-styles: serialized style definition should be created with serializeStylesLookup');
  }
}
