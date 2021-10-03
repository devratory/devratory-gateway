import { get } from 'lodash';
import { msService } from './ms.service';
import { Scope } from './scope';
import { IStep, StepType } from './step.interface';

export class StepExecutor {
  private _stepHandlerByType = {
    [StepType.MicroserviceCall]: this._execMicroserviceCall.bind(this),
  };

  constructor(private _scope: Scope) {}

  async execute(step: IStep) {
    const handler = this._stepHandlerByType[step.$$type];
    if (handler) {
      console.debug(`Executing step: ${step.name}`);
      return await handler(step);
    } else {
      console.log('No handler found for step type', step.$$type);
    }
  }

  private async _execMicroserviceCall<T = any>(step: IStep) {
    console.debug('Calling microservice', step.pattern, 'With payload', JSON.stringify(step.payload, null, 2));
    const msResponse = await msService.call<T>(step.pattern, step.payload);
    const response = step.readFrom ? get(msResponse, step.readFrom, null) : msResponse;

    // Store it in scope for other steps to access.
    this._scope.set(step.name, response);
    console.debug(`Stored value for ${step.name} in scope`, JSON.stringify(response, null, 2));
    return response;
  }
}
