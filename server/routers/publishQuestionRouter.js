const express = require('express');
const router = express.Router();
const assert = require('assert');
const ah = require('express-async-handler');
const {success} = require('../utils/responseUtils.js');
const {getToken, getCurrentAccount} = require('../utils/cookieUtils.js');

const QuestionTemplate = require('../models/questionTemplates.js');
const PublishQuestion = require('../models/publishQuestions.js');

// 发布问卷
router.post('/publish', ah(async (req, res) => {
    let {id} = req.body;
    assert.ok(id, 'id不存在');

    // 获取发布人信息
    const account = await getCurrentAccount(req, res);

    // 获取问卷信息
    const qt = await QuestionTemplate.findById(id);
    assert.ok(qt, '问卷未找到');

    const pq = new PublishQuestion({
        qtId: qt._id,
        name: qt.name,
        accountId: account._id,
        nickname: account.nickname,
        accountIdAndQtId: account._id + qt._id,
    });

    await pq.save();

    res.json(success(pq._id));
}));


// 已发布列表
router.post('/list', ah(async (req, res) => {
    // 获取发布人信息
    const token = await getToken(req, res);
    const r = await PublishQuestion.find({accountId: token.accountId}).sort({updatedAt: -1});
    res.json(success(r));
}));


// 关闭已发布的问卷
router.post('/close', ah(async (req, res) => {
    let {id} = req.body;
    const token = await getToken(req, res);
    // 只允许关闭自己发布的问卷
    await PublishQuestion.deleteOne({_id: id, accountId: token.accountId});
    res.json(success());
}));

module.exports = router;