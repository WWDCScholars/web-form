<template lang="pug">
.step-form.form(:class="colorClass")
  h3 {{ step.title }}
  .form-group(v-for="group in step.groups")
    h4 {{ group.title }}
    .form-field(v-for="field in group.fields", :class="field.class")
      // *TYPE radio
      .form-select(v-if="field.type === 'radio'")
        .form-option(v-for="option in field.options")
          input(type="radio", :name="field.name", :value="option", :id="option", :required="field.required")
          label(v-bind:for="option") {{ option }}

      // *TYPE file
      .form-file(v-else-if="field.type === 'file'")
        input(type="file", :name="field.name")
        label(:for="field.name")


      // *TYPE all
      input(v-else, :type="field.type", :name="field.name", :placeholder="field.placeholder").form-input

      .form-comment(v-if="field.comment") {{ field.comment }}

  .form-cta-group
    button().form-cta.form-cta-secondary.form-cta-left Previous
    button().form-cta.form-cta-primary.form-cta-right Continue
</template>

<script>
export default {
  name: 'step-form',
  store: [],
  props: ['step'],
  data () {
    return {

    }
  },
  computed: {
    colorClass () {
      return 'form-color-' + this.step.color
    }
  },
  mounted() {},
  methods: {},
  components: {}
}
</script>

<style lang="css">
</style>
