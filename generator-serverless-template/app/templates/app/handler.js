const {
  users,
  orders
} = require('./services');
const {
  asyncEndpoint,
  swaggerHandler
} = require('./utils');

// use local dynamo when not in production
if (process.env.NODE_ENV !== 'production') require('dynamoose').local('http://localhost:8000');


// swager ui for docs
exports.swagger = swaggerHandler('/swagger-ui');


// --- Accounts ---
exports.getUser = asyncEndpoint(async event => {
  const { id } = event.pathParameters || {};
  const user = await users.get(id);
  return { body: { user } };
});

exports.createUser = asyncEndpoint(async event => {
  const { body } = event;
  const user = await users.create(JSON.parse(body || '{}'));
  return { body: { user } };
});

exports.getUserOrders = asyncEndpoint(async event => {
  const { id } = event.pathParameters || {};
  const { lastkey, limit } = event.queryStringParameters || {};
  const orders = await users.orders(id, lastkey, limit);
  return { body: { orders } };
});



// --- Orders ---

exports.getOrder = asyncEndpoint(async event => {
  const { id } = event.pathParameters || {};
  const order = await orders.get(id);
  return { body: { order } };
});

exports.createOrder = asyncEndpoint(async event => {
  const { body } = event;
  const order = await orders.create(JSON.parse(body || '{}'));
  return { body: { order } };
});
