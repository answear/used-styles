'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.enableReactOptimization = exports.isReact = void 0;
var mode = 'plain';
var isReact = function () {
  return mode === 'react';
};
exports.isReact = isReact;
var enableReactOptimization = function () {
  return (mode = 'react');
};
exports.enableReactOptimization = enableReactOptimization;
