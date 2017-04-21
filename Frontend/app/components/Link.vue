<template lang="pug">
.container.container-outer.color-gray
  h2.color-blue Welcome to WWDCScholars!
  h3.color-blue.link-header Have you signed up for an account before?


  .form.form-color-blue.link-button-group(v-if="!hasSignedUpBefore")
    button(@click="signedUpBefore").form-cta.form-cta-secondary Signed Up Before
    button(@click="newScholar").form-cta.form-cta-primary New Scholar

  .form.form-color-blue.link-form(v-else)
    .form-input
      input(type="email", ref="signedUpBefore_email", id="email", @focusout="onFocusOut")
      label(for="email").form-title Email

    button(@click="link").form-cta.form-cta-primary.form-cta-right Link
</template>

<script>
export default {
  name: 'welcome',
  store: ['auth'],
  data () {
    return {
      hasSignedUpBefore: false
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
      //this.$auth.push({ name: 'welcome' })
      let database = this.auth.ck.container.getDatabaseWithDatabaseScope(
        CloudKit.DatabaseScope["PUBLIC"]
      )
      database.fetchRecords(this.$refs.signedUpBefore_email.value)
        .then(function(scholarByEmail) {
          console.log(scholarByEmail);
          if (response.hasErrors) {

            // Handle the errors in your app.
            throw response.errors[0];

          } else {
            var scholar = response.records[0];
            //todo: gewt current user identity record id
            let userIdentity = this.auth.user

            database.fetchRecords(userIdentity.userRecordName)
            .then(function(response) {
              if (response.hasErrors) {

                // Handle the errors in your app.
                throw response.errors[0];

              } else {
                let record = response.records[0];
                // todo: set scholar to reference to object with id `scholar.id` and save
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
