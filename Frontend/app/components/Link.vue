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

                  self.auth._ckSaveRecords('PRIVATE', record.recordName, record.recordChangeTag, 'Users', null, null, null, null, null, null, null, fields, null, (errors, response, zoneID, databaseScope) => {
                    if (errors) {
                      console.error(errors[0])
                      self.$router.push({ name: 'error' })
                      return
                    }

                    // Linking successful
                    self.$router.push({ name: 'welcome' })
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
