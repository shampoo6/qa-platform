const {model, Schema} = require('mongoose');

let question = {
    question: '题目',
    score: '分数',
    type: '题目类型(单选，多选)',
    options: [
        // 待选项
        {
            label: '提示文本',
            right: '是否是正确答案'
        }
    ]
}

const schema = new Schema({
    name: {type: String, index: true}, // 问卷名称
    accountId: {type: String, index: true}, // 发布者id
    questions: {type: Array, index: true, default: []}, // 问题集
    createdAt: {type: Date, index: true, default: new Date()},
    updatedAt: {type: Date, index: true, default: new Date()}
});

// 问卷模板表
module.exports = model('questionTemplate', schema);