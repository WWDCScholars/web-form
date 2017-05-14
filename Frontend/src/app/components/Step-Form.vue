<template lang="pug">
.step-form.form(:class="colorClass")
  modal(v-if="submitInProgress")
    h3(slot="header").color-green Beaming your profile to space...
    spinner(slot="body", type="circle", color="green")
    div(slot="body").spinner.spinner-green.modal-spinner
  h3 {{ step.title }}
  .form-group(v-for="group in step.groups")
    h4 {{ group.title }}
    form-field(v-for="field in group.fields", :model="field", :key="field.name", @change="onFieldChange", ref="fields")

  .form-cta-group
    button(v-if="currentStepNumber != 0", v-on:click="previousStep").button.button-secondary.u-left Previous
    button(v-if="currentStepNumber != stepCount - 1", v-on:click="nextStep", :disabled="!step.finished").button.button-primary.u-right Continue
    button(v-if="currentStepNumber === stepCount - 1", v-on:click="submit", :disabled="!submittable || submitInProgress").button.button-primary.u-right Submit
</template>

<script>
import { FormField, Modal, Spinner } from 'components'
import Raven from 'raven-js'
export default {
  name: 'step-form',
  store: ['auth', 'steps'],
  props: ['step'],
  data () {
    return {
      submittable: false,

      submitInProgress: false,

      _stepChanged: false
    }
  },
  computed: {
    colorClass () {
      return 'section-accent-color-' + this.step.color
    },
    currentStepNumber () {
      return parseInt(this.step.slug.split('-')[0])
    },
    stepCount () {
      return this.$store.steps.length
    }
  },
  mounted () {
    this.evaluateCompletion()
  },
  updated () {
    if (this._stepChanged) {
      this.evaluateCompletion()
      this._stepChanged = false
    }
  },
  watch: {
    step () {
      this._stepChanged = true
    }
  },
  methods: {
    validationOptions (field) {
      const ret = {}
      if (field.required) { ret.required = true }
      if (field.type === 'url') { ret.url = true }
      if (field.type === 'email') { ret.email = true }
      if (field.dimensions_min) { ret.dimensions_min = [field.dimensions_min, field.dimensions_min] }
      if (field.date_format) { ret.date_format = field.date_format }
      return { rules: ret }
    },
    onFieldChange () {
      this.evaluateCompletion()
    },
    evaluateCompletion () {
      var completed = true
      const fields = this.$refs.fields
      for (var f = 0; f < fields.length; f++) {
        const field = fields[f]
        const model = field.model
        if (model.required) {
          if (model.type === 'file') {
            for (var fn = 0; fn < (model.min ? model.min : 1); fn++) {
              if (!model.model[fn]) {
                completed = false
              }
            }
          } else if (!model.model) {
            completed = false
          }
        }
        if (field.errors.any() === true) {
          completed = false
        }
      }
      this.step.finished = completed

      // If last step check submittable status
      if (this.currentStepNumber === this.stepCount - 1) {
        var submittable = true
        for (var s = 0; s < this.$store.steps.length; s++) {
          const step = this.$store.steps[s]
          if (!step.finished) {
            submittable = false
          }
        }
        this.submittable = submittable
      }
    },
    onFocusOut (event) {
      const src = event.srcElement
      if (src.value === '') {
        src.nextSibling.classList.remove('input-has-value')
      } else {
        src.nextSibling.classList.add('input-has-value')
      }
    },
    nextStep () {
      if (!this.step.finished) {
        return
      }
      const next = this.$store.steps[this.currentStepNumber + 1]
      this.$router.push({ name: 'step', params: { step: next.slug } })
    },
    previousStep () {
      this.$router.go(-1)
    },
    async submit () {
      if (!this.submittable || this.submitInProgress) {
        return
      }
      this.submitInProgress = true

      try {
        this.submitInProgress = true
        await this.auth.submitModel(this.$store.steps)
        this.submitInProgress = false

        this.$router.push({ name: 'thankyou' })
      } catch (error) {
        console.error(error)
        this.handleError(error)
      }
    },

    handleError (error) {
      if (error.length) {
        for (var i = 0; i < error.length; i++) {
          Raven.captureException(error[i])
        }
      } else {
        Raven.captureException(error)
      }

      this.$router.replace({ name: 'error' })
    }
  },
  components: {
    FormField,
    Modal,
    Spinner
  }
}
</script>

<style lang="css">
</style>
