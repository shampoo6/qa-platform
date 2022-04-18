const {model, Schema} = require('mongoose');

const schema = new Schema({
    qtId: {type: String, index: true}, // 问卷id
    name: {type: String, index: true}, // 发布问卷时的名称
    accountId: {type: String, index: true}, // 发布人id
    nickname: {type: String, index: true}, // 发布时 发布人的昵称
    // 账号id+问卷id的组合 用来充当唯一键 同一个人同一个问卷只能发布一次
    accountIdAndQtId: {type: String, index: true, unique: true},
    createdAt: {type: Date, index: true, default: new Date()},
    updatedAt: {type: Date, index: true, default: new Date()}
});

// 问卷大厅
// 发布的问题表
module.exports = model('publish-question', schema);