const operation = require('./operation');

exports.handler = async (event) => {
    return await operation.redirect(event.short_id);
};