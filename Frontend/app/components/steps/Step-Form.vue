<template lang="pug">
.step-form.form(:class="colorClass")
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

      // *TYPE text
      .form-input(v-else-if="field.type === 'text'")
        input(type="text", :name="field.name", :id="field.name", :required="field.required" @focusout="onFocusOut", v-model="field.model", @keyup="evaluateCompletion")
        label(:for="field.name").form-title {{ field.placeholder }}

      .form-comment(v-if="field.comment") {{ field.comment }}

  .form-cta-group
    button(v-if="currentStepNumber != 0", v-on:click="previousStep").form-cta.form-cta-secondary.form-cta-left Previous
    button(v-if="currentStepNumber != stepCount - 1", v-on:click="nextStep", :disabled="!stepCompleted").form-cta.form-cta-primary.form-cta-right Continue
    button(v-if="currentStepNumber === stepCount - 1", v-on:click="submit").form-cta.form-cta-primary.form-cta-right Submit
</template>

<script>
export default {
  name: 'step-form',
  store: [],
  props: ['step'],
  data () {
    return {
      stepCompleted: false
    }
  },
  computed: {
    colorClass () {
      return 'form-color-' + this.step.color
    },
    currentStepNumber () {
      return this.step.slug.split('-')[0]
    },
    stepCount () {
      return this.$store.steps.length
    }
  },
  mounted() {},
  methods: {
    evaluateCompletion () {
      var completed = true
      for (var g = 0; g < this.step.groups.length; g++) {
        const group = this.step.groups[g]
        for (var f = 0; f < group.fields.length; f++) {
          const field = group.fields[f]
          if (field.required != false) {
            console.log(field.name, (field.model != undefined))
            if (!field.model) {
              completed = false
            }
          }
        }
      }

      console.log(completed)
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

    },
    previousStep () {

    },
    submit () {

    }
  },
  components: {
    'input-file': require('../inputs/Input-File.vue')
  }
}
</script>

<style lang="css">
</style>
