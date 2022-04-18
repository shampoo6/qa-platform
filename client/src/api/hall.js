import request from '@/api/request.js';

export default {
    // 拉取所有已发布的问卷
    list() {
        return request.post('/hall/list');
    }
};