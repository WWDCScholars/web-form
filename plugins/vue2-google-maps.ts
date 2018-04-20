import Vue from 'vue';
import * as VueGoogleMaps from '~/node_modules/vue2-google-maps/src/main';

export default ({ env }, inject) => {
  Vue.use(VueGoogleMaps, {
    load: {
      key: env.GOOGLE_MAPS_API_KEY,
      libraries: 'places'
    }
  });
};
