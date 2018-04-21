import Vue from 'vue';
import VeeValidate, { Validator } from 'vee-validate';

const imageSize = (file): Promise<any[]> => {
  const URL = window.URL || window['webkitURL'];
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onerror = reject;
    image.onload = () => {
      resolve([image.width, image.height]);
    };
    image.src = URL.createObjectURL(file);
  });
};

const imageValid = async (file, minWidth, minHeight): Promise<boolean> => {
  const [width, height] = await imageSize(file);
  return width >= minWidth && height >= minHeight;
};

const validateImageMin = {
  getMessage(field, args, data) {
    const width = parseInt(args[0]);
    const height = parseInt(args[1]);
    return (data && data.message) || `The ${field} image size has to be at least ${width}x${height} pixels.`;
  },
  async validate(files: { [i: number]: File }, args) {
    const width = parseInt(args[0]);
    const height = parseInt(args[1]);

    const imagesValid: Promise<boolean>[] = [];
    for (let i of Object.keys(files)) {
      imagesValid.push(imageValid(files[i], width, height));
    }

    const allValid: boolean = (await Promise.all(imagesValid))
      .reduce((acc, cur) => !cur ? false : acc, true);

    return { valid: allValid };
  }
};

const validateImageRequired = {
  getMessage(field) {
    return `The ${field} field is required.`;
  },
  validate(images) {
    return Object.keys(images).length > 0;
  }
};

Validator.extend('dimensions_min', validateImageMin);
Validator.extend('image_required', validateImageRequired);

Vue.use(VeeValidate, {
  inject: true
});
