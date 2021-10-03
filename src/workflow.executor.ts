import { NextFunction, Request, Response } from 'express';
import { PayloadSerializer } from './payload-serializer';
import { Scope } from './scope';
import { StepExecutor } from './step.executor';
import { IStep } from './step.interface';
import { IWorkflow } from './workflow.interface';

export class WorkflowExecutor {
  private _workflow: IWorkflow;
  private scope: Scope;
  private stepExecutor: StepExecutor;
  private serializer: PayloadSerializer;

  constructor(
    workflowJSON: IWorkflow,
    private request: Request,
    private response: Response,
    private next: NextFunction
  ) {
    this._workflow = workflowJSON;
    this.scope = new Scope({
      request: {
        ...request,
        user: {
          id: 'test_user_id1',
        },
      },
    });
    this.stepExecutor = new StepExecutor(this.scope);
    this.serializer = new PayloadSerializer(this.scope, this.stepExecutor.execute.bind(this.stepExecutor));
  }

  async execute() {
    console.log(`Executing workflow: ${this._workflow.name}`);
    await this.executeSteps(this._workflow.steps);

    const result = await this.serializer.serialize(this._workflow.output);
    if (result) {
      console.log('Returning response', result);
      this.response.json(result);
    }
  }

  async executeSteps(steps: IStep[]) {
    console.log(`Starting the execution of ${steps.length} steps`);
    for (let step of steps) {
      if (Array.isArray(step) && step.length > 1) {
        // If needed a different scope can be provided here for nested StepsExecutor
        await this.executeSteps(step as IStep[]);
      } else {
        const singleStep = Array.isArray(step) ? step[0] : step;
        await this.stepExecutor.execute({
          ...(step as IStep),
          payload: await this.serializer.serialize(singleStep.payload),
        });
      }
    }
  }
}
