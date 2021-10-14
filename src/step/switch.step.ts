import { Step } from './base.step';

export class SwitchStep extends Step {
  switchValue: string;
  switchMap: {
    [key: string]: Step[];
  };

  async execute<O>() {
    return Promise.resolve({}) as Promise<O>;
  }
}
