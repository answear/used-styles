var mode = 'plain';
export var isReact = function () {
  return mode === 'react';
};
export var enableReactOptimization = function () {
  return (mode = 'react');
};
