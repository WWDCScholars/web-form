import { ActionTree, MutationTree, GetterTree } from 'vuex'
import {
  ck,
  Step,
  Users,
  Scholar,
  ScholarPrivate,
  ScholarSocialMedia,
  WWDCYearInfo,
  CloudKit
} from '~/model'

export const name = 'api'

export const types = {
  setUserIdentity: 'setUserIdentity',
  setSignInURL: 'setSignInURL',
  setScholar: 'setScholar',
  setScholarSocialMedia: 'setScholarSocialMedia',
  setScholarPrivate: 'setScholarPrivate'
}

export interface State {
  // authentication
  userIdentity?: CloudKit.UserIdentity
  signInURL?: string,

  // model
  scholar?: Scholar,
  scholarSocialMedia?: ScholarSocialMedia,
  scholarPrivate?: ScholarPrivate
}

export const state = (): State => ({
  userIdentity: undefined,
  signInURL: undefined,
  scholar: undefined,
  scholarSocialMedia: undefined
})

export const getters: GetterTree<State, State> = {
  isAuthenticated(state: State): boolean {
    return !!state.userIdentity
  },
  hasProfile(state: State): boolean {
    return !!state.scholar
  },
  hasSubmitted(state: State): boolean {
    if (!state.scholar) {
      return false
    }

    return state.scholar.wwdcYears
      .filter(year => year.recordName === process.env.WWDC_YEAR)
      .length === 1
  }
}

export const actions: ActionTree<State, State> = {
  // authentication
  async onAuthenticated({ commit, dispatch }, userIdentity: CloudKit.UserIdentity): Promise<void> {
    commit(types.setUserIdentity, userIdentity)
    try {
      this.$sentry.addBreadcrumb({
        message: 'onAuthenticated',
        category: 'authentication'
      })

      const user = await Users.fetch(userIdentity.userRecordName)
      this.$sentry.addBreadcrumb({
        message: 'fetched user record',
        category: 'authentication'
      })

      // if no scholar field, user has no linked scholar yet
      if (!user.scholar) {
        this.$sentry.addBreadcrumb({
          message: 'no linked scholar',
          category: 'authentication'
        })
        return
      }

      // else fetch linked scholar
      const scholar = await Scholar.fetch(user.scholar.recordName)
      commit(types.setScholar, scholar)
      this.$sentry.addBreadcrumb({
        message: 'fetched scholar',
        category: 'authentication'
      })

      // if scholar already submitted for the current year, redirect to thankyou
      for (const wwdcYear of scholar.wwdcYears) {
        if (wwdcYear.recordName === process.env.WWDC_YEAR) {
          return
        }
      }

      // else we have a scholar from a previous year
      // fetch existing socialMedia and scholarPrivate
      const [socialMediaRecord, scholarPrivateRecord] = await Promise.all([
        ScholarSocialMedia.fetch(scholar.socialMedia.recordName),
        ScholarPrivate.fetch(scholar.scholarPrivate.recordName)
      ])
      commit(types.setScholarSocialMedia, socialMediaRecord)
      commit(types.setScholarPrivate, scholarPrivateRecord)
      this.$sentry.addBreadcrumb({
        message: 'fetched socialMedia and scholarPrivate record',
        category: 'authentication'
      })

      // fill steps store with scholar fields and social media fields
      dispatch('steps/fillSteps', {
        scholarFields: scholar.fields,
        socialFields: socialMediaRecord.fields,
        privateFields: scholarPrivateRecord.fields
      }, { root: true })
    }
    catch (e) {
      console.error(e)
      this.$sentry.captureException(e)
    }
  },
  async onUnauthenticated({ commit }, container: CloudKit.Container): Promise<void> {
    const auth = container['_auth']
    commit(types.setUserIdentity, undefined)
    commit(types.setSignInURL, auth._signInURL)
  },
  async signOut({ commit }): Promise<void> {
    commit(types.setUserIdentity, null)
    commit(types.setScholar, null)
    commit(types.setScholarSocialMedia, null)
    commit(types.setScholarPrivate, null)
    ck.signOut()
    return
  },

  // model
  async submit({ state, commit }, steps: Step[]) {
    if (!state.userIdentity) {
      return
    }

    // serialize the steps
    const fields = await Step.serializeSteps(steps) as any
    this.$sentry.addBreadcrumb({
      category: 'submit',
      message: 'serialized fields'
    })

    // create new WWDCYearInfo, update scholar.socialMedia
    const yearInfo = await WWDCYearInfo.create({
      fields: {
        ...fields.wwdcYearInfo,
        appType: { value: 'offline' },
        status: { value: 'pending' }
      }
    })
    let socialMedia: ScholarSocialMedia
    if (state.scholarSocialMedia) {
      socialMedia = ScholarSocialMedia.clone(state.scholarSocialMedia)
      socialMedia.setFields(fields.socialMedia)
      await socialMedia.save()
    } else {
      socialMedia = await ScholarSocialMedia.create({ fields: fields.socialMedia })
    }
    this.$sentry.addBreadcrumb({
      category: 'submit',
      message: 'saved WWDCYearInfo and ScholarSocialMedia'
    })

    // set socialMedia reference on scholar
    fields.scholar.socialMedia = { value: {
      recordName: socialMedia.recordName,
      action: CloudKit.ReferenceAction.DELETE_SELF
    }}

    // if scholar already exists append, else create wwdcYear and wwdcYearInfo references
    if (state.scholar) {
      fields.scholar.wwdcYearInfos = { value: [...state.scholar.wwdcYearInfos] }
      fields.scholar.wwdcYears = { value: [...state.scholar.wwdcYears] }
    } else {
      fields.scholar.wwdcYearInfos = { value: [] }
      fields.scholar.wwdcYears = { value: [] }
    }
    fields.scholar.wwdcYearInfos.value.push({
      recordName: yearInfo.recordName,
      action: CloudKit.ReferenceAction.NONE
    })
    fields.scholar.wwdcYears.value.push({
      recordName: process.env.WWDC_YEAR,
      action: CloudKit.ReferenceAction.NONE
    })

    // if Scholar and ScholarPrivate exist, update using new fields, else create ones
    let scholar: Scholar
    let scholarPrivate: ScholarPrivate
    if (state.scholar && state.scholarPrivate) {
      scholar = Scholar.clone(state.scholar)
      scholar.setFields(fields.scholar)
      scholar.gdprConsentAt = new Date().getTime()

      scholarPrivate = ScholarPrivate.clone(state.scholarPrivate)
      scholarPrivate.setFields(fields.scholarPrivate)
      scholarPrivate.birthday = scholar.birthday!

      await Promise.all([
        scholar.save(),
        scholarPrivate.save()
      ])
    } else {
      // create new Scholar
      const scholarRecordToCreate: CloudKit.RecordToCreateSimple = {
        fields: {
          ...fields.scholar,
          gdprConsentAt: { value: new Date().getTime() }
        }
      }
      const createdScholar = await Scholar.create(scholarRecordToCreate)

      // create new ScholarPrivate
      const scholarPrivateRecordToCreate = {
        fields: {
          email: fields.scholarPrivate.email,
          birthday: fields.scholar.birthday,
          scholar: { value: {
            recordName: createdScholar.recordName,
            action: CloudKit.ReferenceAction.DELETE_SELF
          }}
        }
      }
      const createdScholarPrivate = await ScholarPrivate.create(scholarPrivateRecordToCreate)

      // set scholarPrivate reference on Scholar
      createdScholar.scholarPrivate = {
        recordName: createdScholarPrivate.recordName,
        action: CloudKit.ReferenceAction.DELETE_SELF
      }

      // save updated Scholar
      await createdScholar.save()

      scholar = createdScholar
      scholarPrivate = createdScholarPrivate
    }
    this.$sentry.addBreadcrumb({
      category: 'submit',
      message: 'saved Scholar'
    })

    // set scholar and year references on WWDCYearInfo
    yearInfo.scholar = {
      recordName: scholar.recordName,
      action: CloudKit.ReferenceAction.DELETE_SELF,
    }
    yearInfo.year = {
      recordName: process.env.WWDC_YEAR as string,
      action: CloudKit.ReferenceAction.NONE
    }

    // set scholar reference on ScholarSocialMedia
    socialMedia.scholar = {
      recordName: scholar.recordName,
      action: CloudKit.ReferenceAction.DELETE_SELF
    }

    // save updated WWDCYearInfo and ScholarSocialMedia
    await Promise.all([
      yearInfo.save(),
      socialMedia.save()
    ])
    this.$sentry.addBreadcrumb({
      category: 'submit',
      message: 'updated WWDCYearInfo and ScholarSocialMedia'
    })

    const user = await Users.fetch(state.userIdentity.userRecordName)
    this.$sentry.addBreadcrumb({
      category: 'submit',
      message: 'fetched User'
    })

    // set scholar reference on User
    user.scholar = {
      recordName: scholar.recordName,
      action: CloudKit.ReferenceAction.NONE
    }

    // save updated User
    await user.save()
    this.$sentry.addBreadcrumb({
      category: 'submit',
      message: 'updated User'
    })

    // done, set state for middleware
    commit(types.setScholar, scholar)
    commit(types.setScholarSocialMedia, socialMedia)
    commit(types.setScholarPrivate, scholarPrivate)
  }
}

export const mutations: MutationTree<State> = {
  [types.setUserIdentity](state, value?: CloudKit.UserIdentity) {
    state.userIdentity = value
  },
  [types.setSignInURL](state, url: string) {
    state.signInURL = url
  },
  [types.setScholar](state, value: Scholar) {
    state.scholar = value
  },
  [types.setScholarSocialMedia](state, value: ScholarSocialMedia) {
    state.scholarSocialMedia = value
  },
  [types.setScholarPrivate](state, value: ScholarPrivate) {
    state.scholarPrivate = value
  }
}
