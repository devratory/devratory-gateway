import { NextFunction, Request, Response } from 'express';
import { PayloadSerializer } from './payload-serializer';
import { Scope } from './scope';
import { createStepFromJSON, Step } from './step';
import { IWorkflow } from './workflow.interface';

export class WorkflowExecutor {
  private _workflow: IWorkflow;
  private _scope: Scope;
  private _serializer: PayloadSerializer;

  constructor(
    workflowJSON: IWorkflow,
    private request: Request,
    private response: Response,
    private next: NextFunction
  ) {
    this._workflow = workflowJSON;
    this._scope = new Scope({
      request: {
        ...request,
        user: {
          id: 'test_user_id1',
        },
      },
    });
    this._serializer = new PayloadSerializer(this._scope, this._executeStep.bind(this));
  }

  async execute() {
    console.log(`Executing workflow: ${this._workflow.name}`);
    await this._executeSteps(this._workflow.steps);

    const result = await this._serializer.serialize(this._workflow.output);
    if (result) {
      console.log('Returning response', result);
      this.response.json(result);
    }
  }

  private async _executeSteps(steps: Step[]) {
    console.log(`Starting the execution of ${steps.length} steps`);
    for (let step of steps) {
      if (Array.isArray(step) && step.length > 1) {
        // If needed a different scope can be provided here for nested StepsExecutor
        await this._executeSteps(step as Step[]);
      } else {
        const singleStep = Array.isArray(step) ? step[0] : step;
        await this._executeStep(singleStep);
      }
    }
  }

  private async _executeStep(stepData: Step) {
    const step = createStepFromJSON(stepData, this._scope, this._serializer);
    if (step) {
      console.debug(`Executing step: ${step.name}`);
      return await step.execute();
    } else {
      console.log('No handler found for step type', step.$$type);
    }
  }
}
