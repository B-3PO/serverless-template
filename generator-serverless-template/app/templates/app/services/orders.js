const Order = require('../models/Order');
const { ResponseError } = require('../utils');

module.exports = {
  get(id) {
    if (!id) throw ResponseError('get order requires id', 409);
    return Order.get(id);
  },

  create(data) {
    if (!data) throw ResponseError('Requires body', 409);
    return Order.create(data);
  }
};
