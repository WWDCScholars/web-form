import StepField, {
  StepFieldRadio,
  StepFieldImage,
  StepFieldDate,
  StepFieldJSON
} from './StepField';

const fieldTypes = {
  'radio': StepFieldRadio,
  'image': StepFieldImage,
  'date': StepFieldDate
};

export interface StepSectionJSON {
  title: string;
  ckParameterName: string;
  fields: StepFieldJSON[];
}

export default class StepSection {
  public title: string;
  public ckParameterName: string;
  public fields: StepField[];

  public constructor(data: StepSectionJSON) {
    this.title = data.title;
    this.ckParameterName = data.ckParameterName;
    this.fields = data.fields.map(data => {
      const constructor = fieldTypes[data.type] || StepField;
      return new constructor(data);
    });
  }
}
