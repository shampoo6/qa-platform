import request from '@/api/request.js';

export default {
    getPk() {
        return request.post('/account/getPk');
    },
    signUp(account, pwd, nickname, pk) {
        let key = new NodeRSA({b: 512});
        key.importKey(pk, 'pkcs1-public');
        pwd = key.encrypt(pwd);
        return request.post('/account/signUp', {account, pwd, nickname, pk});
    },
    getPkByAccount(account) {
        return request.post('/account/getPkByAccount', {account});
    },
    async signIn(account, pwd) {
        // 获取pk
        const pk = await this.getPkByAccount(account);
        // 加密
        let key = new NodeRSA({b: 512});
        key.importKey(pk, 'pkcs1-public');
        pwd = key.encrypt(pwd);
        // 发送请求
        return request.post('/account/signIn', {account, pwd});
    },
    signOut() {
        return request.post('/account/signOut');
    },
    getInfo() {
        return request.post('/account/info')
    }
};