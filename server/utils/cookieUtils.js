const assert = require('assert');
const Token = require('../models/tokens.js');
const Account = require('../models/accounts.js');

async function getToken(req) {
    let {token: tokenId} = req.cookies;
    const token = await Token.findById(tokenId);
    assert.ok(token, '未登录');
    assert.ok(await Account.exists({_id: token.accountId}), '账号不存在');
    return token;
}

async function getCurrentAccount(req) {
    const token = await getToken(req);
    return Account.findById(token.accountId);
}

module.exports = {
    getToken,
    getCurrentAccount
};