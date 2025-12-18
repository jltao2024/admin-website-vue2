export default [
    {
        path: '/',
        component: () => import("@/components/Layout/Layout.vue"),
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'Dashboard',
                component: () => import("@/views/Dashboard/Dashboard.vue")
            },
            {
                path: 'users',
                name: 'Users',
                component: () => import("@/views/Users/Users.vue")
            },
            {
                path: 'settings',
                name: 'Settings',
                component: () => import("@/views/Settings/Settings.vue")
            },
            {
                path: 'roles',
                name: 'Roles',
                component: () => import("@/views/Roles/Roles.vue"),
                meta: { requiresPermission: 'role:manage' }
            },
            {
                path: 'logs',
                name: 'Logs',
                component: () => import("@/views/Logs/Logs.vue"),
                meta: { requiresPermission: 'log:manage' }
            },
            // 内容管理系统路由
            {
                path: 'articles',
                name: 'Articles',
                component: () => import("@/views/Articles/Articles.vue"),
                meta: { requiresPermission: 'article:manage' }
            },
            {
                path: 'categories',
                name: 'Categories',
                component: () => import("@/views/Categories/Categories.vue"),
                meta: { requiresPermission: 'category:manage' }
            },
            {
                path: 'tags',
                name: 'Tags',
                component: () => import("@/views/Tags/Tags.vue"),
                meta: { requiresPermission: 'tag:manage' }
            },
            {
                path: 'markdown',
                name: 'Markdown',
                component: () => import("@/views/Markdown/Markdown.vue")
            },
            {
                path: 'flow-chart',
                name: 'FlowChart',
                component: () => import("@/views/FlowChart/FlowChart.vue")
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import("@/views/Login/Login.vue"),
    },
    {
        path: '/error-404',
        name: 'Error404',
        component: () => import("@/views/Error404.vue"),
    },
    {
        path: '/error-403',
        name: 'Error403',
        component: () => import("@/views/Error403.vue"),
    },
    {
        path: '*',
        redirect: '/error-404'
    }
]