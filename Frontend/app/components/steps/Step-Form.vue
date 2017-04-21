<template lang="pug">
.step-form.form(:class="colorClass")
  modal(v-if="showModal")
    h3(slot="header").color-green Beaming your data to space...
    div(slot="body").spinner.modal-spinner
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
      input-file(v-else-if="field.type === 'file'", :field="field", v-model="field.model", @input="evaluateCompletion")

      // *TYPE email
      .form-input(v-else-if="field.type === 'email'")
        input(type="email", :name="field.name", :id="field.name", :required="field.required" @focusout="onFocusOut", v-model="field.model", @keyup="evaluateCompletion")
        label(:for="field.name").form-title {{ field.placeholder }}

      // *TYPE date
      input-date(v-else-if="field.type === 'date'", :field="field", v-model="field.model", @input="evaluateCompletion")

      //*TYPE textarea
      .form-input(v-else-if="field.type === 'textarea'")
        textarea(rows="5", :maxlength="field.maxCharacters", :name="field.name", :id="field.name", :required="field.required", v-model="field.model", @keyup="evaluateCompletion")
        .form-comment {{ field.maxCharacters - field.model.length }} / {{ field.maxCharacters }} characters remaining

      // *TYPE location
      input-location(v-else-if="field.type === 'location'", :field="field", v-model="field.model", @input="evaluateCompletion")

      // *TYPE url
      .form-input(v-else-if="field.type === 'url'")
        input(type="url", :name="field.name", :id="field.name", :required="field.required", @focusout="onFocusOut", v-model="field.model", @keyup="evaluateCompletion")
        label(:for="field.name").form-title {{ field.placeholder }}
        .form-optional-mark(v-if="!field.required") Optional

      // *TYPE text
      .form-input(v-else-if="field.type === 'text'")
        input(type="text", :name="field.name", :id="field.name", :required="field.required", @focusout="onFocusOut", v-model="field.model", @keyup="evaluateCompletion")
        label(:for="field.name").form-title {{ field.placeholder }}
        .form-optional-mark(v-if="!field.required") Optional

      .form-comment(v-if="field.comment") {{ field.comment }}

  .form-cta-group
    button(v-if="currentStepNumber != 0", v-on:click="previousStep").form-cta.form-cta-secondary.form-cta-left Previous
    button(v-if="currentStepNumber != stepCount - 1", v-on:click="nextStep", :disabled="!step.finished").form-cta.form-cta-primary.form-cta-right Continue
    button(v-if="currentStepNumber === stepCount - 1", v-on:click="submit", :disabled="!submittable").form-cta.form-cta-primary.form-cta-right Submit
</template>

<script>
export default {
  name: 'step-form',
  store: ['steps'],
  props: ['step'],
  data () {
    return {
      showModal: false,
      submittable: false
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
    for (var g = 0; g < this.step.groups.length; g++) {
      const group = this.step.groups[g]
      for (var f = 0; f < group.fields.length; f++) {
        const field = group.fields[f]
        if (field.placeholder && field.model.length > 0) {
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
  methods: {
    evaluateCompletion () {
      var completed = true
      for (var g = 0; g < this.step.groups.length; g++) {
        const group = this.step.groups[g]
        for (var f = 0; f < group.fields.length; f++) {
          const field = group.fields[f]
          // TODO: Input validation
          if (field.required != false) {
            if (field.type === 'file') {
              for (var fn = 0; fn < field.min; fn++) {
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
      if (src.value != '') {
        src.nextSibling.classList.add('input-has-value')
      } else {
        src.nextSibling.classList.remove('input-has-value')
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
      if (!this.submittable) {
        return
      }

      try {
        this.showModal = true
        let scholar = await this.$store.auth.ckSubmitModel(this.$store.steps)
        this.showModal = false

        this.$router.push({ name: 'thankyou' })
      } catch (errors) {
        console.error(errors)
        this.$router.push({ name: 'error' })
      }
    }
  },
  components: {
    'modal': require('../Modal.vue'),
    'input-file': require('../inputs/Input-File.vue'),
    'input-date': require('../inputs/Input-Date.vue'),
    'input-location': require('../inputs/Input-Location.vue')
  }
}
</script>

<style lang="css">
</style>
