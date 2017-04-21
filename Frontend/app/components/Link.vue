<template lang="pug">
.container.container-outer.color-gray
  h2.color-blue Welcome to WWDCScholars!
  h3.color-blue.link-header Have you signed up for an account before?


  .form.form-color-blue.link-button-group
    button(@click="signedUpBefore").form-cta.form-cta-secondary Signed Up Before
    button(@click="newScholar").form-cta.form-cta-primary New Scholar

  .form.form-color-blue.link-form(v-if="hasSignedUpBefore")
    .form-field
      .form-input
        input(type="email", ref="signedUpBefore_email", id="email", @focusout="onFocusOut")
        label(for="email").form-title Email
      .form-comment {{ errorComment }}

    button(@click="link").form-cta.form-cta-primary.form-cta-right Link
</template>

<script>
export default {
  name: 'welcome',
  store: ['auth'],
  data () {
    return {
      hasSignedUpBefore: false,
      errorComment: ''
    }
  },
  computed: {},
  mounted() {},
  methods: {
    onFocusOut (event) {
      const src = event.srcElement
      if (src.value != '') {
        src.nextSibling.classList.add('input-has-value')
      } else {
        src.nextSibling.classList.remove('input-has-value')
      }
    },
    newScholar () {
      this.$router.push({ name: 'welcome' })
    },
    signedUpBefore () {
      this.hasSignedUpBefore = true
    },
    link () {
      let emailValue = this.$refs.signedUpBefore_email.value
      if (emailValue.length < 4) {
        return
      }

      let database = this.auth.ck.container.getDatabaseWithDatabaseScope(
        CloudKit.DatabaseScope['PUBLIC']
      )
      let self = this
      database.performQuery({
        recordType: 'Scholar',
        filterBy: [{
          comparator: 'EQUALS',
          fieldName: 'email',
          fieldValue: {value: emailValue}
        }]
      }, {
        desiredKeys: ['recordName'],
        resultsLimit: 1
      })
      // database.fetchRecords(emailValue)
        .then(function (response) {
          if (response.hasErrors) {
            if (response.errors[0].ckErrorCode === 'NOT_FOUND') {
              self.errorComment = 'Your email address could not be found. Are you sure it is the one you used in the past?'
            }
          } else {
            let scholar = response.records[0];
            let userIdentity = self.auth.user

            database.fetchRecords(userIdentity.userRecordName)
              .then(function (response) {
                if (response.hasErrors) {

                  // Handle the errors in your app.
                  throw response.errors[0];
                } else {
                  let record = response.records[0];
                  let fields = {
                    scholar: { recordName: scholar.recordName, action: 'NONE' }
                  }

                  self.auth._ckSaveRecords('PUBLIC', record.recordName, record.recordChangeTag, 'Users', null, null, null, null, null, null, null, fields, null, (errors, response, zoneID, databaseScope) => {
                    if (errors) {
                      console.error(errors[0])
                      self.$router.push({ name: 'error' })
                      return
                    }

                    // Linking successful
                    database.fetchRecords(scholar.recordName)
                    .then(function(response) {
                      if (response.hasErrors) {
                        console.error(response.errors[0])
                        self.$router.push({ name: 'error' })

                      } else {
                        var scholar = response.records[0];
                        var wwdcYears = scholar.fields.wwdcYears.value
                        var socialMediaRef = scholar.fields.socialMedia

                        for (var i = 0; i < wwdcYears.length; i++) {
                          var obj = wwdcYears[i];

                          if (obj.recordName === 'WWDC 2017') {
                            console.log("Contains WWDC 2017, to thankyou");
                            self.$router.push({ name: 'thankyou' })
                            return;
                          }
                        }

                        console.log("Scholar exists but hasn't filled form");
                        console.log("Fetching social media");
                        database.fetchRecords(socialMediaRef.value.recordName)
                        .then(function(socialResponse) {
                          if (socialResponse.hasErrors) {
                            console.error(response.errors[0])
                            self.$router.push({ name: 'error' })

                          } else {
                            var socialMedia = socialResponse.records[0];
                            console.log(socialMedia);
                            var steps = self.auth.vm.$store.steps
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

                            self.$router.push({ name: 'welcome' })
                            // self.auth.router.replace({ name: 'welcome' });
                          }
                        });
                      }
                    });

                    //self.$router.push({ name: 'welcome' })
                  })
                }
              });
          }
        });
    }
  },
  components: {}
}
</script>

<style lang="css">
</style>
