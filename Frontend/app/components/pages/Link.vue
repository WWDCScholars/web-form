<template lang="pug">
.container.container-outer.color-gray
  modal(v-if="linkInProgress")
    h3(slot="header").color-blue Looking for your account...
    div(slot="body").spinner.spinner-blue.modal-spinner

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

    button(@click="link", :disabled="linkInProgress").form-cta.form-cta-primary.form-cta-right Link
</template>

<script>
export default {
  name: 'welcome',
  store: ['auth'],
  data () {
    return {
      hasSignedUpBefore: false,
      errorComment: '',

      linkInProgress: false
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
    async link () { // TODO: Spinner
      if (this.linkInProgress) {
        return
      }

      let emailValue = this.$refs.signedUpBefore_email.value
      if (emailValue.length < 4) {
        return
      }

      try {
        this.linkInProgress = true
        await this.auth.linkScholarByEmail(emailValue)
        this.linkInProgress = false
      } catch (error) {
        console.error(error)
        this.errorComment = 'Your email address could not be found. Are you sure it is the one you used in the past?'
      }
    }
  },
  components: {
    'modal': require('../Modal.vue')
  }
}
</script>

<style lang="css">
</style>
