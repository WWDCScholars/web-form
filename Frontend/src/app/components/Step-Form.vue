<template lang="pug">
.step-form.form(:class="colorClass")
  modal(v-if="submitInProgress")
    h3(slot="header").color-green Beaming your profile to space...
    div(slot="body").spinner.spinner-green.modal-spinner
  h3 {{ step.title }}
  .form-group(v-for="group in step.groups")
    h4 {{ group.title }}
    .form-field(v-for="field in group.fields", :class="field.class")
      // *TYPE radio
      .form-select(v-if="field.type === 'radio'")
        .form-option(v-for="option in field.options")
          input(type="radio", :name="field.name", :value="option", :id="option", :required="field.required", v-model="field.model", @click="evaluateCompletion")
          label(v-bind:for="option") {{ option }}

      // *TYPE file
      input-file(v-else-if="field.type === 'file'", :field="field", v-model="field.model", @input="evaluateCompletion", v-validate.reject="validationOptions(field)", :data-vv-name="field.name", data-vv-value-path="", :data-vv-as="field.readableName || field.placeholder")

      // *TYPE email
      .form-input(v-else-if="field.type === 'email'")
        input(type="email", :name="field.name", :id="field.name", :required="field.required" @focusout="onFocusOut", v-model="field.model", @keyup="evaluateCompletion", v-validate="validationOptions(field)", :data-vv-as="field.readableName || field.placeholder")
        label(:for="field.name").form-title {{ field.placeholder }}

      // *TYPE date
      .form-input(v-else-if="field.type === 'date'")
        input(type="text", :name="field.name", :id="field.name", :required="field.require", @focusout="onFocusOut", v-model="field.model", @change="evaluateCompletion", v-validate="validationOptions(field)", :data-vv-as="field.readableName || field.placeholder")
        label(:for="field.name").form-title {{ field.placeholder }}
      //- input-date(v-else-if="field.type === 'date'", :field="field", v-model="field.model", @input="evaluateCompletion")

      //*TYPE textarea
      .form-input(v-else-if="field.type === 'textarea'")
        textarea(rows="5", :maxlength="field.maxCharacters", :name="field.name", :id="field.name", :required="field.required", v-model="field.model", @keyup="evaluateCompletion")
        .form-comment {{ field.maxCharacters - field.model.length }} / {{ field.maxCharacters }} characters remaining

      // *TYPE location
      input-location(v-else-if="field.type === 'location'", :field="field", v-model="field.model", @input="evaluateCompletion")

      // *TYPE url
      .form-input(v-else-if="field.type === 'url'")
        input(type="url", :name="field.name", :id="field.name", :required="field.required", @focusout="onFocusOut", v-model="field.model", @keyup="evaluateCompletion", v-validate="validationOptions(field)", :data-vv-as="field.readableName || field.placeholder")
        label(:for="field.name").form-title {{ field.placeholder }}
        .form-optional-mark(v-if="!field.required") Optional

      // *TYPE text
      .form-input(v-else-if="field.type === 'text'")
        input(type="text", :name="field.name", :id="field.name", :required="field.required", @focusout="onFocusOut", v-model="field.model", @keyup="evaluateCompletion")
        label(:for="field.name").form-title {{ field.placeholder }}
        .form-optional-mark(v-if="!field.required") Optional

      .form-input-error(v-show="errors.has(field.name)") {{ errors.first(field.name) }}
      .form-comment(v-if="field.comment") {{ field.comment }}

  .form-cta-group
    button(v-if="currentStepNumber != 0", v-on:click="previousStep").form-cta.form-cta-secondary.form-cta-left Previous
    button(v-if="currentStepNumber != stepCount - 1", v-on:click="nextStep", :disabled="!step.finished").form-cta.form-cta-primary.form-cta-right Continue
    button(v-if="currentStepNumber === stepCount - 1", v-on:click="submit", :disabled="!submittable || submitInProgress").form-cta.form-cta-primary.form-cta-right Submit
</template>

<script>
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
      return 'form-color-' + this.step.color
    },
    currentStepNumber () {
      return parseInt(this.step.slug.split('-')[0])
    },
    stepCount () {
      return this.$store.steps.length
    }
  },
  mounted () {
    // Set input classes
    this.setupLabels()
    this.evaluateCompletion()
  },
  updated () {
    if (this._stepChanged) {
      this.setupLabels()
      this._stepChanged = false
    }
  },
  watch: {
    step () {
      this._stepChanged = true
      this.$validator.validateAll()
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
    evaluateCompletion () {
      var completed = true
      for (var g = 0; g < this.step.groups.length; g++) {
        const group = this.step.groups[g]
        for (var f = 0; f < group.fields.length; f++) {
          const field = group.fields[f]
          if (field.required !== false) {
            if (field.type === 'file') {
              for (var fn = 0; fn < (field.min ? field.min : 1); fn++) {
                if (!field.model[fn]) {
                  completed = false
                }
              }
            } else if (!field.model) {
              completed = false
            }
          }
        }
      }
      if (this.errors.any()) {
        completed = false
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

    setupLabels () {
      for (var g = 0; g < this.step.groups.length; g++) {
        const group = this.step.groups[g]
        for (var f = 0; f < group.fields.length; f++) {
          const field = group.fields[f]

          if (field.placeholder !== undefined && field.model.length > 0) {
            const el = document.getElementById(field.name).nextSibling
            el.classList.add('no-transition')
            el.classList.add('input-has-value')
            setTimeout(() => {
              el.classList.remove('no-transition')
            }, 200)
          }
        }
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
    'modal': require('./Modal.vue'),
    'input-file': require('./inputs/Input-File.vue'),
    // 'input-date': require('./inputs/Input-Date.vue'),
    'input-location': require('./inputs/Input-Location.vue')
  }
}
</script>

<style lang="css">
</style>
