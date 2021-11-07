import express from 'express';
import { DEFAULT_PATH_TO_WORKFLOWS_JSON } from './constants';
import { NextFunction, Request, Response, Express } from 'express';
import fs from 'fs';
import { WorkflowExecutor, IWorkflow } from './workflow';
import cors from 'cors';

const app = express();
const PORT = process.env.GATEWAY_PORT || process.env.PORT || 8000;
const pathToWorkflowsJSON = process.env.WORKFLOWS_JSON_PATH || DEFAULT_PATH_TO_WORKFLOWS_JSON;

app.use(express.json());
app.use(cors());

defineEndpoints(app, pathToWorkflowsJSON);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

export function defineEndpoints(app: Express, pathToWorkflowsJSON: string) {
  try {
    if (!process.env.WORKFLOWS_JSON_PATH) {
      console.log('Environment variable WORKFLOWS_JSON_PATH is not set. Trying to read workflows.json');
    }

    const WORKFLOWS: IWorkflow[] = JSON.parse(fs.readFileSync(pathToWorkflowsJSON, 'utf8'));
    console.log(`Parsed ${WORKFLOWS.length} workflows.`);

    for (let workflow of WORKFLOWS) {
      console.log(`Defining endpoint ${workflow.httpMethod.toUpperCase()} ${workflow.url}`);
      app[workflow.httpMethod](workflow.url, async (request: Request, response: Response, next: NextFunction) => {
        if (workflow.authWorkflow) {
          try {
            const authWorkflow = WORKFLOWS.find((w) => w.name === workflow.authWorkflow);
            const user = await new WorkflowExecutor(authWorkflow, request, response, next).execute(false);
            console.log('Auth workflow result', user);
            (request as any).user = user;
          } catch (err) {}
        }

        try {
          await new WorkflowExecutor(workflow, request, response, next).execute();
        } catch (err) {
          console.log(err);
          response.json(err);
        }
      });
    }
  } catch (err) {
    throw err;
  }
}
