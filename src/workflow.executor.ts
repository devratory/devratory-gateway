import { NextFunction, Request, Response } from 'express';
import { Scope } from './scope';
import { StepsExecutor } from './steps.executor';
import { IWorkflow } from './workflow.interface';

export class Workflow {
  private _workflow: IWorkflow;

  constructor(workflowJSON: IWorkflow) {
    this._workflow = workflowJSON;
  }

  async execute(request: Request, response: Response, next: NextFunction) {
    console.log(`Executing workflow: ${this._workflow.name}`);
    const scope = new Scope({
      request: {
        ...request,
        user: {
          id: 'test_user_id1',
        },
      },
    });
    const executer = new StepsExecutor(this._workflow.steps as any, scope);
    await executer.execute();

    const result = await executer.getResult(true);
    if (result) {
      console.log('Returning response', result);
      response.json(result);
    }
  }
}
