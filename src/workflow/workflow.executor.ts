import { NextFunction, Request, Response } from 'express';
import { Serializer } from '../serializer';
import { Scope } from '../scope';
import { ExecCodeStep, HttpCallStep, MicroserviceCallStep, Step, StepType, SwitchStep } from '../step';
import { IWorkflow } from './workflow.interface';

export class WorkflowExecutor {
  private _workflow: IWorkflow;
  private _scope: Scope;
  private _serializer: Serializer;

  constructor(workflowJSON: IWorkflow, request: Request, private response: Response, private next: NextFunction) {
    this._workflow = workflowJSON;
    this._scope = new Scope({
      user: (request as any).user,
      headers: request.headers,
      params: request.params,
      queryParams: request.query,
      body: request.body,
    });
    this._serializer = new Serializer(this._scope, this._executeStep.bind(this));
  }

  async execute(responseWithJSON = true) {
    console.log(`Executing workflow: ${this._workflow.name}`);
    await this._executeSteps(this._workflow.steps);

    const result = await this._serializer.serialize(this._workflow.output);
    if (result) {
      console.log('Returning response', result, 'From scope', this._scope);
      responseWithJSON && this.response.json(result);
      return result;
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
    const step = this._createStepFromJSON(stepData);
    if (step) {
      console.debug(`Executing step: ${step.name}`);
      return await step.execute();
    } else {
      console.log('No handler found for step type', step.$$type);
    }
  }

  private _createStepFromJSON(step: Partial<Step>): Step {
    switch (step.$$type) {
      case StepType.HttpCall: {
        return new HttpCallStep(step, this._scope, this._serializer);
      }
      case StepType.MicroserviceCall: {
        return new MicroserviceCallStep(step, this._scope, this._serializer);
      }
      case StepType.Switch: {
        return new SwitchStep(step, this._scope, this._serializer);
      }
      case StepType.ExecuteCode: {
        return new ExecCodeStep(step, this._scope, this._serializer);
      }
      default:
        return null;
    }
  }
}
