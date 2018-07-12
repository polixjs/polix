const chalk = require('chalk');
const Writable = require('stream').Writable;
const util = require('util');
const tool = require('../utils/tool');

const levelNames = tool.buildEnum({
  0: 'LISTEN',
  10: 'TRACE',
  20: 'DEBUG',
  30: 'INFO ',
  40: 'WARN ',
  50: 'ERROR',
  60: 'FATAL',
  70: 'ROUTER'
});

const levelColors = tool.buildEnum({
  0: 'blueBright',
  10: 'gray',
  20: 'gray',
  30: 'green',
  40: 'bgYellow',
  50: 'bgRed',
  60: 'bgRed',
  70: 'magenta'
})

function ConsoleStream(env) {
  Writable.call(this, { objectMode: true });
  env = env || { debug: true };
  this.debug = env.debug;
}

util.inherits(ConsoleStream, Writable);

ConsoleStream.prototype._write = function (data) {
  let msg = '';
  let level = data.level;

  if (this.debug) {
    msg += chalk.gray(tool.format(new Date() + '')) + ' ';
  }

  msg += chalk[levelColors[level]](levelNames[level]) + ' ';

  msg += data.msg;

  Reflect.has(data, 'log') && (msg += ' ' + data.log);

  msg += '\n';

  if (level >= 40) {
    process.stderr.write(msg);
  } else {
    process.stdout.write(msg);
  }
};

function init(opts){
  let logger = new ConsoleStream(opts);
  let log = {
    listen: buildLevel(0,logger),
    debug: buildLevel(20,logger),
    info: buildLevel(30,logger),
    warn: buildLevel(40,logger),
    error: buildLevel(50,logger),
    super: buildLevel(10,logger),
    log: console.log,
    router: buildLevel(70, logger),
  };

  log.d = log.debug;
  log.i = log.info;
  log.w = log.warn;
  log.e = log.error;
  log.l = log.log;
  log.s = log.super;
  log.r = log.router;

  log.color = {
    green: buildChalk('green'),
    yellow: buildChalk('yellow'),
    red: buildChalk('red'),
  };

  return log;
}

function buildLevel(level, logger){
  return function(msg){
    let data = {};
    data.level = level;
    data.msg = msg;
    const args = [].slice.apply(arguments).splice(1);
    if(args.length > 0){
      data.log = '';
      args.map(item => data.log += item + ' ');
    }
    return logger._write(data);
  };
}

function buildChalk(color){
  return function(msg){
    return chalk[color](msg);
  };
}

let log = init({ debug: false });

module.exports = log;
