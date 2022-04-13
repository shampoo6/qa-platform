const {model, Schema} = require('mongoose');

const schema = new Schema({
    account: {type: String, index: true, unique: true},
    pwd: {type: String, index: true},
    nickname: {type: String, index: true},
    pk: {type: String, index: true},
    sk: {type: String, index: true},
    createdAt: {type: Date, index: true, default: new Date()},
    updatedAt: {type: Date, index: true, default: new Date()}
});

module.exports = model('account', schema);