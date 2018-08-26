const enumType = require('./lib/enum').polix;
const ctx = require('./extends/application');
const log = require('./lib/log');
const { conf,Tool } = require('./utils/');
const path = require('path');
const middleware = require('./middleware');

class App {

  constructor(){
    conf.setRoot(path.dirname(require.main.filename));
    Object.defineProperties(this,{
      _service: {
        writable: false,
        configurable: false,
        enumerable:false,
        value: {}
      },
      _controller: {
        writable: false,
        configurable: false,
        enumerable:false,
        value: {}
      },
      _store: {
        writable: false,
        configurable: false,
        enumerable:false,
        value: {}
      }
    });
    this.service = {};
    this.controller = {};
    this.ctx = new ctx();
    this.app = {};
    middleware.bind(this.ctx);
    let port = conf.config.base.port;
    this.config = conf.config;
    this.ctx.listen(port);
    this.addPlugins(conf.config.polix.plugin, conf.config.polix.pluginDir);
    log.listen(log.color.yellow('Start Server'),log.color.green('|'), log.color.red(`http://127.0.0.1:${port}`));
  }

  addMiddwares(middware){
    if(!Tool.isType(Tool.TYPE.Object,middware)) throw new TypeError('middware is not object');
    Object.getOwnPropertyNames(middware).map(m => {
      this.ctx.use(middware[m]());
    });
  }

  addPlugins(pluginConf = this.config.plugin, plugin){
    if(!Tool.isType(Tool.TYPE.Object, pluginConf)) throw new TypeError('plugin is not object');
    Reflect.ownKeys(pluginConf).some(m => {
      if (!pluginConf[m].enable){
        return false;
      }
      let dir = void (0);
      try {
        let p = require(pluginConf[m].package);
        Reflect.defineProperty(this.app, m, {
          writable: false,
          configurable: false,
          enumerable: true,
          value: p
        });
        if (Tool.isEmpty(plugin)) return false;
        try {
          Reflect.defineProperty(this.app[m], 'load',{
            writable: false,
            configurable: false,
            enumerable: false,
            value: this.app[m].load
          });
          dir = pluginConf[m].package.split('polix-')[1];
          let conf = require(path.join(plugin, dir));
          this.app[m].load(conf);
        } catch (error) {
          if (error.message !== `Cannot find module '${__dirname}/plugin/${dir}'`){
            log.error(error);
          }
        }
      } catch (error) {
        log.error(error);
      }
    });
  }

  addService(key,service){
    let self = this;
    this._service[key] = service;
    Object.defineProperty(this.service,key,{
      get(){
        self._store[`${enumType.SERVICE}-${key}`] = self._store[`${enumType.SERVICE}-${key}`] || new self._service[key]();
        return self._store[`${enumType.SERVICE}-${key}`];
      },
      set(){
        throw new TypeError(' this function readonly ');
      }
    });
    return this;
  }

  getService(key){
    return this._service[key];
  }

  addController(key,controller){
    let self = this;
    this._controller[key] = controller;
    Object.defineProperty(this.controller,key,{
      get(){
        self._store[`${enumType.CONTROLLER}-${key}`] = self._store[`${enumType.CONTROLLER}-${key}`] || new self._controller[key]();
        return self._store[`${enumType.CONTROLLER}-${key}`];
      },
      set(){
        throw new TypeError(' this function readonly ');
      }
    });
    return this;
  }

  getController(key){
    return this._controller[key];
  }

  list(){
    return { service: this._service, controller: this._controller };
  }

}

let applicetion = new App();

module.exports = applicetion;
