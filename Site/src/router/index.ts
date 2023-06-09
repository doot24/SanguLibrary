import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Login from '../views/Login.vue';
import HomePage from '../views/HomePage.vue';
import UserPage from '../views/UserPage.vue';
import ResourceManagement from '../views/management/ResourceManagement.vue';
import UserManagement from '../views/management/UserManagement.vue';
import NotificationManagement from '../views/management/NotificationManagement.vue';
import Petitions from '../views/Petitions.vue';
import Notifications from '../views/Notifications.vue';
import PetitionManagement from '../views/management/PetitionManagement.vue';
import CheckoutManagement from '../views/management/CheckoutManagement.vue';

import {
  isAuthenticated,
  requireRoles,
  requireAuth,
  redirectIfAuth,
  requireRole,
} from './guards';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: HomePage,
    beforeEnter: requireAuth,
  },
  {
    path: '/login',
    component: Login,
    beforeEnter: redirectIfAuth,
  },
  {
    path: '/user',
    component: UserPage,
    beforeEnter: requireAuth,
  },
  {
    path: '/resourcemanagement',
    component: ResourceManagement,
    beforeEnter: requireRoles(['editor', 'admin']),
  },
  {
    path: '/notificationmanagement',
    component: NotificationManagement,
    beforeEnter: requireRoles(['editor', 'admin']),
  },
  {
    path: '/petitions',
    component: Petitions,
    beforeEnter: requireAuth,
  },
  {
    path: '/notifications',
    component: Notifications,
    beforeEnter: requireAuth,
  },
  {
    path: '/usermanagement',
    component: UserManagement,
    beforeEnter: requireRoles(['admin']),
  },
  {
    path: '/petitionsmanagement',
    component: PetitionManagement,
    beforeEnter: requireRoles(['editor', 'admin', 'employee']),
  },
  {
    path: '/checkoutmanagement',
    component: CheckoutManagement,
    beforeEnter: requireRoles(['editor', 'admin']),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
