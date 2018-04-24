import Raven from 'raven-js';

export default async ({ env, store, $cloudKit, app }) => {
  $cloudKit.on('authenticated', async (userIdentity) => {
    try {
      Raven.captureBreadcrumb({
        message: 'onAuthenticated',
        category: 'authentication',
        data: { userIdentity }
      });
      Raven.setUserContext({id: userIdentity.userRecordName});
      const userRecord = await $cloudKit.fetchRecord(userIdentity.userRecordName);
      Raven.captureBreadcrumb({
        message: 'fetched userRecord',
        category: 'authentication'
      });

      // if no scholar field, user has no linked scholar yet
      if (!userRecord.fields.scholar) {
        app.router.push('/link');
        return;
      }

      // else fetch linked scholar
      const scholarRecord = await $cloudKit.fetchRecord(userRecord.fields.scholar.value.recordName);
      store.commit('cloudkit/setScholar', scholarRecord);
      Raven.captureBreadcrumb({
        message: 'fetched Scholar',
        category: 'authentication'
      });
      Raven.setUserContext({
        id: userIdentity.userRecordName,
        email: scholarRecord.fields.email.value
      });

      // if scholar already submitted for the current year, redirect to thankyou
      for (let wwdcYear of scholarRecord.fields.wwdcYears.value) {
        if (wwdcYear.recordName === env.WWDC_YEAR) {
          app.router.push('/thankyou');
          return;
        }
      }

      // else we have a scholar from a previous year
      // fetch existing socialMedia
      const socialMediaRecord = await $cloudKit.fetchRecord(scholarRecord.fields.socialMedia.value.recordName);
      store.commit('cloudkit/setScholarSocialMedia', socialMediaRecord);
      Raven.captureBreadcrumb({
        message: 'fetched socialMediaRecord',
        category: 'authentication'
      });

      // fill steps store with scholar fields and socialMedia fields
      store.dispatch('steps/fillSteps', {
        scholarFields: scholarRecord.fields,
        socialFields: socialMediaRecord.fields
      });
    } catch (e) {
      Raven.captureException(e);
    }
    app.router.push({
      name: 'step-slug',
      params: { slug: store.getters['steps/firstStep'].slug }
    });
  });

  $cloudKit.on('unauthenticated', () => {
    Raven.captureBreadcrumb({
      message: 'onUnauthenticated',
      category: 'authentication'
    });
    Raven.setUserContext();
    app.router.replace('/');
  });

  $cloudKit.on('setupAuthError', (e) => {
    if ($cloudKit.retrySetupAuth === true) {
      return;
    }
    Raven.captureBreadcrumb({
      message: 'setupAuthError',
      category: 'authentication'
    });
    Raven.captureException(e);
    $cloudKit.retrySetupAuth = true;
    app.router.replace('/');
    $cloudKit.setupAuth();
  });
};
