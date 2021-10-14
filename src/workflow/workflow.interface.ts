import { IStepPayload, Step } from '../step';

export interface IWorkflow {
  name: string;
  url: string;
  httpMethod: 'post' | 'get' | 'put' | 'delete' | 'patch';
  steps: Step[];
  output: IStepPayload;
}
