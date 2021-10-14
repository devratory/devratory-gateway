import { Step } from './base.step';
import { httpService } from '../services';

export class HttpCallStep extends Step {
  httpMethod: string;
  url: string;
  queryParams?: {
    [key: string]: any;
  };
  body?: {
    [key: string]: any;
  };
  config?: {
    [key: string]: any;
  };

  async execute<O>() {
    // TODO: do something with httpService
    return Promise.resolve({}) as Promise<O>;
  }
}
