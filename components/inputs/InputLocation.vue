<template lang="pug">
.input-location
  input-text(
    :placeholder.once="placeholder",
    :required.once="required",
    :value="inputValue"
  )
    gmap-autocomplete(
      :types.once="['(cities)']",
      placeholder="",
      :value="inputValue",
      @place_changed="setPlace"
    )

  gmap-map(
    :center="value",
    :options.once="mapOptions",
    :zoom.once="1",
    ref="map"
  ).map
    gmap-marker(
      v-if="value.lat !== 0 || value.lng !== 0",
      :position="value",
      :clickable="true",
      :draggable="false"
    )
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from 'nuxt-property-decorator';
import InputText from '~/components/inputs/InputText.vue';
declare const google: any;

@Component({
  components: {
    'input-text': InputText
  }
})
export default class InputLocation extends Vue {
  @Model('change', { default: () => ({ lat: 0, lng: 0 }) })
  value: { lat: number; lng: number }

  @Prop()
  placeholder: string
  @Prop()
  required: boolean

  value_validate: { lat: number; lng: number }

  inputValue: string = ''
  zoom: number = 1
  mapOptions: object = {
    disableDefaultUI: true,
    gestureHandling: 'none',
    scrollWheel: false
  }

  created() {
    if (this.value) {
      this.setInputValueFromCoords(this.value);
    }
  }

  setPlace(place) {
    if (!place) { return; }
    const value = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };
    this.$emit('change', value);
    this.value_validate = value;
    this.inputValue = place.formatted_address;
    this.$refs.map['fitBounds'](place.geometry.viewport);
  }

  setInputValueFromCoords(location) {
    const geocoder = new google.maps.Geocoder;
    geocoder.geocode({ location }, (results, status) => {
      if (status !== google.maps.GeocoderStatus.OK) {
        return;
      }

      let resultIndex = results.length - 1;
      let result;
      do {
        result = results[resultIndex--];
      } while (result.address_components[0].types[0] !== 'locality');
      this.inputValue = result.formatted_address;
      this.$refs.map['fitBounds'](result.geometry.viewport);
    });
  }
}
</script>

<style lang="sass" scoped>
.input-location
  .map
    width: 100%
    padding-top: 51%
    margin-top: 15px
    border-radius: $border-radius
    overflow: hidden
</style>
