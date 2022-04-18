import request from '@/api/request.js';

export default {
    // 开始答题
    start(pqId) {
        return request.post('/qtAnswer/start', {pqId});
    },
    getById(id) {
        return request.post('/qtAnswer/getById', {id});
    },
    // 交卷
    submit(id, answers) {
        return request.post('/qtAnswer/submit', {id, answers});
    },
    page(page, size, name) {
        return request.post('/qtAnswer/page', {page, size, name});
    },
    listByQtId(qtId) {
        return request.post('/qtAnswer/listByQtId', {qtId});
    },
    listByPqId(pqId) {
        return request.post('/qtAnswer/listByPqId', {pqId});
    },
};