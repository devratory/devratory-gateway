import { RETURN_RESULT_SCOPE_KEY } from './constants';
import { PayloadSerializer } from './payload-serializer';
import { Scope } from './scope';
import { StepExecutor } from './step.executor';
import { IStep } from './step.interface';

export class StepsExecutor {
  private _stepExecutor: StepExecutor;
  private _payloadSerializer: PayloadSerializer;

  constructor(private _steps: (IStep | IStep[])[], private _scope: Scope) {
    this._stepExecutor = new StepExecutor(this._scope);
    this._payloadSerializer = new PayloadSerializer(this._scope, this._stepExecutor.execute.bind(this._stepExecutor));
  }

  getResult(serialize = false) {
    const value = this._scope.get(RETURN_RESULT_SCOPE_KEY);
    return serialize ? this._payloadSerializer.serialize(value) : value;
  }

  async execute() {
    console.log(`Starting the execution of ${this._steps.length} steps`);
    for (let step of this._steps) {
      if (Array.isArray(step) && step.length > 1) {
        // If needed a different scope can be provided here for nested StepsExecutor
        await new StepsExecutor(step as IStep[], this._scope).execute();
      } else {
        const singleStep = Array.isArray(step) ? step[0] : step;
        await this._stepExecutor.execute({
          ...(step as IStep),
          payload: await this._payloadSerializer.serialize(singleStep.payload),
        });
      }
    }
  }
}
