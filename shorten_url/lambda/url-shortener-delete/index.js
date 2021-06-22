const operation = require('./operation');

exports.handler = async (event) => {
  return await operation.deleteUrl(event.short_id);
};
