import Vue from 'vue';
import Step from '~/types/Step';

export const state = () => ({
  currentScholar: undefined,
  currentScholarSocialMedia: undefined
});

export const getters = {
};

export const mutations = {
  setScholar(state, scholarRecord) {
    Vue.set(state, 'currentScholar', scholarRecord);
  },
  setScholarSocialMedia(state, scholarSocialMediaRecord) {
    Vue.set(state, 'currentScholarSocialMedia', scholarSocialMediaRecord);
  }
};

export const actions = {
  async submit({ state, commit }, steps: Step[]) {
    const api = Vue.prototype.$cloudKit;
    // serialize steps
    const fields = await Step.serializeSteps(steps) as any;

    // save yearInfo, update socialMedia
    const scholarSocialMediaRecordName = state.currentScholarSocialMedia ? state.currentScholarSocialMedia.recordName : undefined;
    const scholarSocialMediaRecordChangeTag = state.currentScholarSocialMedia ? state.currentScholarSocialMedia.recordChangeTag : undefined;
    const [wwdcYearInfoRecord, socialMediaRecord] = await Promise.all([
        api.save('WWDCYearInfo', undefined, undefined, fields.wwdcYearInfo),
        api.save('ScholarSocialMedia', scholarSocialMediaRecordName, scholarSocialMediaRecordChangeTag, fields.socialMedia)
    ]);
    commit('setScholarSocialMedia', socialMediaRecord);

    // set yearInfo, socialMedia and year references on the scholar
    fields.scholar.socialMedia = {
      recordName: socialMediaRecord.recordName,
      action: 'DELETE_SELF'
    };
    // if a scholar exists, keep existing wwdcYearInfos and wwdcYears
    if (state.currentScholar && state.currentScholar.fields.wwdcYearInfos) {
      fields.scholar.wwdcYearInfos = [...state.currentScholar.fields.wwdcYearInfos.value];
      fields.scholar.wwdcYears = [...state.currentScholar.fields.wwdcYears.value];
    } else {
      fields.scholar.wwdcYearInfos = [];
      fields.scholar.wwdcYears = [];
    }
    fields.scholar.wwdcYearInfos.push({
      recordName: wwdcYearInfoRecord.recordName,
      action: 'DELETE_SELF'
    });
    fields.scholar.wwdcYears.push({
      recordName: process.env.WWDC_YEAR,
      action: 'NONE'
    });

    // set scholar status to pending
    fields.scholar.status = 'pending';

    // save updated/new scholar record
    const currentScholarRecordName = state.currentScholar ? state.currentScholar.recordName : undefined;
    const currentScholarRecordChangeTag = state.currentScholar ? state.currentScholar.recordChangeTag : undefined;
    const newScholar = await api.save('Scholar', currentScholarRecordName, currentScholarRecordChangeTag, fields.scholar);
    commit('setScholar', newScholar);

    // update the scholar reference on yearInfo and socialMedia
    await Promise.all([
      api.save('WWDCYearInfo', wwdcYearInfoRecord.recordName, wwdcYearInfoRecord.recordChangeTag, {
        scholar: { recordName: newScholar.recordName, action: 'DELETE_SELF' },
        year: { recordName: process.env.WWDC_YEAR, action: 'NONE' }
      }),
      api.save('ScholarSocialMedia', socialMediaRecord.recordName, socialMediaRecord.recordChangeTag, {
        scholar: { recordName: newScholar.recordName, action: 'DELETE_SELF' }
      })
    ]);

    // fetch user record from user identity
    if (!api.user.userRecordName) { // TODO: hmm, should never be the case
      const userIdentity = await api.fetchCurrentUserIdentity();
      api.user = userIdentity;
    }
    const userRecord = await api.fetchRecord(api.user.userRecordName);

    // link scholar in user record
    api.save('Users', userRecord.recordName, userRecord.recordChangeTag, {
      scholar: { recordName: newScholar.recordName, action: 'NONE' }
    });
  },
  async linkScholar({ state, commit, dispatch }, scholarRecord) {
    commit('setScholar', scholarRecord);
    const api = Vue.prototype.$cloudKit;

    if (!api.user.userRecordName) {
      const userIdentity = await api.fetchCurrentUserIdentity();
      api.user = userIdentity;
    }
    const userRecord = await api.fetchRecord(api.user.userRecordName);

    // link & fetch prev social media data
    const [linkResult, socialMediaRecord] = await Promise.all([
      api.save('Users', userRecord.recordName, userRecord.recordChangeTag, {
        scholar: { recordName: scholarRecord.recordName, action: 'NONE' }
      }),
      api.fetchRecord(scholarRecord.fields.socialMedia.value.recordName)
    ]);

    dispatch('steps/fillSteps', {
      scholarFields: scholarRecord.fields,
      socialFields: socialMediaRecord.fields
    }, {
      root: true
    });
  }
};
