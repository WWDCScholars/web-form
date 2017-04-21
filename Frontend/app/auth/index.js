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
        containerIdentifier: 'iCloud.de.moritzsternemann.TIL',
        apiTokenAuth: {
          apiToken: 'd9d92006d77e1e706b833d78d371f4c1815f59027d7b1f46edebfc0e78b8a751',
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
  _ckGotoAuthenticatedState (userIdentity) {
    // console.log('gotoAuthenticatedState', this)
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
