const express = require('express');
const router = express.Router();
const assert = require('assert');
const ah = require('express-async-handler');
const {success} = require('../utils/responseUtils.js');
const {getToken, getCurrentAccount} = require('../utils/cookieUtils.js');

const QuestionTemplate = require('../models/questionTemplates.js');
const PublishQuestion = require('../models/publishQuestions.js');

// 添加模板
router.post('/add', ah(async (req, res) => {
    let {name} = req.body;
    const token = await getToken(req, res);

    let qt = new QuestionTemplate({
        name,
        accountId: token.accountId,
        nameAndAccountId: name + token.accountId
    });
    await qt.save();
    res.json(success(qt._id));
}));

// 修改模板
router.post('/update', ah(async (req, res) => {
    let {id, name, questions} = req.body;
    let {token: tokenId} = req.cookies;

    const token = await getToken(req, res);

    const update = {
        name,
        updatedAt: new Date(),
    };
    if (Array.isArray(questions))
        update.questions = questions;
    await QuestionTemplate.updateOne({_id: id}, update);

    res.json(success());
}));

// 问卷模板分页查询
router.post('/page', ah(async (req, res) => {
    let {page, size, name} = req.body;
    // 参数校验
    if (typeof name !== 'string') name = '';
    // 模板只能查自己的
    let {token: tokenId} = req.cookies;

    const token = await getToken(req, res);

    // 模糊查询正则表达式
    let regex = new RegExp(`^[\\s\\S]*${name}[\\s\\S]*$`);

    let query = {accountId: token.accountId, name: regex};

    let list = await QuestionTemplate.find(query)
        .limit(size)
        .skip((page - 1) * size)
        .sort({updatedAt: -1});

    let total = await QuestionTemplate.count(query);

    res.json(success({list, total}));
}));

// 删除问卷
router.post('/remove', ah(async (req, res) => {
    let {ids} = req.body;
    assert.ok(Array.isArray(ids) && ids.length > 0, '没有要删除的id');
    await QuestionTemplate.deleteMany({_id: {$in: ids}});
    res.json(success());
}));


// 通过id查询
router.post('/getById', ah(async (req, res) => {
    let {id} = req.body;
    assert.ok(id, 'id不存在');

    const qt = await QuestionTemplate.findById(id);
    assert.ok(qt, '问卷未找到');

    res.json(success(qt));
}));


module.exports = router;