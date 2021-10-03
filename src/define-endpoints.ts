import { NextFunction, Request, Response, Express } from 'express';
import fs from 'fs';
import { Workflow } from './workflow.executor';
import { IWorkflow } from './workflow.interface';

export function defineEndpoints(app: Express, pathToWorkflowsJSON: string) {
  try {
    if (!process.env.WORKFLOWS_JSON_PATH) {
      console.log('Environment variable WORKFLOWS_JSON_PATH is not set. Trying to read workflows.json');
    }

    const WORKFLOWS: IWorkflow[] = JSON.parse(fs.readFileSync(pathToWorkflowsJSON, 'utf8'));
    console.log(`Parsed ${WORKFLOWS.length} workflows.`);

    for (let workflow of WORKFLOWS) {
      app[workflow.httpMethod](workflow.url, async (request: Request, response: Response, next: NextFunction) => {
        await new Workflow(workflow).execute(request, response, next);
      });
    }
  } catch (err) {
    throw err;
  }
}
