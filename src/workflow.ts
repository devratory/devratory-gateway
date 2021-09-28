import { IStep } from "./step";
import { Request, Response, NextFunction } from 'express';

export interface IWorkflow {
    name: string;
    url: string;
    httpMethod: 'post' | 'get' | 'put' | 'delete' | 'patch',
    steps: IStep[];
}

export class Workflow {
    private _workflow: IWorkflow;

    constructor(workflowJSON: IWorkflow) {
        this._workflow = workflowJSON;
    }

    async execute(request: Request, response: Response, next: NextFunction) {
        response.json({
            works: true
        })
    }
}