import CloudKit from '../libraries/cloudkit'

const auth = {
  router: {},
  vm: undefined,

  setVm (vm) {
    this.vm = vm
  },

  user: {},

  // CloudKit stuff
  ck: {},
  _ckConfigureCloudKit () {
    CloudKit.configure({
      containers: [{
        containerIdentifier: 'iCloud.de.moritzsternemann.TIL',
        apiTokenAuth: {
          apiToken: 'd9d92006d77e1e706b833d78d371f4c1815f59027d7b1f46edebfc0e78b8a751',
          persist: true
        },
        environment: 'development'
      }]
    })

    this.ck.container = CloudKit.getDefaultContainer()
    this._ckSetupAuth()
  },
  _ckSetupAuth () {
    this.ck.container.setUpAuth().then((userIdentity) => {
      // console.log('setUpAuth')
      if (userIdentity) {
        this.user = userIdentity
        this._ckGotoAuthenticatedState(userIdentity)
      } else {
        this._ckGotoUnauthenticatedState()
      }
    })
  },
  _ckGotoAuthenticatedState (userIdentity) {
    // console.log('gotoAuthenticatedState', this)
    const name = userIdentity.nameComponents
    if (name) {
      // console.log('NAME', name.givenName + ' ' + name.familyName)
    } else {
      // console.log('NAME', userIdentity.userRecordName)
    }
    this.user.isAuthenticated = true

    this.ck.container
      .whenUserSignsOut()
      .then(this._ckGotoUnauthenticatedState.bind(this))

    this.router.replace({ name: 'welcome' })
  },
  _ckGotoUnauthenticatedState(error) {
    // console.log('gotoUnauthenticatedState', this)

    if (error && error.ckErrorCode === 'AUTH_PERSIST_ERROR') {
      console.error('ERROR', error)
    }

    this.ck.container
      .whenUserSignsIn()
      .then(this._ckGotoAuthenticatedState.bind(this))
      .catch(this._ckGotoUnauthenticatedState.bind(this))
  }
}

export default auth
