const {model, Schema} = require('mongoose');

const schema = new Schema({
    name: {type: String, index: true}, // 问卷名称
    accountId: {type: String, index: true}, // 发布者id
    createdAt: {type: Date, index: true, default: new Date()},
    updatedAt: {type: Date, index: true, default: new Date()}
});

// 问卷模板表
module.exports = model('questionTemplate', schema);