const {model, Schema} = require('mongoose');

const schema = new Schema({
    pk: {type: String, index: true},
    sk: {type: String, index: true},
    createdAt: {type: Date, index: true, default: new Date()},
    updatedAt: {type: Date, index: true, default: new Date()}
});

module.exports = model('key', schema);