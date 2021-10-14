import { PayloadSerializer } from '../payload-serializer';
import { Scope } from '../scope';
import { StepType } from './step-type.enum';

export abstract class Step {
  $$type: StepType;
  name: string;
  /**
   * After executing this step the returned value can be modified,
   * by passing the path to a field from output.
   */
  readFrom?: string | null;

  constructor(step: Partial<Step>, protected _scope: Scope, protected _serializer: PayloadSerializer) {
    Object.assign(this, step);
  }

  abstract execute<O>(): Promise<O>;
}
