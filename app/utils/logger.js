// logger
// this should be used in place of console
// use .info in place of .log
const pino = require('pino');

module.exports = pino({
  level: process.env.LOG_LEVEL || 'info',
  prettyPrint: process.env.NODE_ENV !== 'production'
});
