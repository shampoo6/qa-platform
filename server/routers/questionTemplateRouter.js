const express = require('express');
const router = express.Router();
const assert = require('assert');
const ah = require('express-async-handler');
const {success} = require('../utils/responseUtils.js');

const QuestionTemplate = require('../models/questionTemplates.js');
const Account = require('../models/accounts.js');
const Token = require('../models/tokens.js');

// 添加模板
router.post('/add', ah(async (req, res) => {
    let {name} = req.body;
    let {token: tokenId} = req.cookies;

    const token = await Token.findById(tokenId);
    assert.ok(token, '未登录');
    assert.ok(await Account.exists({_id: token.accountId}), '账号不存在');

    let qt = new QuestionTemplate({
        name,
        accountId: token.accountId
    });
    await qt.save();

    res.json(success(qt._id));
}));

// 修改模板
router.post('/update', ah(async (req, res) => {
    let {id, name} = req.body;
    let {token: tokenId} = req.cookies;

    const token = await Token.findById(tokenId);
    assert.ok(token, '未登录');
    assert.ok(await Account.exists({_id: token.accountId}), '账号不存在');

    await QuestionTemplate.updateOne({_id: id}, {name, updatedAt: new Date()});

    res.json(success());
}));

// 问卷模板分页查询
router.post('/page', ah(async (req, res) => {
    let {page, size, name} = req.body;
    // 参数校验
    if (typeof name !== 'string') name = '';
    // 模板只能查自己的
    let {token: tokenId} = req.cookies;
    const token = await Token.findById(tokenId);
    assert.ok(token, '未登录');
    assert.ok(await Account.exists({_id: token.accountId}), '账号不存在');

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

module.exports = router;