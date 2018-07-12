const app = require('../application');
const Router = require('koa-router');
const router = new Router();
const { HTTP } = require('../lib/enum');

const GET = build();
const POST = build(HTTP.POST);
const PUT = build(HTTP.PUT);
const DEL = build(HTTP.DEL);

function build(type = HTTP.GET){
  return function (path){
    if (arguments[1] != null){
      bind(...arguments,type);
      return arguments[2];
    }
    return function(...args){
      args[1] = path;
      args.push(type);
      return bind(...args); 
    };
  }
}

function bind(target, key, descriptor, type){
  let base = target.constructor.name.toLowerCase();
  base = base.split('controller')[0];
  const ctx = app.ctx;
  const method = descriptor.value;
  descriptor.value = (...args) => {
    let reqCtx = args[0];
    let reqBody = Object.assign({}, reqCtx.params, reqCtx.request.query, reqCtx.request.body);
    args.unshift(reqBody);
    return method.apply(app, args);
  };
  router[type](`/${base}/${key}`, descriptor.value);
  ctx.use(router.routes()).use(router.allowedMethods());
  return descriptor;
}

module.exports = {
  GET,
  POST,
  PUT,
  DEL
}