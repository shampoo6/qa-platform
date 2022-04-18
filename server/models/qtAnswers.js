const {model, Schema} = require('mongoose');

const schema = new Schema({
    done: {type: Boolean, index: true, default: false}, // 是否已经交卷
    name: {type: String, index: true}, // 问卷名称
    qtId: {type: String, index: true}, // 问卷id
    creatorId: {type: String, index: true}, // 出题人id
    accountId: {type: String, index: true}, // 答题人id
    nickname: {type: String, index: true}, // 答题人昵称
    questions: {type: Array, index: true}, // 问题集
    answers: {type: Array, index: true, default: []}, // 答案集
    score: {type: Number, index: true, default: 0}, // 得分
    // 问卷id+答题人id 作为唯一键 同一个人同一张问卷只能答一次
    qtIdAndAccountId: {type: String, index: true, unique: true},
    createdAt: {type: Date, index: true, default: new Date()},
    updatedAt: {type: Date, index: true, default: new Date()}
});

// 答题问卷表
module.exports = model('qt-answer', schema);