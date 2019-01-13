const dynamoose = require('dynamoose');
const uuid = require('uuid/v4');
const { USER_TABLE } = process.env;
const schema = new dynamoose.Schema({
  id: {
    type: Number,
    default: uuid,
    hashKey: true
  },
  name: String,
  email: String
}, { /* table options */ });

module.exports = dynamoose.model(USER_TABLE, schema);
