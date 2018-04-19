import moment from 'moment';
import newPica from 'pica/dist/pica';
import { loadImage, getSize } from '~/helpers/imageHelpers';
import StepSection, { StepSectionJSON } from './StepSection';
import { StepFieldImage, StepFieldDate } from './StepField';

const pica = newPica();

export interface StepJSON {
  slug: string;
  title: string;
  color: string;
  ckParameterName: string;
  sections: StepSectionJSON[];
}

export default class Step {
  public slug: string;
  public title: string;
  public color: string;
  public ckParameterName: string;
  public sections: StepSection[];
  public finished: boolean = false;

  public constructor(data: StepJSON) {
    this.slug = data.slug;
    this.title = data.title;
    this.color = data.color;
    this.ckParameterName = data.ckParameterName;
    this.sections = data.sections.map(data => new StepSection(data));
  }

  public static slugMap(data: StepJSON[]): StepMap {
    const res = data.reduce((obj: StepMap, item: StepJSON) => {
      obj[item.slug] = new Step(item);
      return obj;
    }, {});
    return res;
  }

  public evaluateCompletion(): boolean {
    for (let section of this.sections) {
      for (let field of section.fields) {
        if (!field.completed) {
          return false;
        }
      }
    }
    return true;
  }

  public static async serializeSteps(steps: Step[]) {
    const values = Object.keys(steps).map(key => steps[key]);
    const ret = {};
    for (let step of values) {
      let currentParameterName = step.ckParameterName;
      for (let section of step.sections) {
        if (section.ckParameterName) {
          currentParameterName = section.ckParameterName;
        }
        if (!ret[currentParameterName]) {
          ret[currentParameterName] = {};
        }
        for (let field of section.fields) {
          if (!field.model) {
            continue;
          }

          if (field.type === 'location') {
            ret[currentParameterName][field.name] = {
              latitude: field.model['lat'],
              longitude: field.model['lng']
            };
          } else if (field.type === 'image') {
            const results = field.model
              .filter(item => item instanceof File)
              .map(file => {
                return loadImage(file)
                  .then(image => {
                    const [width, height] = getSize(image['width'], image['height'], field['resizeMax']);
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    return {image, canvas};
                  })
                  .then(({image, canvas}) => pica.resize(image, canvas))
                  .then(result => pica.toBlob(result, 'image/jpeg', 0.90));
              });
            const images = await Promise.all(results);
            if (field['multiple'] === true) {
              ret[currentParameterName][field.name] = images;
            } else {
              ret[currentParameterName][field.name] = images[0];
            }
          } else if (field.type === 'date') {
            ret[currentParameterName][field.name] = moment(field.model).valueOf();
          } else {
            ret[currentParameterName][field.name] = field.model;
          }
        }
        currentParameterName = step.ckParameterName;
      }
    }
    return ret;
  }
}

interface StepMap { [s: string]: Step; }
