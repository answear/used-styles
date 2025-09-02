'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.enableReactOptimization =
  exports.createLink =
  exports.createCriticalStyleStream =
  exports.createStyleStream =
  exports.extractCriticalRules =
  exports.getCriticalRules =
  exports.getCriticalStyles =
  exports.getUsedStyles =
  exports.alterProjectStyles =
  exports.parseProjectStyles =
  exports.loadStyleDefinitions =
  exports.createUsedSelectorsFilter =
  exports.loadSerializedLookup =
  exports.serializeStylesLookup =
  exports.discoverProjectStyles =
    void 0;
var config_1 = require('./config');
Object.defineProperty(exports, 'enableReactOptimization', {
  enumerable: true,
  get: function () {
    return config_1.enableReactOptimization;
  },
});
var createLink_1 = require('./createLink');
Object.defineProperty(exports, 'createLink', {
  enumerable: true,
  get: function () {
    return createLink_1.createLink;
  },
});
var getCSS_1 = require('./getCSS');
Object.defineProperty(exports, 'getCriticalRules', {
  enumerable: true,
  get: function () {
    return getCSS_1.getCriticalRules;
  },
});
Object.defineProperty(exports, 'extractCriticalRules', {
  enumerable: true,
  get: function () {
    return getCSS_1.extractCriticalRules;
  },
});
Object.defineProperty(exports, 'getCriticalStyles', {
  enumerable: true,
  get: function () {
    return getCSS_1.getCriticalStyles;
  },
});
Object.defineProperty(exports, 'getUsedStyles', {
  enumerable: true,
  get: function () {
    return getCSS_1.getUsedStyles;
  },
});
var operations_1 = require('./operations');
Object.defineProperty(exports, 'alterProjectStyles', {
  enumerable: true,
  get: function () {
    return operations_1.alterProjectStyles;
  },
});
var critical_1 = require('./reporters/critical');
Object.defineProperty(exports, 'createCriticalStyleStream', {
  enumerable: true,
  get: function () {
    return critical_1.createCriticalStyleStream;
  },
});
var used_1 = require('./reporters/used');
Object.defineProperty(exports, 'createStyleStream', {
  enumerable: true,
  get: function () {
    return used_1.createStyleStream;
  },
});
var style_operations_1 = require('./style-operations');
Object.defineProperty(exports, 'loadStyleDefinitions', {
  enumerable: true,
  get: function () {
    return style_operations_1.loadStyleDefinitions;
  },
});
Object.defineProperty(exports, 'parseProjectStyles', {
  enumerable: true,
  get: function () {
    return style_operations_1.parseProjectStyles;
  },
});
var cache_1 = require('./utils/cache');
Object.defineProperty(exports, 'createUsedSelectorsFilter', {
  enumerable: true,
  get: function () {
    return cache_1.createUsedFilter;
  },
});
/**
 * @deprecated please import discoverProjectStyles from 'used-styles/node'
 */
var discoverProjectStyles = function () {
  throw new Error("Please import discoverProjectStyles from 'used-styles/node'");
};
exports.discoverProjectStyles = discoverProjectStyles;
var serialize_1 = require('./serialize');
Object.defineProperty(exports, 'serializeStylesLookup', {
  enumerable: true,
  get: function () {
    return serialize_1.serializeStylesLookup;
  },
});
Object.defineProperty(exports, 'loadSerializedLookup', {
  enumerable: true,
  get: function () {
    return serialize_1.loadSerializedLookup;
  },
});
