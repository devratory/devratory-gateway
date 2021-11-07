import { Step } from './base.step';

export class ExecCodeStep extends Step {
  code: string;
  inputs: string[];

  async execute<O>() {
    const fn = eval(this.code);
    const callArguments = await Promise.all(this.inputs.map((input) => this._serializer.serialize(input)));
    return await fn(...callArguments);
  }
}
