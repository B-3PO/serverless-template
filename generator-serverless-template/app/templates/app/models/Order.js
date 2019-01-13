const dynamoose = require('dynamoose');
const uuid = require('uuid/v4');
const { ORDERS_TABLE } = process.env;
const schema = new dynamoose.Schema({
  id: {
    type: String,
    default: uuid,
    hashKey: true
  },
  userId: {
    type: String,
    required: true,
    index: {
      global: true,
      name: 'userId',
    }
  },
  items: Array,
  total: Number
}, { /* table options */ });

module.exports = dynamoose.model(ORDERS_TABLE, schema);
