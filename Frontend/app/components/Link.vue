<template lang="pug">
.container.container-outer.color-gray
  h2.color-blue Welcome to WWDCScholars!
  h3.color-blue Have you signed up at WWDCScholars before?

  button(@click="newScholar") New Scholar
  button(@click="signedUpBefore") Signed Up Before

  .form.form-color-blue(v-if="hasSignedUpBefore")
    .form-input
      input(type="email", ref="signedUpBefore_email", id="email")
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
    newScholar () {
      this.$router.push({ name: 'welcome' })
    },
    signedUpBefore () {
      this.hasSignedUpBefore = true
    },
    link () {
      //this.$auth.push({ name: 'welcome' })
      var database = this.auth.ck.container.getDatabaseWithDatabaseScope(
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

            database.fetchRecords(userIdentity.userRecordName)
            .then(function(response) {
              if (response.hasErrors) {

                // Handle the errors in your app.
                throw response.errors[0];

              } else {
                var record = response.records[0];
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
