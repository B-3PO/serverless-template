// handles thrown erros
// converts thrown erros to error responses
const logger = require('./logger');

const devEnvs = ['dev', 'development', 'test', 'sandbox', 'debug'];

module.exports = (fn) => (event, context) => {
  // This checks if the event is a scheduled event and immediately returns to keep endpoint warm
  if (event.source && event.source === 'aws.events') return {};

  return fn(event, context)
    .then(response => {
      // TODO add endpoint logging
      
      // headers to all responses
      if (!response.headers) response.headers = {};
      // this header is required for cors to work
      response.headers['Access-Control-Allow-Origin'] = '*';
      if (response.body && typeof response.body === 'object') response.body = JSON.stringify(response.body);
      return response;
    })
    .catch(e => {
      logger.error(e.stack);
      const errorBody = { errorMessage: e.message };

      // add stacktrace if not in production
      if (devEnvs.includes(process.env.NODE_ENV)) {
        errorBody.errorType = 'Error';
        errorBody.stackTrace = e.stack.split('\n').map(line => line.trim());
      }

      const response = {
        statusCode: e.statusCode || 500,
        body: JSON.stringify(errorBody)
      };

      return response;
    });
};
