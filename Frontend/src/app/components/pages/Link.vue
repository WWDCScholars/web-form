<template lang="pug">
.container.container-outer.color-gray
  modal(v-if="searchInProgress")
    h3(slot="header").color-blue Looking for your account...
    div(slot="body").spinner.spinner-blue.modal-spinner

  modal(v-if="linkInProgress")
    h3(slot="header").color-blue Linking your account...
    div(slot="body").spinner.spinner-blue.modal-spinner

  h2.color-blue Welcome to WWDCScholars!
  h4.color-blue Have you signed up for an account at WWDCScholars before?
  p If you did, please provide the email address you used for your old account, so we can link it with your new one and show past WWDC attendences on your profile.
  p If you never had a WWDCScholars account before, select #[i New Scholar].


  .link-form
    button(@click="prevStep", v-if="stepIndex > 0 && stepIndex <= 2").form-back.color-blue Back
    .form.form-color-blue.link-button-group(v-if="stepIndex === 0")
      button(@click="nextStep").form-cta.form-cta-secondary Signed Up Before
      button(@click="newScholar").form-cta.form-cta-primary New Scholar

    .form.form-color-blue(v-else-if="stepIndex === 1")
      .form-field
        .form-input
          input(type="email", v-model="email", name="signedUpBefore_email", id="signedUpBefore_email", @focusout="onFocusOut", v-validate="'required|email'", data-vv-as="Email")
          label(for="signedUpBefore_email", ref="signedUpBefore_email_label").form-title Email
        .form-input-error(v-show="errors.has('signedUpBefore_email')") {{ errors.first('signedUpBefore_email') }}
        .form-comment {{ errorComment }}

      button(@click="find", :disabled="searchInProgress || errors.has('signedUpBefore_email')").form-cta.form-cta-primary.form-cta-right Find

    .form.form-color-blue(v-else-if="stepIndex === 2")
      .found-scholar
        .found-scholar-info Are you #[.found-scholar-name {{ scholarName }}]?
        .found-scholar-buttons
          button(@click="wrongUser").form-cta.form-cta-secondary No
          button(@click="link").form-cta.form-cta-primary Yes
</template>

<script>
import Raven from 'raven-js'
export default {
  name: 'welcome',
  store: ['auth'],
  data () {
    return {
      stepIndex: 0, // 0=Start, 1=Signed up before, 2=Scholar found
      errorComment: '',
      searchInProgress: false,
      linkInProgress: false,
      email: ''
    }
  },
  computed: {
    scholarName () {
      return this.scholar.fields.firstName.value + ' ' + this.scholar.fields.lastName.value
    }
  },
  mounted () {},
  updated () {
    if (this.stepIndex !== 1 || this.email.length < 1) {
      return
    }
    const el = document.getElementById('signedUpBefore_email').nextSibling
    el.classList.add('no-transition')
    el.classList.add('input-has-value')
    setTimeout(() => {
      el.classList.remove('no-transition')
    }, 200)
  },
  methods: {
    nextStep () {
      this.stepIndex++
      if (this.stepIndex > 2) {
        this.stepIndex = 2
      }
    },
    prevStep () {
      this.stepIndex--
      if (this.stepIndex < 0) {
        this.stepIndex = 0
      }
    },
    onFocusOut (event) {
      const src = event.srcElement
      if (src.value !== '') {
        src.nextSibling.classList.add('input-has-value')
      } else {
        src.nextSibling.classList.remove('input-has-value')
      }
    },
    newScholar () {
      this.$router.push({ name: 'welcome' })
    },
    async find () {
      if (this.searchInProgress || this.email.length < 4) {
        return
      }

      this.searchInProgress = true
      try {
        let scholar = await this.auth.findScholarByEmail(this.email)
        this.scholar = scholar
        this.nextStep()
      } catch (error) {
        console.error(error)
        this.errorComment = 'Your email address could not be found. Are you sure it is the one you used in the past?'
      }
      this.searchInProgress = false
    },
    wrongUser () {
      this.errorComment = 'Please make sure you use the email address you used in the past.'
      this.prevStep()
    },
    async link () {
      if (this.linkInProgress || !this.scholar) {
        return
      }

      this.linkInProgress = true
      try {
        await this.auth.linkScholar(this.scholar)
        this.$router.push({ name: 'welcome' })
      } catch (error) {
        Raven.captureException(error)
        this.$router.replace({ name: 'error' })
      }
      this.linkInProgress = false
    }
  },
  components: {
    'modal': require('../Modal.vue')
  }
}
</script>

<style lang="css">
</style>
