const Tool = require('./tool');
const path = require('path');

const config = new Proxy({}, {
  get(target, prop) {
    if(Tool.isType(Tool.TYPE.Symbol,prop)) {
      return target;
    }
    if (target[prop]) {
      return Reflect.get(target, prop);
    } else {
      throw new ReferenceError(`Unknown enum '${prop}'`);
    }
  },
  set(target, property, value) {
    return Reflect.set(target, property, value);
  },
  deleteProperty() {
    throw new TypeError('Enum is readonly');
  }
});

exports.setRoot = function (filePath) {
  if (Tool.isEmpty(filePath)) throw new TypeError(' root is null ');
  Object.defineProperties(config, {
    'root': {
      enumerable: true,
      value: filePath,
      configurable: false,
      writable: false
    },
    'base': {
      enumerable: true,
      value: require(path.join(filePath,'/config/config.default')),
      configurable: false,
      writable: false
    },
    'plugin': {
      enumerable: false,
      value: require(path.join(filePath,'/config/plugin.default')),
      configurable: false,
      writable: false
    },
    'polix': {
      enumerable: false,
      value: {
        plugin: require(path.join(__dirname, '../config/plugin.default')),
        pluginDir: path.join(__dirname, '../plugin')
      },
      configurable: false,
      writable: false
    }
  });
};

exports.config = config;

