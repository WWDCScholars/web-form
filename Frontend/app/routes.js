import steps from './_steps'

export default [

  {
    path: '/',
    name: 'welcome',
    component: require('./components/Welcome.vue')
  },
  {
    path: '/step',
    redirect: '/step/' + steps[0].slug
  },
  {
    path: '/step/:step',
    name: 'step',
    component: require('./components/Step.vue')
  },
  {
    path: '/thankyou',
    name: 'thankyou',
    component: require('./components/ThankYou.vue')
  }

]
