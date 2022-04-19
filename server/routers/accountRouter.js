const express = require('express');
const router = express.Router();
const assert = require('assert');
const ah = require('express-async-handler');
const NodeRSA = require('node-rsa');
const MD5 = require('crypto-js/md5.js');
const moment = require('moment');
const {success} = require('../utils/responseUtils.js');

const Key = require('../models/keys.js');
const Account = require('../models/accounts.js');
const Token = require('../models/tokens.js');
const {getToken, getCurrentAccount} = require('../utils/cookieUtils');

// 注册
router.post('/signUp', ah(async (req, res) => {
    // 获取参数
    let {pk, account, nickname, pwd} = req.body;
    // 查询pk对应的key
    const key = await Key.findOne({pk});
    let instance;
    try {
        let k = new NodeRSA({b: 512});
        // 使用sk解密 导入key的sk
        k.importKey(key.sk);
        // 解密
        pwd = k.decrypt(Buffer.from(pwd)).toString();
        // 重新通过md5加密
        pwd = MD5(pwd).toString();

        // 账号查重
        assert.ok(!await Account.exists({account}), '账号已存在');

        // 创建账号
        instance = new Account({
            account,
            pwd,
            nickname,
            pk: key.pk,
            sk: key.sk
        });

        await instance.save();
    } finally {
        // 最后删除key
        if (key)
            await Key.deleteOne({_id: key._id});
    }

    res.json(success(instance?._id));
}));

// 获取key
router.post('/getPk', ah(async (req, res) => {
    const key = new NodeRSA({b: 512});
    key.generateKeyPair(2048, 65537);

    const pk = key.exportKey('pkcs1-public');
    const sk = key.exportKey('pkcs1-private');

    let keyInstance = new Key({
        pk,
        sk
    });

    await keyInstance.save();

    res.json(success(pk));
}));

// 通过账号查询pk
router.post('/getPkByAccount', ah(async (req, res) => {
    let {account} = req.body;
    account = await Account.findOne({account});
    assert.ok(account, '账号不存在');
    res.json(success(account.pk));
}));

// 登录
router.post('/signIn', ah(async (req, res) => {
    let {account, pwd} = req.body;
    // 查找账号
    account = await Account.findOne({account});
    assert.ok(account, '账号不存在');
    // 解密密码
    let k = new NodeRSA({b: 512});
    // 使用sk解密 导入key的sk
    k.importKey(account.sk);
    // 解密
    pwd = k.decrypt(Buffer.from(pwd)).toString();
    // 重新通过md5加密
    pwd = MD5(pwd).toString();

    assert.ok(pwd === account.pwd, '密码错误');

    // 登录成功添加token
    // 一人只有一张票
    let tomorrow = moment().add(1, 'd').toDate();
    const token = await Token.findOneAndUpdate({accountId: account._id}, {
        updatedAt: new Date(),
        expired: tomorrow,
    }, {
        // 若没有查找到对应数据就添加新数据
        upsert: true,
        // 返回更新后的数据
        new: true
    });

    res.cookie('token', token._id, {maxAge: tomorrow.getTime() - Date.now()});
    res.json(success());
}));

// 登出
router.post('/signOut', ah(async (req, res) => {
    const token = await getToken(req, res);
    // 删除
    await Token.findByIdAndDelete(token._id);
    res.cookie('token', null, {maxAge: 0});
    res.json(success());
}));

// 获取账号信息
router.post('/info', ah(async (req, res) => {
    const account = await getCurrentAccount(req, res)
    res.json(success({nickname: account.nickname}));
}));

module.exports = router;