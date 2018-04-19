export default async ({ env, store, $cloudKit, app }) => {
  $cloudKit.on('authenticated', async (userIdentity) => {
    const userRecord = await $cloudKit.fetchRecord(userIdentity.userRecordName);

    // if no scholar field, user has no linked scholar yet
    if (!userRecord.fields.scholar) {
      app.router.push('/link');
      return;
    }

    // else fetch linked scholar
    const scholarRecord = await $cloudKit.fetchRecord(userRecord.fields.scholar.value.recordName);
    store.commit('cloudkit/setScholar', scholarRecord);

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

    // fill steps store with scholar fields and socialMedia fields
    store.dispatch('steps/fillSteps', {
      scholarFields: scholarRecord.fields,
      socialFields: socialMediaRecord.fields
    });

    app.router.push({
      name: 'step-slug',
      params: { slug: store.getters['steps/firstStep'].slug }
    });
  });

  $cloudKit.on('unauthenticated', () => {
    app.router.replace('/');
  });

  $cloudKit.on('setupAuthError', () => {
    app.router.replace('/');
    $cloudKit.setupAuth();
  });
};
