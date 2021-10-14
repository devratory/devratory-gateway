import { Serializer } from '../serializer';
import { Scope } from '../scope';

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
