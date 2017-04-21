import steps from './_steps'

export default [

  {
    path: '/error',
    name: 'error',
    component: require('./components/Error.vue')
  },

  {
    path: '/',
    name: 'welcome',
    component: require('./components/Welcome.vue'),
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
    component: require('./components/Step.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/thankyou',
    name: 'thankyou',
    component: require('./components/ThankYou.vue'),
    meta: { requiresAuth: true }
  },

  {
    path: '/signin',
    name: 'signin',
    component: require('./components/Signin.vue'),
    meta: { requiresAnonymous: true }
  }

]
