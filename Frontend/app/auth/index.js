import CloudKit from '../libraries/cloudkit'

const auth = {
    router: {},
    vm: undefined,

    setVm(vm) {
        this.vm = vm
    },

    user: {},

    // CloudKit stuff
    ck: {},
    _ckConfigureCloudKit() {
        CloudKit.configure({
            containers: [{
                containerIdentifier: 'iCloud.com.wwdcscholars.WWDCScholars',
                apiTokenAuth: {
                    apiToken: '953f4dbcd6285a925e8224506af8ceebf1436360bd3b025272a2f732370c19c8',
                    persist: true
                },
                environment: 'development'
            }]
        })

        this.ck.container = CloudKit.getDefaultContainer()
        this._ckSetupAuth()
    },
    _ckSetupAuth() {
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
    _ckGotoAuthenticatedState(userIdentity) {
        console.log('gotoAuthenticatedState', this)
        this.user.isAuthenticated = true

        this.ck.container
            .whenUserSignsOut()
            .then(this._ckGotoUnauthenticatedState.bind(this))

        var database = this.ck.container.getDatabaseWithDatabaseScope(
            CloudKit.DatabaseScope["PUBLIC"]
        );

        database.fetchRecords(userIdentity.userRecordName)
            .then(function(response) {
                if (response.hasErrors) {

                    // Handle the errors in your app.
                    throw response.errors[0];

                } else {
                    var record = response.records[0];
                    var scholarReference = record.fields.scholar;

                    if (scholarReference === undefined) {
                        // Scholar isn't linked yet or doesn't exist at all

                        this.router.replace({
                            name: 'welcome'
                        });

                    } else {
                        // Scholar already exising

                        database.fetchRecords(scholarReference.value.recordName)
                            .then(function(response) {
                                if (response.hasErrors) {

                                    // Handle the errors in your app.
                                    throw response.errors[0];

                                } else {
                                    var scholar = response.records[0];
                                    var wwdcYears = scholar.fields.wwdcYears.value

                                    for (var i = 0; i < wwdcYears.length; i++) {
                                        var obj = wwdcYears[i];

                                        if (obj.recordName === 'WWDC 2017') {
                                        console.log("Contains WWDC 2017, to thankyou");
                                            auth.router.push({ name: 'thankyou' })
                                            return;
                                        }
                                    }
                                }
                            });

                    }
                    // Render the fetched record.
                    console.log("Hi!");
                    console.log(record);
                }
            });
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

        this.router.replace({
            name: 'signin'
        })
    }
}

export default auth
