const { Tool } = require('../utils/');

module.exports = {
  polix: Tool.buildEnum({
    SERVICE: 'service',
    CONTROLLER: 'controller',
    MODEL: 'model',
    ENTITY: 'entity',
  }),
  HTTP: Tool.buildEnum({
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete',
    DEL: 'del'
  }),
  PATH: Tool.buildEnum({
    MIDDWARE: 'middware',
    PLUGIN: 'plugin'
  }),
};
