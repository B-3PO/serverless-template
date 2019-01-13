const StaticFileHandler = require('serverless-aws-static-file-handler');
const { SwaggerUIBundle, SwaggerUIStandalonePreset } = require('swagger-ui-dist');
const pathToSwaggerUi = require('swagger-ui-dist').absolutePath()

module.exports = rootPath => (event, context, callback) => {
  let root = pathToSwaggerUi;
  if (event.path === rootPath) event.path = 'index.html';
  if (event.path === '/openapi.json') root = './';
  new StaticFileHandler(root)
    .get(event, context)
    .then(response => callback(null, response))
    .catch(err => callback(err))
};
