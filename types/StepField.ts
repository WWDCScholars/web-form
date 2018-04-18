export interface StepFieldJSON {
  type: string;
  name: string;
  placeholder?: string;
  readableName?: string;
  required?: boolean;
  comment?: string;
  maxLength?: number;
  styleClass?: string;
  model: any;
}
export default class StepField {
  public type: string;
  public name: string;
  public placeholder: string = '';
  public readableName: string = '';
  public required: boolean = true;
  public comment: string = '';
  public maxLength: number = 0;
  public styleClass: string = '';
  public model: any;

  public constructor(data: StepFieldJSON) {
    this.type = data.type;
    this.name = data.name;
    if (data.placeholder) { this.placeholder = data.placeholder; }
    if (data.readableName) { this.readableName = data.readableName; }
    if (data.required === false) { this.required = data.required; }
    if (data.comment) { this.comment = data.comment; }
    if (data.maxLength) { this.maxLength = data.maxLength; }
    if (data.styleClass) { this.styleClass = data.styleClass; }
    this.model = data.model;
  }

  public get completed(): boolean {
    if (this.required && !this.model) {
      return false;
    }
    return true;
  }
}

interface StepFieldRadioJSON extends StepFieldJSON {
  options: string[];
}
export class StepFieldRadio extends StepField {
  public options: string[];

  public constructor(data: StepFieldRadioJSON) {
    super(data);
    this.options = data.options;
  }
}

interface StepFieldImageJSON extends StepFieldJSON {
  accept: string;
  dimensions_min: number;
  multiple?: boolean;
  maxCount?: number;
  minCount?: number;
  resizeMax?: number;
  model: (File | undefined)[];
}
export class StepFieldImage extends StepField {
  public accept: string;
  public dimensions_min: number;
  public multiple: boolean = false;
  public maxCount: number = 0;
  public minCount: number = 1;
  public resizeMax: number = 0;
  public model: (File | undefined)[] = [undefined];

  public constructor(data: StepFieldImageJSON) {
    super(data);
    this.accept = data.accept;
    this.dimensions_min = data.dimensions_min;
    if (data.multiple) { this.multiple = data.multiple; }
    if (data.maxCount) { this.maxCount = data.maxCount; }
    if (data.minCount) { this.minCount = data.minCount; }
    if (data.resizeMax) { this.resizeMax = data.resizeMax; }
    if (data.model) { this.model = data.model; }
  }

  public get completed(): boolean {
    for (let i = 0; i < this.minCount; i++) {
      if (!this.model[i]) {
        return false;
      }
    }
    return true;
  }
}

interface StepFieldDateJSON extends StepFieldJSON {
  onlyPast: boolean;
  displayFormat: string;
}
export class StepFieldDate extends StepField {
  public onlyPast: boolean;
  public displayFormat: string;

  public constructor(data: StepFieldDateJSON) {
    super(data);
    this.onlyPast = data.onlyPast;
    this.displayFormat = data.displayFormat;
  }
}
