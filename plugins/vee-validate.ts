import Vue from 'vue';
import VeeValidate, { Validator } from 'vee-validate';

const validateImageMin = {
  getMessage(field, args, data) {
    const width = parseInt(args[0]);
    const height = parseInt(args[1]);
    return (data && data.message) || `The image size has to be at least ${width}x${height} pixels.`;
  },
  validate(value: (File | undefined)[], args) {
    const width = parseInt(args[0]);
    const height = parseInt(args[1]);
    const URL = window.URL || window['webkitURL'];
    return new Promise(resolve => {
      if (value[0] === undefined) {
        return resolve({ valid: false, data: { message: 'The image is required.' } });
      }
      const image = new Image();
      image.onerror = () => resolve({ valid: false });
      image.onload = () => {
        return resolve({
          valid: image.width >= width && image.height >= height
        });
      };
      image.src = URL.createObjectURL(value[0] as File);
    });
  }
};

Validator.extend('dimensions_min', validateImageMin);

Vue.use(VeeValidate, {
  inject: true
});
