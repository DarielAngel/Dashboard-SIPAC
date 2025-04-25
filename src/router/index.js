import { createRouter, createWebHistory } from 'vue-router';
import authService from '../services/auth.service';

// Importar vistas
import Dashboard from '../views/Dashboard.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Profile from '../views/Profile.vue';

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/tables',
    name: 'Tables',
    component: () => import('../views/tables.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/billing',
    name: 'Billing',
    component: () => import('../views/billing.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/virtual-reality',
    name: 'VirtualReality',
    component: () => import('../views/virtual-reality.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/rtl',
    name: 'RTL',
    component: () => import('../views/rtl.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guardia de navegación para proteger rutas
// Asegúrate de que el guardia de navegación esté funcionando correctamente
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  if (requiresAuth && !authService.isAuthenticated()) {
    console.log('Ruta protegida, redirigiendo a login');
    next('/login');
  } else {
    // Si el usuario está autenticado y va a login, redirigir al dashboard
    if (to.path === '/login' && authService.isAuthenticated()) {
      next('/dashboard');
    } else {
      next();
    }
  }
});

export default router;