const express = require('express');
const router = express.Router();
const assert = require('assert');
const ah = require('express-async-handler');
const {success} = require('../utils/responseUtils.js');

const PublishQuestion = require('../models/publishQuestions.js');

// 已发布列表
router.post('/list', ah(async (req, res) => {
    const r = await PublishQuestion.find({}).sort({updatedAt: -1});
    res.json(success(r));
}));

module.exports = router;