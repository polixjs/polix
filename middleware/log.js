const log = require('../lib/log');

module.exports = function(){
  return async function (ctx, next) {
    ctx.log = log;
    let ip = ctx.request.ip.indexOf('::ffff:')!==-1
      ? ctx.request.ip.substr(7)
      : ctx.request.ip;
    ip = ip.indexOf('::1') !== -1
      ? '127.0.0.1'
      : ip;
    let startTime = new Date();
    await next();
    let time = (new Date() - startTime) + 'ms';
    time = time.slice(0,-2) > 2 ? log.color.red(time) : log.color.green(time);
    ctx.log.r(`${ctx.request.method}, ${ctx.request.originalUrl}, ${ip}, user-agent: ${ctx.header['user-agent']}`,time);
  }
}