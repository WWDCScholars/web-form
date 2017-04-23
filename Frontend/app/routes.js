import steps from './_steps'

export default [

  {
    path: '/error',
    name: 'error',
    component: require('./components/pages/Error.vue')
  },

  {
    path: '/',
    name: 'welcome',
    component: require('./components/pages/Welcome.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/step',
    redirect: '/step/' + steps[1].slug,
    meta: { requiresAuth: true }
  },
  {
    path: '/step/:step',
    name: 'step',
    component: require('./components/pages/Step.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/thankyou',
    name: 'thankyou',
    component: require('./components/pages/ThankYou.vue'),
    meta: { requiresAuth: true }
  },

  {
    path: '/signin',
    name: 'signin',
    component: require('./components/pages/Signin.vue'),
    meta: { requiresAnonymous: true }
  },
  {
    path: '/link',
    name: 'link',
    component: require('./components/pages/Link.vue'),
    meta: { requiresAuth: true }
  }

]
