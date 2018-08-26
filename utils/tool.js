const moment = require('moment');
const _ = require('./lodash');

/**
 * 判断对象类型
 * eg:
 * let isPass = isType('String','hello'); // true
 * isPass = isType('Number',1); // true
 * 结合TYPE枚举
 * let isPass = isType(TYPE.String,'hello'); // true
 * isPass = isType(TYPE.Number,1); // true
 * @param {类型字符串} type
 */
exports.isType = function (type, obj) {
  return Object.prototype.toString.call(obj) === `[object ${type}]`
};

/**
 * 生成defineProperties参数
 * @param args 属性数组
 * @param conf 数据属性配置
 */
exports.buildProperties = function(args,conf){
  let obj = {};
  if(!exports.isType('Array',args)){
    throw new TypeError(`'${args}' is not Array`);
  }
  args.map(item => {
    conf = JSON.parse(JSON.stringify(conf));
    conf.value = item;
    obj[item] = conf;
  });
  return obj;
};


/**
 * toString类型
*/
exports.TYPE = Object.defineProperties({},exports.buildProperties(
  ['Array','Object','String','Function','Number','Boolean','Symbol','Undefined'],
  {
    enumerable: true,
    configurable: false,
    writable: false
  }
));

/**
 * 生成只读enum对象
 * @param {枚举基类} obj
 */
exports.buildEnum = function(obj) {
  return new Proxy(obj, {
    get(target, prop) {
      if (target[prop]) {
        return Reflect.get(target, prop);
      } else {
        throw new ReferenceError(`Unknown enum '${prop}'`);
      }
    },
    set() {
      throw new TypeError('Enum is readonly');
    },
    deleteProperty() {
      throw new TypeError('Enum is readonly');
    }
  });
};

/**
 * 转换日期
 * "2018-03-16T10:20:30.000Z" => 2018-03-10 09:30:26
 * @param {日期字符} dateStr
 */
exports.format = function(dateStr,type){
  return moment(Date.parse(dateStr)).format(type || 'YYYY-MM-DD HH:mm:ss');
};

/**
 * 首字母大写
 * @param {字符串} str
 */
exports.firstUpperCase = function(str){
  if(!exports.isType(exports.TYPE.String,str)) throw new TypeError(`${str} is not string`);
  return str.replace(/^\S/,function(s){
    return s.toUpperCase();
  });
};

/**
 * 将 callback 转换成 promise
 * 约定: callback 模式下 回调参数只能有2个参数 第一个为err 第二个为实际对象
 * sum: 求和函数
 * sum(1, 2, 3, function(err, data){ console.log(data) }) => 6
 * promisify(sum, 1, 2, 3).then(function(data){ console.log(data) }) => 6
 * @return {Promise}
 */
exports.promisify = function () {
  const fn = arguments[0];
  const args = _.toArray(arguments).slice(1);
  return new Promise((resolve, reject) => {
    function callback(err, data) {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    }

    args.push(callback);

    fn.apply(null, args);
  });
};

/**
 * 判断对象是否为初始值
 * @param  {[type]} obj 对象
 * @return {[type]}     是否为初始值
 */
exports.isEmpty = function () {
  for (let obj of arguments) {
    if (obj === null || obj === undefined) {
      return true;
    } else if (exports.isType(exports.TYPE.String, obj) && obj.trim() === ''){
      return true;
    }
  }
  return false;
};
