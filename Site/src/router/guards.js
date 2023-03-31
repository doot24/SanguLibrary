import store from '../store/index'

async function isAuthenticated() {
    if (store.getters.GetUser === null) {
        try {
            await store.dispatch('GetProfile');
            return true;
        } catch (error) {
            return false;
        }
    }
    else {
        return true;
    }
}

function requireAuth(to, from, next) {
    isAuthenticated().then((authenticated) => {
        if (authenticated) {
            next();
        } else {
            next({ path: '/login' });
        }
    });
}

function redirectIfAuth(to, from, next) {
    isAuthenticated().then((authenticated) => {
        if (authenticated) {
            next({ path: '/' });
        } else {
            next();
        }
    });
}

function requireRole(role, to, from,) {
    return function(to, from, next) {
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
  
  function requireRoles(roles) {
    return function(to, from, next) {
      isAuthenticated().then((authenticated) => {
        if (authenticated) {
          const userRoles = store.getters.GetUser.roles;
          const match = userRoles.some((userRole) => roles.includes(userRole));
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