import fs from 'fs';
import express from 'express';
import { Request, Response, NextFunction } from 'express';

import { IWorkflow, Workflow } from './workflow';

const app = express();
const PORT = process.env.PORT || 8000;
const workflowsPath = process.env.WORKFLOWS_JSON_PATH || 'workflows.json';

if (!process.env.WORKFLOWS_JSON_PATH) {
    console.log('Environment variable WORKFLOWS_JSON_PATH is not set. Trying to read workflows.json');
}

try {
    const WORKFLOWS: IWorkflow[] = JSON.parse(fs.readFileSync(workflowsPath, 'utf8'));
    console.log(`Parsed ${WORKFLOWS.length} workflow${WORKFLOWS.length > 1 ? 's' : ''}.`);
    
    for (let workflow of WORKFLOWS) {
        app[workflow.httpMethod](workflow.url, async (request: Request, response: Response, next: NextFunction) => {
            await new Workflow(workflow).execute(request, response, next);
        });
    }
} catch (err) {
    throw err;
}

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});