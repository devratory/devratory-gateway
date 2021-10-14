import { msService } from '../services';
import { IStepPayload, Step } from './base.step';

export class MicroserviceCallStep extends Step {
  // MS properties
  pattern: string | object;
  payload?: IStepPayload;

  async execute<O>() {
    console.debug('Calling microservice', this.pattern, 'With payload', JSON.stringify(this.payload, null, 2));
    const payload = await this._serializer.serialize(this.payload);
    const msResponse = await msService.call<O>(this.pattern, payload);
    const response = this.readFromObject(msResponse);
    // Store it in scope for other steps to access.
    this._scope.set(this.name, response);
    console.debug(`Stored value for ${this.name} in scope`, JSON.stringify(response, null, 2));
    return response as O;
  }
}
