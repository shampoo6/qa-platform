const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const {fail} = require('./utils/responseUtils.js');


const app = express();
const port = 1024;

const accountRouter = require('./routers/accountRouter.js');
const questionTemplateRouter = require('./routers/questionTemplateRouter.js');

app.use(cookieParser('this is secret key'));

app.use('/', express.static(path.join(__dirname, './public')));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// 引入routers
app.use('/account', accountRouter);
app.use('/questionTemplate', questionTemplateRouter);


// 统一异常处理
app.use((err, req, res, next) => {
    console.error(err);
    res.json(fail(err.message, err.stack));
});

app.listen(port, () => {
    console.log(`server start on: http://127.0.0.1:${port}`);
    mongoose.connect('mongodb://admin:111111@192.168.0.194:27017/qa-db');
    const db = mongoose.connection;
    db.once('open', () => {
        console.log('数据库已连接');
    });
    db.on('error', console.error.bind(console, 'this is db error: '));
});