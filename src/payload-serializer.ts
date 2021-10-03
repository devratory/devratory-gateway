import { Scope } from './scope';
import { IStep, IStepPayload } from './step.interface';

export class PayloadSerializer {
  constructor(
    private _scope: Scope,
    private _executeStep: (step: IStep) => Promise<any> = () => Promise.resolve(null)
  ) {}

  async serialize(payload: IStepPayload) {
    console.debug('Serializing payload', JSON.stringify(payload, null, 2));
    const keys = Object.keys(payload).filter((k) => k !== '...');
    let serialized = {};

    if (payload['...']) {
      // If we have a root level assignment we should start by serializing it
      serialized = await this._serializeValue(payload['...']);
      console.log('Serialized root level assignment', payload['...'], serialized);
    }

    console.log('Serializing keys', keys);

    // And then serialize each key separately
    for (let key of keys) {
      serialized[key] = await this._serializeValue(payload[key]);
    }

    return serialized;
  }

  private async _serializeValue(value: string | IStep | IStepPayload) {
    if (typeof value === 'string') {
      return await this._serializeString(value);
    } else if (typeof value === 'object') {
      // Check if this is a step to execute
      if (value.$$type) {
        return await this._executeStep(value as IStep);
      } else {
        // otherwise serialize as payload
        return await this.serialize(value as IStepPayload);
      }
    } else {
      return value;
    }
  }

  private _serializeString(value: string) {
    const shouldSerialize = value.startsWith('{{') && value.endsWith('}}');

    if (!shouldSerialize) {
      return value;
    }

    // Remove curly braces from a string like {{request.data.user}} so we can use it to get the actual value
    const valuePath = value.substring(2, value.length - 2);
    console.log('Getting value from scope by path ', valuePath);
    const serializedValue = this._scope.get(valuePath);

    if (!serializedValue) {
      console.warn(
        `Value for ${valuePath} was not found. Make sure the execution order is correct and scope has this path`, this._scope
      );
    }

    return serializedValue;
  }
}
