import { serializeSteps } from './stephandling'

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
    this.CloudKit = window.CloudKit
    this.CloudKit.configure({
      containers: [{
        // containerIdentifier: 'iCloud.de.moritzsternemann.TIL',
        containerIdentifier: 'iCloud.com.wwdcscholars.WWDCScholars',
        apiTokenAuth: {
          // apiToken: 'd9d92006d77e1e706b833d78d371f4c1815f59027d7b1f46edebfc0e78b8a751',
          apiToken: '953f4dbcd6285a925e8224506af8ceebf1436360bd3b025272a2f732370c19c8',
          persist: true
        },
        environment: 'development'
      }]
    })

    this.ck.container = this.CloudKit.getDefaultContainer()
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

  _ckGotoAuthenticatedState(userIdentity) {
    // console.log('gotoAuthenticatedState', this)
    this.user.isAuthenticated = true

    this.ck.container
    .whenUserSignsOut()
    .then(this._ckGotoUnauthenticatedState.bind(this))

    var database = this.ck.container.getDatabaseWithDatabaseScope(
      CloudKit.DatabaseScope["PUBLIC"]
    )

    let self = this
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

          self.router.push({ name: 'link' });
        } else {
          // Scholar already existing

          database.fetchRecords(scholarReference.value.recordName)
          .then(function(response) {
            if (response.hasErrors) {

              // Handle the errors in your app.
              throw response.errors[0];

            } else {
              var scholar = response.records[0];
              var wwdcYears = scholar.fields.wwdcYears.value
              var socialMediaRef = scholar.fields.socialMedia

              for (var i = 0; i < wwdcYears.length; i++) {
                var obj = wwdcYears[i];

                if (obj.recordName === 'WWDC 2017') {
                  console.log("Contains WWDC 2017, to thankyou");
                  self.router.push({ name: 'thankyou' })
                  return;
                }
              }

              console.log("Scholar exists but hasn't filled form");
              console.log("Fetching social media");
              database.fetchRecords(socialMediaRef.value.recordName)
              .then(function(socialResponse) {
                if (socialResponse.hasErrors) {

                  // Handle the errors in your app.
                  throw socialResponse.errors[0];

                } else {
                  var socialMedia = socialResponse.records[0];
                  console.log(socialMedia);
                  var steps = auth.vm.$store.steps
                  for (var s = 0; s < steps.length; s++) {
                    const step = steps[s]
                    for (var g = 0; g < step.groups.length; g++) {
                      const group = step.groups[g]
                      for (var f = 0; f < group.fields.length; f++) {
                        const field = group.fields[f]
                        if (scholar.fields[field.name]) {
                          field.model = scholar.fields[field.name].value
                        } else if (socialMedia.fields[field.name]) {
                          console.log(field.name);
                          field.model = socialMedia.fields[field.name].value
                        }
                      }
                    }
                  }

                  self.router.replace({ name: 'welcome' })
                  // auth.router.replace({ name: 'welcome' });
                }
              });
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

    this.router.replace({ name: 'signin' })
  },

  async ckSubmitModel (model) {
    const fields = serializeSteps(model)

    // Add current WWDCYear
    fields.scholar.wwdcYears = [{ recordName: 'WWDC 2017', action: 'NONE' }]

    var wwdcYearInfoRecord = null,
    scholarSocialMediaRecord = null

    // Save WWDCYearInfo
    try {
      [wwdcYearInfoRecord, scholarSocialMediaRecord] = await Promise.all([
        this._ckSave('WWDCYearInfo', fields.wwdcYearInfo),
        this._ckSave('ScholarSocialMedia', fields.socialMediaReference)
      ])
    } catch (errors) {
      // TODO:
      throw errors
    }

    fields.scholar.wwdcYearInfos = [{ recordName: wwdcYearInfoRecord.recordName, action: 'DELETE_SELF' }]
    fields.scholar.socialMediaReference = { recordName: scholarSocialMediaRecord.recordName, action: 'DELETE_SELF' }

    // Save scholar
    let scholar = await this._ckSave('Scholar', fields.scholar)

    return scholar
  },

  async _ckSave(recordType, data) {
    return new Promise((resolve, reject) => {
      this._ckSaveRecords('PUBLIC', null, null, recordType, null, null, null, null, null, null, null, data, null, (errors, response, zoneID, databaseScope) => {
        if (errors) {
          return reject(errors)
        }
        resolve(response.records[0])
      })
    })
  },

  _ckSaveRecords (databaseScope, recordName, recordChangeTag, recordType, zoneName, forRecordName, forRecordChangeTag, publicPermission, ownerRecordName, participants, parentRecordName, fields, createShortGUID, callback) {
    const container = this.ck.container
    const database = container.publicCloudDatabase
    // const database = container.getDatabaseWithDatabaseScope(this.CloudKit.DatabaseScope[databaseScope])

    const options = {}

    // IF no zoneName is provided the record will be saved to the default zone.
    if (zoneName) {
      options.zoneID = { zoneName }
      if (ownerRecordName) {
        options.zoneID.ownerRecordName = ownerRecordName
      }
    }

    const record = {
      recordType
    }

    // If no recordName is supplied the server will generate one.
    if (recordName) {
      record.recordName = recordName
    }

    // To modify an existing record, supply a recordChangeTag.
    if (recordChangeTag) {
      record.recordChangeTag = recordChangeTag
    }

    // Convert the fields to the appropriate format
    record.fields = Object.keys(fields).reduce((obj, key) => {
      obj[key] = { value: fields[key] }
      return obj
    }, {})

    // If we are going to want to share the record we need to request a stable short GUID.
    if (createShortGUID) {
      record.createShortGUID = true
    }

    // If we want to share the record via a parent reference we need to set the record's parent property.
    if (parentRecordName) {
      record.parent = { recordName: parentRecordName }
    }

    if (publicPermission) {
      record.publicPermission = this.
      this.CloudKit.ShareParticipantPermission[publicPermission]
    }

    // If we are creating a share record, we must specify the record which we are sharing.
    if (forRecordName && forRecordChangeTag) {
      record.forRecord = {
        recordName: forRecordName,
        recordChangeTag: forRecordChangeTag
      }
    }

    if (participants) {
      record.participants = participants.map(function (participant) {
        return {
          userIdentity: {
            lookupInfo: { emailAddress: participant.emailAddress }
          },
          permission: this.CloudKit.ShareParticipantPermission[participant.permission],
          type: participant.type,
          acceptanceStatus: participant.acceptanceStatus
        }
      })
    }

    return database.saveRecords(record, options)
    .then(function (response) {
      if (response.hasErrors) {
        callback(response.errors)
      } else {
        // console.log(response.records[0], options.zoneID, databaseScope)
        return callback(null, response, options.zoneID, databaseScope)
      }
    })
  }
}

export default auth
