<template lang="pug">
.form-location
  .form-input
    gmap-autocomplete(@place_changed="setPlace", :id="field.name", placeholder="", @focusout.native="onFocusOut", ref="input", :value="inputValue", :class="{ 'input-has-value': (inputValue.length > 0) }")
    label(:for="field.name", ref="label").form-title {{ field.placeholder }}

  gmap-map(:center="center", :zoom="zoom").form-input-map
    gmap-marker(v-if="model", :position="center", :clickable="true", :draggable="false")

  input(type="hidden", :name="field.name", :required="field.required", v-model="model")
</template>

<script>
/* global google */
export default {
  name: 'input-location',
  props: ['value', 'field'],
  store: [],
  data () {
    return {
      model: this.value,
      center: { lat: 0, lng: 0 },
      zoom: 1,
      inputValue: ''
    }
  },
  computed: {},
  mounted () {
    if (!this.model) {
      return
    }
    const split = this.model.split(',')
    if (split.length !== 2) {
      return
    }

    const latLong = split.map((string) => {
      return !isNaN(string) ? parseFloat(string) : 0
    })
    this.center = { lat: latLong[0], lng: latLong[1] }
    this.setCityFromCoordinates(this.center)
    this.zoom = 7
    this.$emit('input', this.model)
  },
  methods: {
    setPlace (place) {
      this.center = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      }
      this.model = this.center.lat + ',' + this.center.lng
      this.zoom = 7
      this.$emit('input', this.model)
    },
    setCityFromCoordinates (location) {
      let geocoder = new google.maps.Geocoder()
      geocoder.geocode({ location }, (results, status) => {
        if (status !== 'OK' || !results[0]) {
          this.inputValue = this.model
          return
        }

        let result = results[0]
        var readableResult = []
        for (var i = 0; i < result.address_components.length; i++) {
          let component = result.address_components[i]
          switch (component.types[0]) {
            case 'locality':
              readableResult.push(component.long_name)
              break
            case 'administrative_area_level_1':
              readableResult.push(component.short_name)
              break
            case 'country':
              readableResult.push(component.long_name)
              break

            default:
              break
          }
        }
        this.inputValue = readableResult.join(', ')
      })
    },
    onFocusOut (event) {
      const src = event.srcElement
      if (src.value !== '') {
        src.nextSibling.classList.add('input-has-value')
      } else {
        src.nextSibling.classList.remove('input-has-value')
      }
    }
  },
  watch: {},
  components: {}
}
</script>

<style lang="css">
</style>
