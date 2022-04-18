import {createRouter, createWebHistory} from 'vue-router';
import SignIn from '@/views/SignIn.vue';
import store from '@/store';
import home from '@/router/home';

const routes = [
    {
        path: '/signIn',
        name: 'signIn',
        component: SignIn
    },
    {
        path: '/signUp',
        name: 'signUp',
        component: () => import('@/views/SignUp.vue')
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        children: home
    },
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/qaPage/:id',
        name: 'qaPage',
        component: () => import('@/views/QAPage.vue')
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

// 白名单
let whiteList = ['/signIn', '/signUp'];

// 添加路由守卫
router.beforeEach((to, from, next) => {
    if (whiteList.includes(to.path)) next();
    else {
        // 其余页面都需要登录才能访问
        store.dispatch('account/getUserInfo').then(info => {
            if (info.nickname === '') next({name: 'signIn'});
            else next();
        });
    }
});

export default router;
