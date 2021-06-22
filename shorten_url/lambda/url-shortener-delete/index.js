const operation = require('./operation');

exports.handler = async (event) => {
  // TODO: if short_id not exist
  return await operation.deleteUrl(event.short_id);
};
