const express = require('express');
const router = express.Router();
const assert = require('assert');
const ah = require('express-async-handler');
const {success} = require('../utils/responseUtils.js');
const {getCurrentAccount, getToken} = require('../utils/cookieUtils');

const PublishQuestion = require('../models/publishQuestions.js');
const QuestionTemplate = require('../models/questionTemplates.js');
const QtAnswer = require('../models/qtAnswers.js');


// 开始答题
router.post('/start', ah(async (req, res) => {
    let {pqId} = req.body;
    // 获取发布信息
    const publishQuestion = await PublishQuestion.findById(pqId);
    assert.ok(publishQuestion, '发布信息不存在');
    // 获取问卷信息
    const questionTemplate = await QuestionTemplate.findById(publishQuestion.qtId);
    // 获取答题人信息
    const account = await getCurrentAccount(req, res);

    // 过滤题目 删除答案
    questionTemplate.questions.forEach(question => {
        delete question['right'];
        delete question['rights'];
    });

    const qtAnswer = new QtAnswer({
        name: questionTemplate.name,
        qtId: questionTemplate._id,
        creatorId: publishQuestion.accountId,
        accountId: account._id,
        nickname: account.nickname,
        questions: questionTemplate.questions,
        qtIdAndAccountId: questionTemplate._id + account._id
    });

    await qtAnswer.save();

    res.json(success(qtAnswer._id));
}));


// 查找问卷
router.post('/getById', ah(async (req, res) => {
    let {id} = req.body;

    const qtAnswer = await QtAnswer.findById(id);

    assert.ok(qtAnswer, '问题不存在');

    res.json(success(qtAnswer));
}));

// 交卷
router.post('/submit', ah(async (req, res) => {
    let {id, answers} = req.body;
    const qtAnswer = await QtAnswer.findById(id);
    assert.ok(qtAnswer, '未找到卷子');
    assert.ok(!qtAnswer.done, '问卷不能重复提交');
    const token = await getToken(req, res);
    assert.ok(qtAnswer.accountId === token.accountId, '不能提交不是自己的卷子');


    // 显示正确答案
    // 查找原题
    const questionTemplate = await QuestionTemplate.findById(qtAnswer.qtId);
    assert.ok(questionTemplate, '原题模板不存在');
    let questions = questionTemplate.questions;

    // 算分
    for (let i = 0; i < qtAnswer.questions.length; i++) {
        const q = questions[i];
        let answer = answers[i];

        // 判断是否正确
        if (q.type === 'single') {
            if (q.right === answer) {
                // 答对了
                qtAnswer.score += q.score;
            } else {
                q.wrong = true;
            }
        } else {
            // 多选需要判断所有内容都在正确答案中
            // 多选不得分
            // 少选得一半分

            // 判断有没有多选 或者一个都没选
            if (answer.length === 0 || answer.length > q.rights.length) {
                q.wrong = true; // 设置错误选项
                continue;
            }
            // 判断是否每个选项都在正确答案中
            let right = true; // 零时变量 用来判断是否正确
            answer.every(a => {
                right = q.rights.includes(a);
                return right;
            });
            if (right) {
                q.wrong = answer.length !== q.rights.length;
                // 若选项都正确，判断是否有漏选
                qtAnswer.score += answer.length === q.rights.length ? q.score : (q.score * 0.5);
            } else {
                q.wrong = true;
            }
        }
    }

    qtAnswer.done = true;
    qtAnswer.questions = questions;
    qtAnswer.updatedAt = new Date();
    qtAnswer.answers = answers;


    await qtAnswer.save();

    res.json(success());
}));


// 分页查询
router.post('/page', ah(async (req, res) => {
    let {page, size, name} = req.body;
    if (typeof page !== 'number') page = 1;
    if (typeof size !== 'number') size = 5;
    if (typeof name !== 'string') name = '';

    const token = await getToken(req, res);
    let regex = new RegExp(`^[\\s\\S]*${name}[\\s\\S]*$`);
    let query = {accountId: token.accountId, name: regex};
    let list = await QtAnswer.find(query).limit(size).skip((page - 1) * size).sort({updatedAt: -1});
    let total = await QtAnswer.count(query);

    res.json(success({list, total}));
}));


// 通过 questionTemplate id 查找参与答题人的列表
router.post('/listByQtId', ah(async (req, res) => {
    let {qtId} = req.body;
    res.json(success(await QtAnswer.find({qtId})));
}));


// 通过 publishQuestion id 查找参与答题人的列表
router.post('/listByPqId', ah(async (req, res) => {
    let {pqId} = req.body;
    let pq = await PublishQuestion.findById(pqId);
    assert.ok(pq, '发布的题目不存在');
    res.json(success(await QtAnswer.find({qtId: pq.qtId})));
}));

module.exports = router;