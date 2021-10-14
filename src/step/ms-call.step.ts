import _ from 'lodash';
import { msService } from '../ms.service';
import { IStepPayload } from './step-payload.interface';
import { Step } from './base.step';

export class MicroserviceCallStep extends Step {
  // MS properties
  pattern: string | object;
  payload?: IStepPayload;

  async execute<O>() {
    console.debug('Calling microservice', this.pattern, 'With payload', JSON.stringify(this.payload, null, 2));
    const payload = await this._serializer.serialize(this.payload);
    const msResponse = await msService.call<O>(this.pattern, payload);
    const response = this.readFrom ? _.get(msResponse, this.readFrom, null) : msResponse;

    // TODO: Do it in readFrom: 'date[].id'
    // if (step.map && Array.isArray(response)) {
    //   console.debug(`Mapping the output by ${step.map}`);
    //   response = _.map(response, step.map);
    // }

    // Store it in scope for other steps to access.
    this._scope.set(this.name, response);
    console.debug(`Stored value for ${this.name} in scope`, JSON.stringify(response, null, 2));
    return response as O;
  }
}
