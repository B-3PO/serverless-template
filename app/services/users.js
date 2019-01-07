const User = require('../models/User');
const { ResponseError } = require('../utils');

module.exports = {
  get(id) {
    if (!id) throw ResponseError('get user requires id', 409);
    return User.get(id);
  },

  orders(id, lastKey, limit = 100) {
    if (!id) throw ResponseError('get user requires id', 409);
    return Orders.query('userId').eq(id).startsAt(lastKey).limit(limit).exec();
  },

  async getWithOrders(id, lastKey, limit = 100) {
    if (!id) throw ResponseError('get user requires id', 409);
    const data = await Promise.all([
      User.get(id),
      Orders.query('userId').eq(id).startsAt(lastKey).limit(limit).exec()
    ]);
    if (!data[0] && !data[1].length) return null;

    return Object.assign(data[0] || {}, {
      orders: data[1]
    });
  },

  create(data) {
    if (!data) throw ResponseError('Requires body', 409);
    return User.create(data);
  }
};
