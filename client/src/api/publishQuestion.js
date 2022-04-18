import request from '@/api/request.js';

export default {
    publish(id) {
        return request.post('/publishQuestion/publish', {id});
    },
    list() {
        return request.post('/publishQuestion/list');
    },
    close(id) {
        return request.post('/publishQuestion/close', {id});
    }
};