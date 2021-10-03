export enum StepType {
  MicroserviceCall = 'MS_CALL',
  ExecuteCode = 'EXEC_CODE',
  Switch = 'SWITCH',
}

export interface IStep {
  $$type: StepType;
  name: string;
  pattern: string | object;
  payload: IStepPayload;
  readFrom: string | null;
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
   *                         payload: {
   *                          status: 'active' // hardcoded string
   *                         }
   *                      } // IStep
   *                  } // IStepPayload
   *                }
   *
   */
  [key: string]: string | IStep | IStepPayload;
}
