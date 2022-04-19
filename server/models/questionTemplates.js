const {model, Schema} = require('mongoose');

// 题目和答案都没有key，使用索引充当key
let question = {
    question: '题目',
    score: '分数',
    type: '题目类型(单选，多选)',
    options: ['带选项'],
    rights: ['多选题正确项索引'],
    right: '单选的答案'
}

const schema = new Schema({
    name: {type: String, index: true}, // 问卷名称
    accountId: {type: String, index: true}, // 发布者id
    questions: {type: Array, index: true, default: []}, // 问题集
    // 问卷名 + 出题人id    规定同一个人不能创建两个同名的问卷
    nameAndAccountId: {type: String, index: true, unique: true},
    createdAt: {type: Date, index: true, default: new Date()},
    updatedAt: {type: Date, index: true, default: new Date()}
});

// 问卷模板表
module.exports = model('question-template', schema);