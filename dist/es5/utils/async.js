'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.assertIsReady = void 0;
var assertIsReady = function (def) {
  if (!('isReady' in def)) {
    throw new Error(
      'used-styles: style definitions has to be created using discoverProjectStyles or loadStyleDefinitions'
    );
  }
  if (!def.isReady) {
    throw new Error('used-styles: style definitions are not ready yet. You should `await discoverProjectStyles(...)`');
  }
};
exports.assertIsReady = assertIsReady;
