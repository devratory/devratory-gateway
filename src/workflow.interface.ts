import { IStep, IStepPayload } from './step.interface';

export interface IWorkflow {
  name: string;
  url: string;
  httpMethod: 'post' | 'get' | 'put' | 'delete' | 'patch';
  steps: IStep[];
  output: IStepPayload;
}
