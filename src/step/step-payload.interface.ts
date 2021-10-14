import { Step } from './base.step';

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
