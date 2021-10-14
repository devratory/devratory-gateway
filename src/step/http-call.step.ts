import { Step } from './base.step';

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
    return Promise.resolve({}) as Promise<O>;
  }
}
