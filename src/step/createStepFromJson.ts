import { PayloadSerializer } from '../payload-serializer';
import { Scope } from '../scope';
import { Step } from './base.step';
import { HttpCallStep } from './http-call.step';
import { MicroserviceCallStep } from './ms-call.step';
import { StepType } from './step-type.enum';
import { SwitchStep } from './switch.step';

export function createStepFromJSON(step: Partial<Step>, scope: Scope, serializer: PayloadSerializer): Step {
  switch (step.$$type) {
    case StepType.HttpCall: {
      return new HttpCallStep(step, scope, serializer);
    }
    case StepType.MicroserviceCall: {
      return new MicroserviceCallStep(step, scope, serializer);
    }
    case StepType.Switch: {
      return new SwitchStep(step, scope, serializer);
    }
    default:
      return null;
  }
}
