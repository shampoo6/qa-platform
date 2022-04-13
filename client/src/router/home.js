import My from '@/views/My/My.vue';

export default [
    {
        path: 'my',
        name: 'my',
        component: My,
        meta: {title: '我的问卷', key: 'my'},
        children: [
            {
                path: 'questionTemplate',
                name: 'questionTemplate',
                meta: {title: '问卷管理', key: 'questionTemplate'},
                component: () => import('@/views/My/QuestionTemplate/QuestionTemplate.vue')
            },
            {
                path: 'questionTemplate/question',
                name: 'question',
                meta: {subtitle: '问题管理', key: 'question'},
                component: () => import('@/views/My/QuestionTemplate/Question/Question.vue')
            },
            {
                path: 'questionTemplate/question/answer',
                name: 'questionAnswer',
                meta: {subtitle: '答案管理'},
                component: () => import('@/views/My/QuestionTemplate/Question/Answer/Answer.vue')
            },
            {
                path: 'publish',
                name: 'publish',
                meta: {title: '发布管理', key: 'publish'},
                component: () => import('@/views/My/Publish/Publish.vue')
            },
            {
                path: 'publish/parties',
                name: 'parties',
                meta: {subtitle: '答题者列表'},
                component: () => import('@/views/My/Publish/Parties/Parties.vue')
            },
            {
                path: 'publish/parties/answer',
                name: 'partyAnswer',
                meta: {subtitle: '答题者答案'},
                component: () => import('@/views/My/Publish/Parties/Answer/Answer.vue')
            },
        ]
    },
    {
        path: 'hall',
        name: 'hall',
        meta: {title: '问卷大厅', key: 'hall'},
        component: () => import('@/views/QuestionHall.vue')
    },
];