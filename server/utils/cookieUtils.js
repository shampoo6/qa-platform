const assert = require('assert');
const Token = require('../models/tokens.js');
const Account = require('../models/accounts.js');
const moment = require('moment');

async function getToken(req, res) {
    let {token: tokenId} = req.cookies;
    assert.ok(tokenId, '未登录');
    const token = await Token.findById(tokenId);
    assert.ok(token, '未登录');

    // 判断数据库中 token 是否超时
    if (moment(token.expired).isBefore(moment())) {
        // 已超时

        // 删除 token
        await Token.findByIdAndDelete(token._id);
        res.cookie('token', null, {maxAge: 0});
        // 抛出异常
        throw new Error('登录超时');
    }

    return token;
}

async function getCurrentAccount(req, res) {
    const token = await getToken(req, res);
    assert.ok(await Account.exists({_id: token.accountId}), '账号不存在');
    return Account.findById(token.accountId);
}

module.exports = {
    getToken,
    getCurrentAccount
};