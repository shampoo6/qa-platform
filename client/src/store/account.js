import accountsApi from '@/api/accounts.js';

export default {
    strict: true,
    namespaced: true,
    state() {
        return {
            userInfo: {
                nickname: ''
            }
        };
    },
    mutations: {
        mUserInfo(state, payload) {
            state.userInfo = payload;
        }
    },
    actions: {
        async getUserInfo({commit, state}) {
            if (state.userInfo.nickname === '') {
                let info;
                try {
                    info = await accountsApi.getInfo();
                } catch (e) {
                }
                if (info)
                    commit('mUserInfo', info);
            }
            return state.userInfo;
        }
    }
};