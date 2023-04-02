import store from '../store/index'
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

async function isAuthenticated(): Promise<boolean> {
  if (store.getters.GetUser === null) {
    try {
      await store.dispatch('GetProfile');
      return true;
    } catch (error) {
      return false;
    }
  } else {
    return true;
  }
}

function requireAuth(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void {
  isAuthenticated().then((authenticated) => {
    if (authenticated) {
      next();
    } else {
      next({ path: '/login' });
    }
  });
}

function redirectIfAuth(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void {
  isAuthenticated().then((authenticated) => {
    if (authenticated) {
      next({ path: '/' });
    } else {
      next();
    }
  });
}

function requireRole(role: string) {
  return function(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void {
    isAuthenticated().then((authenticated) => {
      if (authenticated) {
        if (store.getters.GetUser.roles.includes(role)) {
          next();
        } else {
          next({ path: '/' });
        }
      } else {
        next({ path: '/login' });
      }
    });
  }
}

function requireRoles(roles: string[]) {
  return function(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void {
    isAuthenticated().then((authenticated) => {
      if (authenticated) {
        const userRoles : any = store.getters.GetUser.roles;
        const match = userRoles.some((userRole: string) => roles.includes(userRole));
        if (match) {
          next();
        } else {
          next({ path: '/' });
        }
      } else {
        next({ path: '/login' });
      }
    });
  }
}

export {
  isAuthenticated,
  requireAuth,
  redirectIfAuth,
  requireRole,
  requireRoles
};
