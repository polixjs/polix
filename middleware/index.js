const log = require('./log');
const bodyParse = require('./body');

exports.bind = function(app){
  app.use(log())
    .use(bodyParse())
}