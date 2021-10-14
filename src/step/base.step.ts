import _ from 'lodash';
import { Scope } from '../scope';
import { Serializer } from '../serializer';

export abstract class Step {
  $$type: StepType;
  name: string;
  /**
   * After executing this step the returned value can be modified,
   * by passing the path to a field from output.
   */
  readFrom?: string | null;

  constructor(step: Partial<Step>, protected _scope: Scope, protected _serializer: Serializer) {
    Object.assign(this, step);
  }

  abstract execute<O>(): Promise<O>;

  readFromObject(obj: any) {
    if (this.readFrom) {
      const [path, mapProperty] = this.readFrom.split('[].');
      const value = _.get(obj, path, null);
      return mapProperty ? _.map(value, mapProperty) : value;
    } else {
      return obj;
    }
  }
}

export enum StepType {
  MicroserviceCall = 'MS_CALL',
  HttpCall = 'HTTP_CALL',
  ExecuteCode = 'EXEC_CODE',
  Switch = 'SWITCH',
}

export interface IStepPayload {
  /**
   * each key in payload can either be:
   *  string - '{{request.body.firstName}}'
   *  StepPayload - {
   *                  profile: {
   *                      firstName: '{{request.body.firstName}}', // string
   *                      lastName: {
   *                         type: StepType.MicroserviceCall
   *                         pattern: '@category/get_all',
   *
   *                         payload: {
   *                          status: 'active' // hardcoded string
   *                         }
   *                      } // IStep
   *                  } // IStepPayload
   *                }
   *
   */
  [key: string]: string | Step | IStepPayload;
}
