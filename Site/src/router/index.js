import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/Login.vue'
import HomePage from '../views/HomePage.vue'
import UserPage from '../views/UserPage.vue'
import BookManagement from '../views/management/BookManagement.vue'
import UserManagement from '../views/management/UserManagement.vue'
import NotificationManagement from '../views/management/NotificationManagement.vue'
import Petitions from '../views/Petitions.vue'
import Notifications from '../views/Notifications.vue'
import PetitionManagement from '../views/management/PetitionManagement.vue'

import {
    isAuthenticated,
    requireAuth,
    redirectIfAuth,
    requireRole
} from './guards';


const routes = [
    {
        path: '/',
        component: HomePage,
        beforeEnter: requireAuth
    },
    {
        path: '/login',
        component: Login,
        beforeEnter: redirectIfAuth
    },
    {
        path: '/user',
        component: UserPage,
        beforeEnter: requireAuth
    },
    {
        path: '/bookmanagement',
        component: BookManagement,
        beforeEnter: requireRole('editor')
    },
    {
        path: '/notificationmanagement',
        component: NotificationManagement,
        beforeEnter: requireRole('admin')
    },
    {
        path: '/petitions',
        component: Petitions,
        beforeEnter: requireAuth
    },
    {
        path: '/notifications',
        component: Notifications,
        beforeEnter: requireAuth
    },
    {
        path: '/usermanagement',
        component: UserManagement,
        beforeEnter: requireRole('admin')
    },
    {
        path: '/petitionsmanagement',
        component: PetitionManagement,
        beforeEnter: requireRole('admin')
    }
]



const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router