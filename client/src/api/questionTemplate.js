import request from './request.js';

export default {
    page(page, size, name) {
        return request.post('/questionTemplate/page', {page, size, name});
    },
    add(name) {
        return request.post('/questionTemplate/add', {name});
    },
    update(id, name, questions) {
        return request.post('/questionTemplate/update', {id, name, questions});
    },
    remove(ids) {
        return request.post('/questionTemplate/remove', {ids});
    },
    getById(id) {
        return request.post('/questionTemplate/getById', {id});
    }
};